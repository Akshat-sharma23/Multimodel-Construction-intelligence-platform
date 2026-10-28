from app.models.entities import AnalysisRecord


def test_history_list_and_filter(client, db_session):
    # Insert two test analysis records
    rec1 = AnalysisRecord(
        module="safety_monitoring",
        title="Scaffolding Inspection Level 2",
        summary="High risk fall hazard detected",
        risk_level="high",
        input_meta={},
        result_data={"key": "val1"},
        is_demo=True
    )
    rec2 = AnalysisRecord(
        module="crack_analysis",
        title="Beam B-4 Shear Crack",
        summary="Moderate diagonal crack",
        risk_level="moderate",
        input_meta={},
        result_data={"key": "val2"},
        is_demo=True
    )
    db_session.add(rec1)
    db_session.add(rec2)
    db_session.commit()

    # 1. Fetch all
    res_all = client.get("/api/v1/history")
    assert res_all.status_code == 200
    assert res_all.json()["total"] >= 2

    # 2. Filter by module
    res_filtered = client.get("/api/v1/history?module=safety_monitoring")
    assert res_filtered.status_code == 200
    for item in res_filtered.json()["items"]:
        assert item["module"] == "safety_monitoring"

    # 3. Search query
    res_search = client.get("/api/v1/history?search=Shear")
    assert res_search.status_code == 200
    assert any("Shear" in item["title"] for item in res_search.json()["items"])

    # 4. Get single record detail
    res_single = client.get(f"/api/v1/history/{rec1.id}")
    assert res_single.status_code == 200
    assert res_single.json()["title"] == "Scaffolding Inspection Level 2"

    # 5. Delete record
    res_del = client.delete(f"/api/v1/history/{rec1.id}")
    assert res_del.status_code == 200
    assert res_del.json()["success"] is True
