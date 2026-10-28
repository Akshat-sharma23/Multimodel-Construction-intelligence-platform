def test_weather_advisory_endpoint(client):
    payload = {"location": "London"}
    response = client.post("/api/v1/weather/advisory", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "weather_advisory"
    assert "temperature_c" in data
    assert "operational_advisories" in data
    assert len(data["operational_advisories"]) > 0


def test_daily_site_report_generate(client):
    payload = {
        "project_name": "Apex Tower",
        "report_date": "2026-10-28",
        "workforce_count": 52,
        "work_completed": "Completed casting of 4th floor columns.",
        "materials_used": "30 m3 concrete, 4 tons rebar.",
        "equipment_used": "1 tower crane, 1 boom pump.",
        "delays_issues": "30 min delay due to transit mixer traffic.",
        "safety_observations": "Full PPE compliance, no incidents.",
        "planned_work_next_day": "Formwork stripping and shuttering."
    }
    response = client.post("/api/v1/reports/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "daily_site_report"
    assert data["project_name"] == "Apex Tower"
    assert "formatted_markdown_report" in data
    assert "saved_report_id" in data


def test_daily_reports_list(client):
    response = client.get("/api/v1/reports")
    assert response.status_code == 200
    assert "items" in response.json()
