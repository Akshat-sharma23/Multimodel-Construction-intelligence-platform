from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List


def current_iso_time() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def get_demo_safety_analysis(site_description: Optional[str] = None) -> Dict[str, Any]:
    return {
        "module": "safety_monitoring",
        "summary": "Visual inspection of active perimeter framing and scaffolding deck indicates multiple workers in high-visibility vests. Identified leading-edge hazard without mandatory secondary fall arrest tethering and missing mid-rail on the eastern tier.",
        "visible_elements": [
            "Modular tubular steel scaffolding system",
            "Four workers wearing high-visibility orange vests and safety helmets",
            "Mobile scissor lift positioned on concrete slab",
            "Temporary 110V electrical distribution panel and yellow trailing cables",
            "Perimeter safety net installed partially along the south elevation"
        ],
        "observations": [
            "Three workers are wearing compliant Class 2 high-visibility vests and ANSI Z89.1 hard hats.",
            "Scaffolding working platform has wood toe boards installed on the front edge.",
            "Trailing electrical extension cords cross the primary pedestrian access pathway without rubber cable ramps.",
            "Perimeter guardrail on Level 3 scaffolding is missing a mid-rail over a 3.2-meter span.",
            "No active fire extinguisher was visible near the temporary power distribution box."
        ],
        "potential_hazards": [
            {
                "description": "Missing mid-rail and incomplete toe-board on level 3 scaffold tier exposes workers to fall from height risk.",
                "severity": "high",
                "location_in_image": "Upper-right scaffold tier (Level 3)",
                "visible_evidence": "Top rail visible at ~1.0m, but void detected beneath with no intermediate barrier over 3m section."
            },
            {
                "description": "Trailing 110V power cables across designated pedestrian walking path create primary trip hazard.",
                "severity": "medium",
                "location_in_image": "Foreground center ground level",
                "visible_evidence": "Two high-visibility yellow power cables loosely coiled across concrete slab pathway."
            },
            {
                "description": "Worker operating near unprotected edge without verified lanyard tie-off to certified anchor point.",
                "severity": "high",
                "location_in_image": "Top-left edge framing",
                "visible_evidence": "Harness dorsal D-ring visible but safety lanyard is loose and unclipped to static lifeline."
            }
        ],
        "risk_level": "high",
        "recommendations": [
            "Immediately halt work on Level 3 scaffolding tier until compliant mid-rail (approx. 500mm height) is installed and green tag re-certified.",
            "Install heavy-duty polyurethane cable protectors/ramps across the primary slab access walkway.",
            "Conduct immediate edge-work toolbox talk: enforce 100% tie-off policy to overhead certified static lifelines.",
            "Place a certified 5kg ABC dry-powder fire extinguisher within 5 meters of the temporary power distribution cluster."
        ],
        "limitations": [
            "Analysis is strictly limited to visible 2D angles in the submitted photograph. Blindspots behind framing and lower basement excavation are not verified.",
            "Structural load ratings of scaffold anchoring into concrete slab cannot be verified visually.",
            "Worker respiratory protection compliance (N95/silica masks) could not be resolved due to distance/resolution."
        ],
        "is_demo": True,
        "timestamp": current_iso_time()
    }


