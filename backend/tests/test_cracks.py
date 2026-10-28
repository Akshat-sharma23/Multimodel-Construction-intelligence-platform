import io


def test_crack_analyze_demo_success(client):
    dummy_image = io.BytesIO(b"\xff\xd8\xff\xe0\x00\x10JFIF" + b"\x00" * 200)
    response = client.post(
        "/api/v1/cracks/analyze",
        files={"image": ("crack.jpg", dummy_image, "image/jpeg")},
        data={"building_element": "Reinforced Concrete Beam B-14", "force_demo": "true"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "crack_analysis"
    assert "summary" in data
    assert "visual_crack_patterns" in data
    assert len(data["visual_crack_patterns"]) > 0
    assert data["overall_visual_severity"] in ["negligible", "minor", "moderate", "severe", "uncertain"]
    assert "inspection_disclaimer" in data
    assert "licensed structural engineer" in data["inspection_disclaimer"].lower()
    assert data["is_demo"] is True


def test_crack_analyze_invalid_type(client):
    dummy_txt = io.BytesIO(b"just text" * 20)
    response = client.post(
        "/api/v1/cracks/analyze",
        files={"image": ("crack.txt", dummy_txt, "text/plain")},
    )
    assert response.status_code == 415
