def test_valuation_estimate_valid(client):
    payload = {
        "city": "Austin",
        "locality": "Downtown",
        "property_type": "Apartment / Flat",
        "area_sqft": 1250,
        "bedrooms": 2,
        "bathrooms": 2,
        "property_age_years": 4,
        "property_condition": "Excellent",
        "additional_features": ["Covered Parking", "Balcony"]
    }
    response = client.post("/api/v1/valuation/estimate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["module"] == "real_estate_valuation"
    assert data["estimated_price_midpoint"] > 0
    assert data["estimated_price_min"] < data["estimated_price_midpoint"]
    assert data["estimated_price_max"] > data["estimated_price_midpoint"]
    assert "breakdown" in data
    assert "benchmark_comparables" in data
    assert len(data["benchmark_comparables"]) > 0
    assert "limitations_warning" in data


def test_valuation_estimate_invalid_area(client):
    payload = {
        "city": "Mumbai",
        "locality": "Bandra",
        "property_type": "Apartment / Flat",
        "area_sqft": 20,  # Below minimum 50 sqft
        "property_age_years": 5,
        "property_condition": "Good / Well Maintained"
    }
    response = client.post("/api/v1/valuation/estimate", json=payload)
    assert response.status_code == 422