def get_demo_crack_analysis(building_element: Optional[str] = None) -> Dict[str, Any]:
    element = building_element if building_element and building_element.strip() else "Reinforced Concrete Support Beam (B-14)"
    return {
        "module": "crack_analysis",
        "summary": f"Visual inspection of {element} reveals distinct diagonal shear crack patterns propagating at approximately 45 degrees outward from the support column face towards midspan, accompanied by hairline crazing along the soffit.",
        "building_element": element,
        "visual_crack_patterns": [
            {
                "pattern_type": "Diagonal Shear Crack (45-degree inclination)",
                "visual_severity": "moderate",
                "description": "Continuous inclined fracture running diagonally through the shear span. Visual width appears greater than 0.4mm with visible edge flaking.",
                "approximate_location": "Support zone, approximately 350mm from column junction on the web face",
                "characteristics": "Noticeable micro-spalling along crack lips; no visible rust staining or exposed rebar."
            },
            {
                "pattern_type": "Hairline Plastic Shrinkage Crazing",
                "visual_severity": "minor",
                "description": "Shallow, multi-directional web-like micro cracks on the unpainted concrete soffit.",
                "approximate_location": "Lower flange / soffit surface",
                "characteristics": "Non-structural superficial drying cracks typical of early curing phase."
            }
        ],
        "overall_visual_severity": "moderate",
        "possible_causes_hypothesis": [
            "Shear stress concentration exceeding concrete tensile capacity near the beam-column interface, possibly aggravated by load redistribution.",
            "Insufficient or widely spaced shear stirrups (shear reinforcement) in the high shear zone.",
            "Differential foundation settlement or thermal contraction induced tensile stresses."
        ],
        "recommended_actions": [
            "Install Avongard optical crack monitoring gauges or tell-tale plates across the diagonal fissure to record live movement over 14 days.",
            "Perform Ultrasonic Pulse Velocity (UPV) non-destructive testing to quantify internal crack depth and integrity.",
            "Evaluate temporary prop/acrow support placement beneath beam B-14 until load recalculation is completed.",
            "Engage a licensed Chartered/Professional Structural Engineer to review original structural drawings and verify shear capacity."
        ],
        "inspection_disclaimer": "AI-assisted visual assessment only. This analysis does not measure internal crack depth, core concrete strength, or rebar yield. Mandatory on-site verification by a licensed structural engineer is required before undertaking remedial grouting or load changes.",
        "is_demo": True,
        "timestamp": current_iso_time()
    }


def get_demo_valuation(
    city: str,
    locality: str,
    property_type: str,
    area_sqft: float,
    property_age_years: int,
    property_condition: str
) -> Dict[str, Any]:
    # Normalized regional base price per sq ft table
    city_lower = city.lower()
    if any(c in city_lower for c in ["new york", "san francisco", "london", "dubai", "austin"]):
        base_rate = 650.0
        currency = "USD"
    elif any(c in city_lower for c in ["mumbai", "delhi", "bengaluru", "bangalore", "pune", "hyderabad"]):
        base_rate = 140.0  # Normalized in USD (~11,500 INR/sqft)
        currency = "USD"
    else:
        base_rate = 220.0
        currency = "USD"

    # Property type multiplier
    type_mult = {
        "Apartment / Flat": 1.0,
        "Independent House / Villa": 1.35,
        "Commercial Office": 1.45,
        "Retail Store": 1.60,
        "Industrial Warehouse": 0.65,
        "Plot / Land": 1.15
    }.get(property_type, 1.0)

    # Condition adjustment
    cond_factor = {
        "Brand New / Under Construction": 0.08,  # +8%
        "Excellent": 0.05,                       # +5%
        "Good / Well Maintained": 0.0,           # 0%
        "Fair / Needs Minor Work": -0.08,        # -8%
        "Poor / Major Renovation Required": -0.22 # -22%
    }.get(property_condition, 0.0)

    # Depreciation calculation: 1.2% per year up to max 40%
    deprec_rate = min(0.40, property_age_years * 0.012)
    
    base_calc_rate = base_rate * type_mult
    base_gross_val = base_calc_rate * area_sqft
    deprec_val = base_gross_val * deprec_rate
    cond_adj_val = base_gross_val * cond_factor
    locality_premium = base_gross_val * 0.04

    net_val = round(base_gross_val - deprec_val + cond_adj_val + locality_premium, 2)
    min_val = round(net_val * 0.93, 2)
    max_val = round(net_val * 1.07, 2)
    price_sqft = round(net_val / area_sqft, 2)

    return {
        "module": "real_estate_valuation",
        "currency": currency,
        "estimated_price_min": min_val,
        "estimated_price_max": max_val,
        "estimated_price_midpoint": net_val,
        "price_per_sqft": price_sqft,
        "valuation_methodology": "Comparative Market Approach coupled with Depreciated Replacement Cost (DRC) formula. Accounts for local locality zoning, asset age depreciation curve, structural condition adjustments, and commercial/residential floor plate efficiency.",
        "breakdown": {
            "base_rate_per_sqft": round(base_calc_rate, 2),
            "base_value": round(base_gross_val, 2),
            "age_depreciation_percent": round(deprec_rate * 100, 1),
            "age_depreciation_amount": round(deprec_val, 2),
            "condition_adjustment_percent": round(cond_factor * 100, 1),
            "condition_adjustment_amount": round(cond_adj_val, 2),
            "locality_tier_factor": 1.04,
            "locality_adjustment_amount": round(locality_premium, 2),
            "net_calculated_value": net_val
        },
        "inputs_used": {
            "city": city,
            "locality": locality,
            "property_type": property_type,
            "area_sqft": area_sqft,
            "property_age_years": property_age_years,
            "property_condition": property_condition
        },
        "benchmark_comparables": [
            {
                "locality": locality,
                "property_type": property_type,
                "area_sqft": round(area_sqft * 0.95, 0),
                "price_per_sqft": round(price_sqft * 0.98, 2),
                "transaction_type": "Recent Registered Sale (Q2 2026)",
                "source": "Municipal Registry & Real Estate Index Benchmark"
            },
            {
                "locality": locality,
                "property_type": property_type,
                "area_sqft": round(area_sqft * 1.05, 0),
                "price_per_sqft": round(price_sqft * 1.03, 2),
                "transaction_type": "Verified Active Listing",
                "source": "Commercial MLS & Portal Aggregator"
            },
            {
                "locality": f"{locality} Outer Buffer",
                "property_type": property_type,
                "area_sqft": round(area_sqft * 1.12, 0),
                "price_per_sqft": round(price_sqft * 0.94, 2),
                "transaction_type": "Underwriting Valuation Sample",
                "source": "Banking Lending Portfolio Benchmark"
            }
        ],
        "confidence_level": "Medium",
        "limitations_warning": "This estimate is generated algorithmically for preliminary feasibility and illustrative portfolio screening. It does not constitute a certified appraisal under USPAP/RICS guidelines. Legal titles, encumbrances, physical boundary survey, and internal fit-out specifications must be appraised by a certified valuer.",
        "is_demo": True,
        "timestamp": current_iso_time()
    }


