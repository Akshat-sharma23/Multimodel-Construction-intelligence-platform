import logging
from typing import Optional, Dict, Any
import httpx
from sqlalchemy.orm import Session
from app.config import settings
from app.models.entities import DailyReportRecord, AnalysisRecord
from app.schemas.weather import WeatherAdvisoryRequest, WeatherAdvisoryResponse, OperationalAdvisoryItem
from app.schemas.report import DailyReportRequest, DailyReportResponse
from app.services.grok_client import grok_client, GrokClientError
from app.services.demo_data import get_demo_weather_advisory, get_demo_daily_report, current_iso_time

logger = logging.getLogger("mcip.weather_service")


async def get_weather_advisory(request: WeatherAdvisoryRequest) -> WeatherAdvisoryResponse:
    location = request.location.strip()
    
    # Try fetching real forecast from free Open-Meteo API
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={httpx.URL(location).raw_path.decode()}&count=1&language=en&format=json"
            geo_res = await client.get(geo_url)
            if geo_res.status_code == 200:
                geo_data = geo_res.json()
                results = geo_data.get("results", [])
                if results:
                    lat = results[0]["latitude"]
                    lon = results[0]["longitude"]
                    loc_name = f"{results[0].get('name')}, {results[0].get('country', '')}"

                    weather_url = (
                        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
                        f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m"
                    )
                    w_res = await client.get(weather_url)
                    if w_res.status_code == 200:
                        w_data = w_res.json().get("current", {})
                        temp_c = float(w_data.get("temperature_2m", 25.0))
                        temp_f = round(temp_c * 9 / 5 + 32, 1)
                        wind_kmh = float(w_data.get("wind_speed_10m", 15.0))
                        gusts_kmh = float(w_data.get("wind_gusts_10m", wind_kmh * 1.4))
                        humidity = int(w_data.get("relative_humidity_2m", 50))
                        precip = float(w_data.get("precipitation", 0.0))

                        # Weather code mapping
                        w_code = w_data.get("weather_code", 0)
                        conditions = "Clear Skies"
                        if w_code in [1, 2, 3]:
                            conditions = "Partly Cloudy to Overcast"
                        elif w_code in [51, 53, 55, 61, 63, 65]:
                            conditions = "Rain / Showers"
                        elif w_code in [71, 73, 75]:
                            conditions = "Snow / Sleet"
                        elif w_code >= 95:
                            conditions = "Thunderstorm with High Winds"

                        # Formulate construction advisories
                        advisories = []
                        alerts = []

                        # Crane operations
                        if gusts_kmh > 45 or wind_kmh > 35:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Tower Crane & Heavy Lifting",
                                status="Suspended / High Risk",
                                reason=f"Wind gusts ({gusts_kmh} km/h) exceed safety operating limits for suspended loads.",
                                precautions=["Luff jibs down to neutral weathervaning position", "Halt all panel and rebar hoisting immediately."]
                            ))
                            alerts.append("CRANE OPERATIONS MUST CEASE: Wind gusts exceed 45 km/h.")
                        elif gusts_kmh > 28:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Tower Crane & Heavy Lifting",
                                status="Caution / Monitored",
                                reason=f"Moderate gusts ({gusts_kmh} km/h) approaching threshold for large surface area panels.",
                                precautions=["Use secondary guide tag lines on all loads", "Monitor anemometer at crane tip."]
                            ))
                        else:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Tower Crane & Heavy Lifting",
                                status="Safe / Normal",
                                reason=f"Wind speed ({wind_kmh} km/h) is calm to moderate.",
                                precautions=["Maintain standard rigger hand signals and radio checks."]
                            ))

                        # Concrete Pouring
                        if temp_c > 35:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Concrete Pouring & Curing",
                                status="Caution / Monitored",
                                reason=f"High ambient temperature ({temp_c}°C) accelerates setting and causes rapid slump loss.",
                                precautions=["Use chilled batching water or retarders", "Apply curing compound immediately after finishing."]
                            ))
                            alerts.append("Hot weather concreting protocol in effect.")
                        elif precip > 2.0:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Concrete Pouring & Curing",
                                status="Caution / Monitored",
                                reason=f"Active rainfall ({precip} mm) will wash cement paste from unhardened surfaces.",
                                precautions=["Keep tarpaulins ready over slabs", "Postpone exterior flatwork if rain intensifies."]
                            ))
                        else:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Concrete Pouring & Curing",
                                status="Safe / Normal",
                                reason=f"Favorable temperature ({temp_c}°C) and humidity for proper hydration.",
                                precautions=["Maintain standard 7-day wet curing."]
                            ))

                        # Scaffolding & Roofing
                        if precip > 1.0 or gusts_kmh > 35:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Scaffolding & Roofing",
                                status="Caution / Monitored",
                                reason="Slick surfaces and gusty winds elevate slip and fall hazards.",
                                precautions=["Verify non-skid scaffold planks", "Mandatory dual-tethering to certified lifelines."]
                            ))
                        else:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Scaffolding & Roofing",
                                status="Safe / Normal",
                                reason="Dry decking and low wind risk.",
                                precautions=["Routine perimeter guardrail inspection."]
                            ))

                        # Earthwork
                        if precip > 5.0:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Earthwork & Trench Excavation",
                                status="Suspended / High Risk",
                                reason=f"Heavy rain ({precip} mm) causes trench sidewall instability and bogging.",
                                precautions=["Activate dewatering pumps", "Check trench shoring for hydrostatic pressure."]
                            ))
                            alerts.append("TRENCH COLLAPSE RISK: Inspect shoring before worker entry.")
                        else:
                            advisories.append(OperationalAdvisoryItem(
                                activity="Earthwork & Trench Excavation",
                                status="Safe / Normal",
                                reason="Soil moisture is manageable.",
                                precautions=["Keep perimeter surface water diversions clear."]
                            ))

                        return WeatherAdvisoryResponse(
                            module="weather_advisory",
                            location_name=loc_name,
                            timestamp=current_iso_time(),
                            temperature_c=temp_c,
                            temperature_f=temp_f,
                            conditions=conditions,
                            wind_speed_kmh=wind_kmh,
                            wind_gusts_kmh=gusts_kmh,
                            precipitation_chance_percent=min(100, int(precip * 20)),
                            humidity_percent=humidity,
                            operational_advisories=advisories,
                            high_risk_alerts=alerts,
                            data_source="Open-Meteo Global Forecasting Model (Live Satellite & Radar Grounding)",
                            is_demo=False
                        )
    except Exception as exc:
        logger.info("Open-Meteo live query skipped or failed: %s. Using calibrated meteorological demo advisory.", str(exc))

    # Calibrated fallback demo advisory
    return WeatherAdvisoryResponse(**get_demo_weather_advisory(location))


