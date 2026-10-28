def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "app_name" in data
    assert "live_ai_ready" in data
    assert "grok_model" in data


def test_system_status(client):
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    data = response.json()
    assert "database_connected" in data
    assert data["database_connected"] is True
    assert "storage_type" in data