def get_demo_project_plan(
    project_name: str,
    project_type: str,
    project_size: str,
    start_date: str,
    target_date: str,
    budget: Optional[str] = None
) -> Dict[str, Any]:
    s_date = datetime.strptime(start_date, "%Y-%m-%d")
    
    def add_d(days: int) -> str:
        return (s_date + timedelta(days=days)).strftime("%Y-%m-%d")

    return {
        "module": "project_planning",
        "project_name": project_name,
        "project_summary": f"Comprehensive 5-phase execution master schedule for {project_name} ({project_type}, estimated {project_size}). Synchronized for civil engineering handoffs, MEP rough-ins, architectural finishes, and municipal commissioning.",
        "total_estimated_days": 180,
        "phases": [
            {
                "name": "Phase 1: Pre-Construction & Mobilization",
                "duration_weeks": 4,
                "description": "Geotechnical borings, municipal permit approvals, contractor mobilization, boundary fencing, and temporary power/water hookup.",
                "key_milestone": "Notice to Proceed (NTP) & Site Mobilization Signed Off",
                "tasks": [
                    {
                        "id": "T101",
                        "phase": "Phase 1",
                        "title": "Site Boundary Survey & Soil Test Boreholes",
                        "duration_days": 10,
                        "suggested_start": add_d(0),
                        "suggested_end": add_d(10),
                        "dependencies": [],
                        "assigned_trade": "Geotechnical & Surveyors",
                        "critical_path": True,
                        "deliverables": "Certified Soil Investigation Report & Topographical Base Map"
                    },
                    {
                        "id": "T102",
                        "phase": "Phase 1",
                        "title": "Municipal Building Permits & Environmental Clearances",
                        "duration_days": 15,
                        "suggested_start": add_d(5),
                        "suggested_end": add_d(20),
                        "dependencies": ["T101"],
                        "assigned_trade": "Liaison & Architectural Compliance",
                        "critical_path": True,
                        "deliverables": "Approved Structural & Environmental Building Sanctions"
                    },
                    {
                        "id": "T103",
                        "phase": "Phase 1",
                        "title": "Site Mobilization & Temporary Utilities Installation",
                        "duration_days": 8,
                        "suggested_start": add_d(20),
                        "suggested_end": add_d(28),
                        "dependencies": ["T102"],
                        "assigned_trade": "General Contractor Utilities Team",
                        "critical_path": False,
                        "deliverables": "Secure Site Hoarding, 415V Power Panel & Potable Water Connection"
                    }
                ]
            },
            {
                "name": "Phase 2: Substructure & Foundation",
                "duration_weeks": 6,
                "description": "Deep excavation, sheet piling/shoring, mud mat placement, steel rebar reinforcement, and mass foundation concrete pours.",
                "key_milestone": "Foundation Plinth Level Poured and Cured",
                "tasks": [
                    {
                        "id": "T201",
                        "phase": "Phase 2",
                        "title": "Earthwork Bulk Excavation & Trench Shoring",
                        "duration_days": 14,
                        "suggested_start": add_d(28),
                        "suggested_end": add_d(42),
                        "dependencies": ["T103"],
                        "assigned_trade": "Earthmoving & Shoring Specialists",
                        "critical_path": True,
                        "deliverables": "Formation Level Cut with Shored Trench Safe Zones"
                    },
                    {
                        "id": "T202",
                        "phase": "Phase 2",
                        "title": "Sub-Base Blinding & Anti-Termite Waterproofing",
                        "duration_days": 6,
                        "suggested_start": add_d(42),
                        "suggested_end": add_d(48),
                        "dependencies": ["T201"],
                        "assigned_trade": "Waterproofing Specialists",
                        "critical_path": False,
                        "deliverables": "PCC Mud Mat & 1.5mm SBS Waterproof Membrane Barrier"
                    },
                    {
                        "id": "T203",
                        "phase": "Phase 2",
                        "title": "Raft/Footing Rebar Tying & M35 Ready-Mix Pour",
                        "duration_days": 18,
                        "suggested_start": add_d(48),
                        "suggested_end": add_d(66),
                        "dependencies": ["T201", "T202"],
                        "assigned_trade": "Reinforced Concrete / Steel Fixers",
                        "critical_path": True,
                        "deliverables": "Monolithic Foundation Slab with 7-Day & 28-Day Cube Compressive Tests"
                    }
                ]
            },
            {
                "name": "Phase 3: Superstructure Frame & Envelope",
                "duration_weeks": 8,
                "description": "Column casting, post-tensioned / RCC suspended slabs, perimeter masonry, curtain wall glass, and weatherproofing envelope.",
                "key_milestone": "Structural Top-Out & Watertight Building Shell",
                "tasks": [
                    {
                        "id": "T301",
                        "phase": "Phase 3",
                        "title": "RCC Columns, Shear Walls & Suspended Deck Slabs",
                        "duration_days": 35,
                        "suggested_start": add_d(66),
                        "suggested_end": add_d(101),
                        "dependencies": ["T203"],
                        "assigned_trade": "Structural Concrete Framing Crew",
                        "critical_path": True,
                        "deliverables": "Cast Superstructure Frame with Certified Stripping Strengths"
                    },
                    {
                        "id": "T302",
                        "phase": "Phase 3",
                        "title": "Exterior Infill Masonry & Fenestration Openings",
                        "duration_days": 20,
                        "suggested_start": add_d(95),
                        "suggested_end": add_d(115),
                        "dependencies": ["T301"],
                        "assigned_trade": "Masonry Contractors",
                        "critical_path": False,
                        "deliverables": "Autoclaved Aerated Concrete (AAC) Perimeter Walls with Lintels"
                    },
                    {
                        "id": "T303",
                        "phase": "Phase 3",
                        "title": "Roof Waterproofing & Façade Glazing Sealing",
                        "duration_days": 15,
                        "suggested_start": add_d(110),
                        "suggested_end": add_d(125),
                        "dependencies": ["T302"],
                        "assigned_trade": "Façade & Waterproofing Crew",
                        "critical_path": True,
                        "deliverables": "100% Watertight Building Envelope Certificate"
                    }
                ]
            },
            {
                "name": "Phase 4: MEP Rough-Ins & Interior Finishes",
                "duration_weeks": 5,
                "description": "HVAC ducting, electrical conduit, plumbing risers, fire sprinklers, drywall partitions, tiling, and acoustic ceiling grids.",
                "key_milestone": "MEP Pressure Testing & Drywall Enclosure Completed",
                "tasks": [
                    {
                        "id": "T401",
                        "phase": "Phase 4",
                        "title": "Mechanical, Electrical & Fire Protection Rough-Ins",
                        "duration_days": 25,
                        "suggested_start": add_d(125),
                        "suggested_end": add_d(150),
                        "dependencies": ["T303"],
                        "assigned_trade": "MEP Subcontractors",
                        "critical_path": True,
                        "deliverables": "Hydrostatic Pipe Pressure Tests & Insulation Resistance Logs"
                    },
                    {
                        "id": "T402",
                        "phase": "Phase 4",
                        "title": "Drywall Partitions, Plastering & Flooring Tiles",
                        "duration_days": 20,
                        "suggested_start": add_d(135),
                        "suggested_end": add_d(155),
                        "dependencies": ["T401"],
                        "assigned_trade": "Interior Trades & Tiling",
                        "critical_path": False,
                        "deliverables": "Primed Gypsum Board Walls & Anti-Skid Floor Finishes"
                    }
                ]
            },
            {
                "name": "Phase 5: Commissioning, Snagging & Handover",
                "duration_weeks": 3,
                "description": "Equipment startup, balancing (TAB), local fire authority inspection, snag list rectification, final deep clean, and occupancy certificate.",
                "key_milestone": "Building Occupancy Permit (BOP) & Client Key Handover",
                "tasks": [
                    {
                        "id": "T501",
                        "phase": "Phase 5",
                        "title": "Testing, Adjusting & Balancing (TAB) of HVAC & Elevators",
                        "duration_days": 12,
                        "suggested_start": add_d(155),
                        "suggested_end": add_d(167),
                        "dependencies": ["T401", "T402"],
                        "assigned_trade": "Commissioning Agents & Elevator Engineers",
                        "critical_path": True,
                        "deliverables": "Integrated Commissioning & Airflow Certification"
                    },
                    {
                        "id": "T502",
                        "phase": "Phase 5",
                        "title": "Statutory Fire Safety Audit & Occupancy Inspection",
                        "duration_days": 8,
                        "suggested_start": add_d(167),
                        "suggested_end": add_d(175),
                        "dependencies": ["T501"],
                        "assigned_trade": "Safety & Authority Inspection Team",
                        "critical_path": True,
                        "deliverables": "Final Fire NOC & Municipal Certificate of Occupancy"
                    },
                    {
                        "id": "T503",
                        "phase": "Phase 5",
                        "title": "Punch List (Snagging) Clearance & Final Clean",
                        "duration_days": 5,
                        "suggested_start": add_d(175),
                        "suggested_end": add_d(180),
                        "dependencies": ["T502"],
                        "assigned_trade": "General Contractor Turnover Team",
                        "critical_path": True,
                        "deliverables": "Signed Client Handover Certificate & As-Built BIM Archive"
                    }
                ]
            }
        ],
        "critical_path_summary": [
            "T101 (Geotechnical Soil Survey) -> T102 (Permits) -> T201 (Excavation) -> T203 (Raft Foundation Pour)",
            "T301 (Superstructure RCC Frame) -> T303 (Watertight Shell) -> T401 (MEP Rough-Ins)",
            "T501 (TAB Commissioning) -> T502 (Fire Inspection) -> T503 (Client Handover)"
        ],
        "potential_risks": [
            {
                "risk": "Monsoon / heavy rainfall during Phase 2 excavation leading to pit inundation and sidewall collapse.",
                "probability": "Medium",
                "impact": "High",
                "mitigation_strategy": "Install perimeter dewatering sump pumps, continuous perimeter berms, and keep geotextile tarpaulins on site."
            },
            {
                "risk": "Lead-time delays in custom HVAC chillers and switchgear panels.",
                "probability": "High",
                "impact": "Medium",
                "mitigation_strategy": "Place long-lead equipment procurement orders during pre-construction Phase 1 with weekly vendor milestone tracking."
            },
            {
                "risk": "Subcontractor labor shortages during peak interior and tiling phases.",
                "probability": "Medium",
                "impact": "Medium",
                "mitigation_strategy": "Pre-qualify backup secondary trade contractors and incorporate milestone productivity bonuses into subcontract agreements."
            }
        ],
        "milestones": [
            {"title": "M1: Site Mobilization & Sanctions", "target_date": add_d(28), "deliverable": "Approved building sanctions and power hookup"},
            {"title": "M2: Plinth & Foundation Completion", "target_date": add_d(66), "deliverable": "Cured raft foundation slab"},
            {"title": "M3: Superstructure Top-Out", "target_date": add_d(101), "deliverable": "Structural RCC frame cast"},
            {"title": "M4: Watertight Shell & MEP Rough-Ins", "target_date": add_d(150), "deliverable": "Enclosed envelope with tested rough-in utilities"},
            {"title": "M5: Final Occupancy & Handover", "target_date": add_d(180), "deliverable": "Occupancy certificate & client keys"}
        ],
        "preliminary_disclaimer": "This baseline schedule is generated algorithmically for planning decision-support. Actual project durations depend upon daily weather conditions, material supply chain lead times, municipal authority turnaround, and contractor manpower mobilization. Review with your lead project manager and structural consultants.",
        "is_demo": True,
        "timestamp": current_iso_time()
    }


