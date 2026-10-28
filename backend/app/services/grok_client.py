import json
import logging
import re
from typing import Dict, Any, Optional, List
import httpx
from app.config import settings

logger = logging.getLogger("mcip.grok_client")


class GrokClientError(Exception):
    """Custom exception for Grok API client errors."""
    def __init__(self, message: str, status_code: int = 500, details: Optional[Any] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class GrokClient:
    def __init__(self):
        self.base_url = settings.XAI_BASE_URL.rstrip("/")
        self.api_key = settings.XAI_API_KEY.strip()
        self.timeout = 45.0

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key != "your_xai_api_key_here" and len(self.api_key) > 8)

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "User-Agent": "MCIP-Platform/1.0"
        }

    @staticmethod
    def clean_json_response(content: str) -> Dict[str, Any]:
        """Strips markdown code fences (e.g. ```json ... ```) and parses JSON."""
        content = content.strip()
        
        # Match ```json ... ``` or ``` ... ```
        json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", content)
        if json_match:
            content = json_match.group(1).strip()
            
        try:
            return json.loads(content)
        except json.JSONDecodeError as exc:
            # Fallback: attempt to find first '{' and last '}'
            start = content.find("{")
            end = content.rfind("}")
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(content[start:end+1])
                except json.JSONDecodeError:
                    pass
            logger.error("Failed to parse JSON from Grok response: %s", content[:200])
            raise GrokClientError(
                message="Grok model returned an invalid JSON structure.",
                status_code=502,
                details=content[:500]
            ) from exc

    async def chat_completion(
        self,
        messages: List[Dict[str, Any]],
        model: Optional[str] = None,
        temperature: float = 0.2,
        max_tokens: int = 2500,
        expect_json: bool = True
    ) -> Dict[str, Any]:
        """Calls xAI OpenAI-compatible chat completions endpoint."""
        if not self.is_configured:
            raise GrokClientError(
                message="xAI Grok API key is not configured. Enable AI_DEMO_MODE=true or set XAI_API_KEY in backend/.env",
                status_code=503
            )

        selected_model = model or settings.GROK_MODEL
        url = f"{self.base_url}/chat/completions"

        payload = {
            "model": selected_model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(url, headers=self._get_headers(), json=payload)
            except httpx.TimeoutException as exc:
                logger.error("Timeout connecting to xAI Grok API at %s", url)
                raise GrokClientError("Upstream Grok API request timed out after 45s.", status_code=504) from exc
            except httpx.RequestError as exc:
                logger.error("Network error connecting to xAI Grok API: %s", str(exc))
                raise GrokClientError("Unable to reach xAI Grok API servers.", status_code=502) from exc

        if response.status_code == 401:
            raise GrokClientError("Authentication failed: invalid xAI API key.", status_code=401)
        elif response.status_code == 429:
            raise GrokClientError("xAI Grok API rate limit or quota exceeded.", status_code=429)
        elif response.status_code >= 400:
            error_body = response.text[:300]
            logger.error("Grok API error HTTP %d: %s", response.status_code, error_body)
            raise GrokClientError(
                f"Grok API error ({response.status_code}): {error_body}",
                status_code=response.status_code
            )

        data = response.json()
        choices = data.get("choices", [])
        if not choices:
            raise GrokClientError("Grok API returned an empty choices list.", status_code=502)

        content = choices[0].get("message", {}).get("content", "")
        if not content:
            raise GrokClientError("Grok API returned an empty response content.", status_code=502)

        if expect_json:
            return self.clean_json_response(content)
        return {"raw_text": content}


grok_client = GrokClient()