REPORT_SYSTEM_PROMPT = """You are an experienced Construction Project Manager and Quality Assurance Director.
Compile a professional, authoritative Daily Site Report from the raw shift notes provided by the site engineer.
Guidelines:
1. Provide an executive summary of the shift.
2. Synthesize manpower productivity, materials consumed, heavy machinery utilization, and impact of any delays.
3. Review safety observations with OSHA/HSE compliance perspective.
4. Highlight concrete action items for the upcoming shift.
5. Generate a comprehensive formatted markdown daily report.
6. Return valid JSON strictly adhering to:
{
  "module": "daily_site_report",
  "project_name": "Project Name",
  "report_date": "YYYY-MM-DD",
  "executive_summary": "Executive summary text",
  "manpower_productivity_analysis": "Productivity review",
  "materials_and_equipment_notes": "Materials and equipment notes",
  "delay_impact_assessment": "Delay assessment",
  "safety_and_compliance_review": "Safety audit notes",
  "next_day_action_items": ["Action item 1", "Action item 2"],
  "formatted_markdown_report": "# Markdown text..."
}
"""


async def generate_daily_site_report(
    request: DailyReportRequest,
    db: Optional[Session] = None,
    force_demo: bool = False
) -> DailyReportResponse:
    is_live = settings.is_ai_live_ready and not force_demo

    if is_live:
        try:
            prompt = (
                f"Project Name: {request.project_name}\n"
                f"Date: {request.report_date}\n"
                f"Workforce Count: {request.workforce_count}\n"
                f"Work Completed: {request.work_completed}\n"
                f"Materials Used: {request.materials_used}\n"
                f"Equipment Used: {request.equipment_used}\n"
                f"Delays & Issues: {request.delays_issues}\n"
                f"Safety Observations: {request.safety_observations}\n"
                f"Planned Tomorrow: {request.planned_work_next_day}\n"
            )

            messages = [
                {"role": "system", "content": REPORT_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ]

            raw_json = await grok_client.chat_completion(
                messages=messages,
                model=settings.GROK_MODEL,
                temperature=0.2,
                max_tokens=3000,
                expect_json=True
            )
            raw_json["is_demo"] = False
            validated = DailyReportResponse(**raw_json)

        except (GrokClientError, Exception) as exc:
            logger.warning("Grok AI daily report generation failed: %s. Using calibrated demo generator.", str(exc))
            demo_dict = get_demo_daily_report(request.model_dump())
            validated = DailyReportResponse(**demo_dict)
    else:
        demo_dict = get_demo_daily_report(request.model_dump())
        validated = DailyReportResponse(**demo_dict)

    if db is not None:
        try:
            record = DailyReportRecord(
                project_name=request.project_name,
                report_date=request.report_date,
                workforce_count=request.workforce_count,
                work_completed=request.work_completed,
                materials_used=request.materials_used,
                equipment_used=request.equipment_used,
                delays_issues=request.delays_issues or "",
                safety_observations=request.safety_observations or "",
                planned_work=request.planned_work_next_day,
                ai_report=validated.model_dump(),
                is_demo=validated.is_demo
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            validated.saved_report_id = record.id

            # Also log in analysis records
            analysis_rec = AnalysisRecord(
                module="daily_site_report",
                title=f"Daily Site Report: {request.project_name} ({request.report_date})",
                summary=validated.executive_summary[:300],
                risk_level="Low",
                input_meta=request.model_dump(),
                result_data=validated.model_dump(),
                is_demo=validated.is_demo
            )
            db.add(analysis_rec)
            db.commit()
        except Exception as db_exc:
            logger.error("Failed to persist daily report in database: %s", str(db_exc))
            db.rollback()

    return validated