def get_demo_assistant_response(message: str) -> Dict[str, Any]:
    msg_lower = message.lower()
    
    if "concrete" in msg_lower or "curing" in msg_lower or "strength" in msg_lower:
        text = (
            "### Concrete Curing Procedures & Best Practices\n\n"
            "Concrete reaches approximately **70% of its design compressive strength in 7 days** and **99% at 28 days** under standard moisture curing (ASTM C31 / IS 456).\n\n"
            "#### Recommended Curing Regimes:\n"
            "1. **Ponding or Continuous Wet Burlap (Hessian Cloth):** Minimum 7 to 10 days for Ordinary Portland Cement (OPC); minimum 14 days when using blended pozzolanic cements (PPC / Slag / Fly Ash).\n"
            "2. **Liquid Membrane-Forming Curing Compounds:** Apply uniformly immediately after surface sheen disappears to prevent rapid moisture evaporation and surface crazing.\n"
            "3. **Thermal Shock Caution:** In hot weather (>35°C / 95°F), keep water-to-cement ratio strictly monitored, use chilled mixing water or liquid nitrogen if needed, and avoid cold-water thermal shock on freshly placed slabs."
        )
        concepts = ["Compressive Strength", "ASTM C31 Standard", "Hydration Heat", "Pozzolanic Cements"]
        followups = ["What are the differences between OPC 43 and OPC 53 grades?", "How does temperature affect slump retention?", "What admixtures accelerate early curing?"]
    elif "safety" in msg_lower or "ppe" in msg_lower or "osha" in msg_lower:
        text = (
            "### Construction Site Safety & Personal Protective Equipment (PPE)\n\n"
            "A proactive zero-harm safety culture requires strict adherence to statutory safety regulations (OSHA 1926 / HSE regulations):\n\n"
            "#### Fundamental Hierarchy of Controls:\n"
            "1. **Elimination / Substitution:** Design out hazards (e.g. prefabrication at ground level rather than working at height).\n"
            "2. **Engineering Controls:** Physical edge guardrails (top-rail at 42 inches ± 3 inches, mid-rail at 21 inches, toe-boards at 3.5 inches), trench boxes for excavations deeper than 5 feet (1.5m).\n"
            "3. **Administrative Controls:** Daily Toolbox Talks (TBT), Lock-Out/Tag-Out (LOTO) procedures, Permit-to-Work (PTW) for hot work and confined spaces.\n"
            "4. **PPE Requirements:** Type I/II hard hats, ANSI Z87.1 eye protection, puncture-resistant steel-toe boots, and certified full-body harness with shock-absorbing lanyards for work above 6 feet."
        )
        concepts = ["Hierarchy of Controls", "OSHA 1926 Fall Protection", "Permit to Work (PTW)", "Toolbox Talks (TBT)"]
        followups = ["What are the inspection rules for mobile scaffolding?", "When is an excavation classified as a confined space?", "How do you calculate safe fall clearance?"]
    elif "crack" in msg_lower or "settlement" in msg_lower or "rebar" in msg_lower:
        text = (
            "### Differentiating Structural vs. Non-Structural Cracks\n\n"
            "#### 1. Non-Structural Cracks:\n"
            "- **Plastic Shrinkage:** Shallow, hairline (<0.2mm), occurring within hours of placement due to rapid surface water loss.\n"
            "- **Thermal Expansion/Contraction:** Regular intervals along long unarticulated walls or slabs without expansion joints.\n\n"
            "#### 2. Structural Warning Signs (Require Immediate Engineering Attention):\n"
            "- **45° Diagonal Cracks near Beam Supports:** Direct indicator of shear distress.\n"
            "- **Sagging Midspan Cracks at Beam Bottoms:** Flexural failure warning; indicates tensile steel yielding.\n"
            "- **Stepped Diagonal Cracks in Brick Masonry:** Typically indicates differential foundation settlement.\n"
            "- **Horizontal Cracks with Rust Staining:** Reinforcing bar corrosion and expansive oxide spalling."
        )
        concepts = ["Shear Failure", "Differential Settlement", "Rebar Carbonation", "Ultrasonic Testing"]
        followups = ["How to install an optical crack monitoring gauge?", "What epoxy injection specifications apply to structural cracks?", "What causes concrete spalling near coastal environments?"]
    else:
        text = (
            "### AI Construction Assistant Guidance\n\n"
            "I assist construction managers, site engineers, project planners, and cost estimators with multimodal project decision-support.\n\n"
            "#### Areas I can help you with:\n"
            "- **Materials & Specifications:** Concrete mix designs, structural steel grades, MEP insulation, green building certification standards.\n"
            "- **Site Safety & Regulatory Compliance:** OSHA/HSE standards, excavation trenching regulations, scaffolding tags, fall prevention.\n"
            "- **Planning & Lean Scheduling:** Work breakdown structures, critical path method (CPM), delay mitigation strategies.\n"
            "- **Quality Control & Defect Analysis:** Evaluating non-destructive testing (NDT), crack diagnostics, honeycombing remediation.\n\n"
            "*Ask any specific question or paste daily site notes to generate an executive report.*"
        )
        concepts = ["Critical Path Method", "Lean Construction", "Quality Assurance (QA/QC)", "Multimodal Diagnostics"]
        followups = ["How do I calculate concrete formwork striking times?", "What are the key causes of project cost overruns in commercial builds?", "Can you help me format a daily site delay report?"]

    return {
        "response_text": text,
        "technical_concepts": concepts,
        "suggested_followups": followups,
        "professional_advisory_notice": "Guidance generated by AI for educational and preliminary decision-support. Safety-critical construction practices, structural repairs, and engineering calculations must be confirmed by certified on-site professional engineers.",
        "is_demo": True,
        "session_id": "demo-session-mcip"
    }


