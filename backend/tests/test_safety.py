import io


def test_safety_analyze_demo_success(client):
    # Dummy JPEG image bytes (valid minimal image header)
    dummy_image = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 200)
    
    response = client.post(
        "/api/v1/safety/analyze",
        files={"image": ("site.jpg", dummy_image, "image/jpeg")},
        data={"site_description": "Perimeter scaffolding inspection", "force_demo": "true"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "safety_monitoring"
    assert "summary" in data
    assert isinstance(data["potential_hazards"], list)
    assert len(data["potential_hazards"]) > 0
    assert data["risk_level"] in ["low", "medium", "high", "critical", "unknown"]
    assert "recommendations" in data
    assert "limitations" in data
    assert data["is_demo"] is True


def test_safety_analyze_unsupported_media_type(client):
    dummy_pdf = io.BytesIO(b"%PDF-1.4 dummy file content" + b"\x00" * 100)
    response = client.post(
        "/api/v1/safety/analyze",
        files={"image": ("site.pdf", dummy_pdf, "application/pdf")},
    )
    assert response.status_code == 415
    assert "Unsupported file type" in response.json()["detail"]


def test_safety_analyze_empty_file(client):
    empty_file = io.BytesIO(b"")
    response = client.post(
        "/api/v1/safety/analyze",
        files={"image": ("empty.jpg", empty_file, "image/jpeg")},
    )
    assert response.status_code == 400
