def test_assistant_chat_concrete_query(client):
    payload = {
        "message": "What is the standard curing time for M30 grade concrete slabs?",
        "force_demo": True
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "response_text" in data
    assert len(data["response_text"]) > 20
    assert "technical_concepts" in data
    assert "suggested_followups" in data
    assert "professional_advisory_notice" in data
    assert data["session_id"] != ""


def test_assistant_chat_safety_query(client):
    payload = {
        "message": "Explain OSHA scaffolding guardrail height requirements and PPE hierarchy.",
        "force_demo": True
    }
    response = client.post("/api/v1/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "guardrail" in data["response_text"].lower() or "hierarchy" in data["response_text"].lower()