def get_demo_weather_advisory(location: str) -> Dict[str, Any]:
    return {
        "module": "weather_advisory",
        "location_name": location.title(),
        "timestamp": current_iso_time(),
        "temperature_c": 26.5,
        "temperature_f": 79.7,
        "conditions": "Partly Cloudy with Moderate Breezes",
        "wind_speed_kmh": 22.0,
        "wind_gusts_kmh": 34.0,
        "precipitation_chance_percent": 15,
        "humidity_percent": 58,
        "operational_advisories": [
            {
                "activity": "Concrete Pouring & Slabs",
                "status": "Safe / Normal",
                "reason": "Temperature (26.5°C) and moderate humidity are well within optimal hydration thresholds. Slump loss is manageable.",
                "precautions": ["Ensure prompt application of curing compound to prevent wind-induced moisture evaporation."]
            },
            {
                "activity": "Tower Crane & Heavy Lifting",
                "status": "Caution / Monitored",
                "reason": "Wind gusts reaching 34 km/h approaching site caution threshold (standard limits typically 38-45 km/h for large sail-area panels).",
                "precautions": [
                    "Continuous anemometer monitoring at crane jib tip.",
                    "Tag-lines mandatory for all suspended cladding and rebar bundles.",
                    "Do not lift prefabricated facade panels if gusts exceed 35 km/h."
                ]
            },
            {
                "activity": "Scaffolding & Roofing Work",
                "status": "Safe / Normal",
                "reason": "Dry deck conditions and wind speeds permit routine upper-level work.",
                "precautions": ["Ensure all loose plywood sheets and lightweight debris on roof decks are tied down."]
            },
            {
                "activity": "Earthwork & Deep Excavation",
                "status": "Safe / Normal",
                "reason": "Low precipitation probability (15%) indicates stable trench slopes and firm haul road conditions.",
                "precautions": ["Maintain routine perimeter silt fence checks."]
            },
            {
                "activity": "Exterior Facade Spray Painting",
                "status": "Caution / Monitored",
                "reason": "Breezes above 20 km/h may cause paint overspray drift onto parked vehicles and adjacent properties.",
                "precautions": ["Use roller application or install protective mesh containment netting around exterior bays."]
            }
        ],
        "high_risk_alerts": [
            "Monitor wind gust speeds between 14:00 and 17:00 hours for tower crane heavy panel hoisting."
        ],
        "data_source": "MCIP Meteorological Forecasting Service (Calibrated Historical & Open-Meteo Model)",
        "is_demo": True
    }


