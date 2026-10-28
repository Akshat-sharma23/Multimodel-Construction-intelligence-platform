def test_project_planning_generate_success(client):
    payload = {
        "project_name": "Skyline Logistics Center",
        "project_type": "Industrial Warehouse",
        "project_description": "Single-story high-bay logistics warehouse with 24 loading docks.",
        "project_size": "120,000 sq ft",
        "start_date": "2026-11-01",
        "target_completion_date": "2027-05-01",
        "estimated_budget": "$4.5 Million",
        "constraints_and_requirements": "Pre-engineered steel building with ESFR fire sprinklers."
    }
    response = client.post("/api/v1/planning/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "project_planning"
    assert data["project_name"] == "Skyline Logistics Center"
    assert len(data["phases"]) > 0
    assert len(data["critical_path_summary"]) > 0
    assert len(data["potential_risks"]) > 0
    assert "saved_project_id" in data


def test_project_planning_invalid_dates(client):
    payload = {
        "project_name": "Backward Timeline",
        "project_type": "Residential",
        "project_description": "Testing inverted start and completion dates.",
        "project_size": "5,000 sq ft",
        "start_date": "2026-12-01",
        "target_completion_date": "2026-10-01"  # Completion before start!
    }
    response = client.post("/api/v1/planning/generate", json=payload)
    assert response.status_code == 400


def test_project_crud_lifecycle(client):
    # 1. Create a project
    create_payload = {
        "name": "Riverside Commercial Plaza",
        "project_type": "Commercial Office Fit-Out",
        "description": "5-story office building",
        "size": "50,000 sq ft",
        "start_date": "2026-11-01",
        "target_date": "2027-04-30",
        "budget": "$3.2M",
        "constraints": "Standard",
        "plan_data": {"phases": [{"name": "Phase 1"}]},
        "status": "Draft"
    }
    create_res = client.post("/api/v1/projects", json=create_payload)
    assert create_res.status_code == 200
    project_id = create_res.json()["id"]

    # 2. Get list
    list_res = client.get("/api/v1/projects")
    assert list_res.status_code == 200
    items = list_res.json()["items"]
    assert any(p["id"] == project_id for p in items)

    # 3. Get single project
    get_res = client.get(f"/api/v1/projects/{project_id}")
    assert get_res.status_code == 200
    assert get_res.json()["name"] == "Riverside Commercial Plaza"

    # 4. Delete project
    del_res = client.delete(f"/api/v1/projects/{project_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 5. Verify deletion
    verify_res = client.get(f"/api/v1/projects/{project_id}")
    assert verify_res.status_code == 404