def get_demo_daily_report(data: Dict[str, Any]) -> Dict[str, Any]:
    project_name = data.get("project_name", "Metro Tower Commercial Complex")
    report_date = data.get("report_date", datetime.now().strftime("%Y-%m-%d"))
    workforce = data.get("workforce_count", 48)
    work_completed = data.get("work_completed", "Completed column casting for Level 4 Grid B-D. Installed 400m electrical conduit.")
    materials = data.get("materials_used", "24 m3 M35 ready-mix concrete, 3.2 metric tons TMT rebar, 400m PVC conduit.")
    equipment = data.get("equipment_used", "1x Concrete Boom Pump, 1x Tower Crane, 2x Plate Compactors.")
    delays = data.get("delays_issues", "30-minute delay due to delayed concrete transit mixer arrival in morning traffic.")
    safety = data.get("safety_observations", "All workers complied with 100% hard hat and high-vis vest policy. One near-miss trip over trailing hose corrected immediately.")
    next_day = data.get("planned_work_next_day", "Strip Level 4 column forms; begin beam bottom shuttering for Grid A-F.")

    md_report = f"""# Daily Construction Site Report
**Project Name:** {project_name}  
**Date of Record:** {report_date}  
**Total Workforce On-Site:** {workforce} Personnel  
**Weather Condition:** Cleared / Workable  

---

### 1. Executive Summary
During the work shift on {report_date}, major civil and MEP trades progressed according to milestone schedules. The primary focus was structural casting and rough-in electrical infrastructure. Overall shift productivity was verified at **94% efficiency**.

### 2. Work Completed & Trade Progress
- {work_completed}
- Inspection of rebar cover blocks verified prior to concrete placement.
- Quality assurance slump test recorded at 120mm ± 15mm; test cubes collected (3 for 7-day, 3 for 28-day break).

### 3. Resource & Material Utilization
- **Materials Consumed:** {materials}
- **Heavy Equipment Deployed:** {equipment}
- Equipment inspected for pre-operational hydraulic fluid levels and safety cut-offs.

### 4. Delay & Bottleneck Analysis
- **Reported Impact:** {delays}
- **Action Taken:** Concrete batching plant notified to dispatch transit mixers with staggered 20-minute lead time to avoid arterial traffic congestion tomorrow.

### 5. Safety, Environment & Quality Audit
- **Observations:** {safety}
- Tool Box Talk (TBT) conducted at 07:45 AM focusing on concrete placement slip hazards and electrical safety.

### 6. Planned Objectives for Next Shift
- {next_day}
- Material deliveries scheduled: 12 tons of FE500D rebar expected at 08:30 AM.

---
*Generated by MCIP Intelligence Engine. Approved by Site Project Manager.*
"""

    return {
        "module": "daily_site_report",
        "project_name": project_name,
        "report_date": report_date,
        "executive_summary": f"Successful shift completion on {report_date} with {workforce} workers on site. Core structural casting milestone accomplished with minimal traffic-related transit delay.",
        "manpower_productivity_analysis": f"Shift utilized {workforce} skilled and unskilled tradesmen across civil, carpentry, and electrical domains. Productivity index remained above target.",
        "materials_and_equipment_notes": f"Consumed {materials}. Heavy equipment ({equipment}) operated without mechanical breakdown.",
        "delay_impact_assessment": f"Reported issue: '{delays}'. Impact contained within shift contingency float without critical path slippage.",
        "safety_and_compliance_review": f"Safety audit: {safety}. Zero lost-time incidents (LTI) recorded.",
        "next_day_action_items": [
            f"Mobilize shuttering carpentry crew for: {next_day}",
            "Coordinate batch plant schedule to avoid peak municipal traffic hours.",
            "Verify Level 4 cube compressive test schedule with external certified lab."
        ],
        "formatted_markdown_report": md_report,
        "is_demo": True
    }
