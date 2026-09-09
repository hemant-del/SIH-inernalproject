import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.scheme import Scheme
from app.models.partner import Partner
from app.models.application import Application
import random
from datetime import datetime, timedelta

# Realistic Indian bank/corporation names for partners
PARTNER_NAMES = [
    "Maharashtra State Finance Corporation", "Tamil Nadu SC/ST Corporation",
    "Karnataka SC/ST Development Corporation", "UP SC Finance Corporation",
    "Bihar SC/ST Welfare Corporation", "West Bengal SC/ST Corporation",
    "Rajasthan SC/ST Finance Corporation", "Gujarat SC Development Corporation",
    "MP SC Finance Corporation", "AP SC Cooperative Finance Corporation",
    "State Bank of India - Pune Branch", "Punjab National Bank - Chennai",
    "Bank of Baroda - Bangalore", "Canara Bank - Lucknow", "Union Bank - Patna",
    "Bank of India - Kolkata", "Central Bank - Jaipur", "Indian Bank - Ahmedabad",
    "UCO Bank - Bhopal", "Indian Overseas Bank - Hyderabad",
    "Prathama UP Gramin Bank", "Tamil Nadu Grama Bank", "Karnataka Gramin Bank",
    "Baroda UP Gramin Bank", "Dakshin Bihar Gramin Bank",
    "Paschim Banga Gramin Bank", "Rajasthan Marudhara Gramin Bank",
    "Saurashtra Gramin Bank", "Narmada Jhabua Gramin Bank", "Andhra Pradesh Gramin Bank",
    "Arohan Financial Services", "Bandhan Financial Services", "CreditAccess Grameen",
    "Fusion Microfinance - West", "Satin Creditcare Network",
    "Spandana Sphoorty Financial", "Ujjivan Small Finance",
    "Equitas Small Finance Bank", "ESAF Small Finance Bank", "Jana Small Finance Bank",
    "Maharashtra State Cooperative Bank", "Tamilnad Mercantile Bank - Salem",
    "Karnataka State Cooperative Bank", "Lucknow District Cooperative Bank",
    "Patna District Cooperative Bank", "Hoogly District Cooperative Bank",
    "Ajmer District Cooperative Bank", "Rajkot Nagarik Bank",
    "Indore District Cooperative Bank", "Tirupati Urban Cooperative Bank"
]

# Coordinates for major Indian cities per state
CITY_COORDS = {
    "Maharashtra": [(19.076, 72.877), (18.520, 73.856), (21.146, 79.088), (19.876, 75.343), (17.686, 74.005)],
    "Tamil Nadu": [(13.083, 80.270), (11.016, 76.955), (9.925, 78.120), (10.790, 79.139), (11.664, 78.146)],
    "Karnataka": [(12.971, 77.594), (15.363, 75.124), (12.295, 76.639), (14.680, 75.017), (13.932, 75.568)],
    "Uttar Pradesh": [(26.846, 80.946), (27.176, 78.008), (26.449, 80.332), (25.317, 82.988), (28.651, 77.221)],
    "Bihar": [(25.612, 85.144), (25.604, 84.997), (25.181, 85.521), (25.256, 87.012), (26.117, 85.390)],
    "West Bengal": [(22.572, 88.364), (22.339, 87.322), (23.250, 87.078), (26.716, 88.428), (22.457, 88.205)],
    "Rajasthan": [(26.912, 75.787), (26.289, 73.017), (24.597, 73.712), (25.344, 74.635), (27.198, 77.500)],
    "Gujarat": [(23.023, 72.571), (21.170, 72.831), (22.307, 73.181), (22.303, 70.802), (21.764, 72.152)],
    "Madhya Pradesh": [(23.259, 77.413), (22.720, 75.858), (23.181, 79.986), (26.450, 78.570), (24.585, 73.713)],
    "Andhra Pradesh": [(17.385, 78.487), (15.829, 78.037), (13.629, 79.419), (16.506, 80.648), (17.724, 83.302)]
}

DISTRICTS = {
    "Maharashtra": ["Pune", "Mumbai", "Nagpur", "Aurangabad", "Satara"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Thanjavur", "Salem"],
    "Karnataka": ["Bengaluru", "Hubli", "Mysore", "Dharwad", "Shimoga"],
    "Uttar Pradesh": ["Lucknow", "Agra", "Kanpur", "Varanasi", "Noida"],
    "Bihar": ["Patna", "Gaya", "Nalanda", "Purnia", "Muzaffarpur"],
    "West Bengal": ["Kolkata", "Kharagpur", "Burdwan", "Siliguri", "Howrah"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Bhilwara", "Bharatpur"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
    "Andhra Pradesh": ["Hyderabad", "Kurnool", "Tirupati", "Guntur", "Visakhapatnam"]
}

APPLICANT_FIRST_NAMES = [
    "Ramesh", "Suresh", "Rajesh", "Amit", "Vijay", "Arun", "Sanjay", "Mohan",
    "Sunita", "Priya", "Anita", "Kavita", "Meena", "Geeta", "Rekha", "Shanti",
    "Rahul", "Deepak", "Manoj", "Ravi", "Kiran", "Pooja", "Neha", "Asha"
]

APPLICANT_LAST_NAMES = [
    "Kumar", "Prasad", "Verma", "Singh", "Devi", "Ram", "Das", "Pal",
    "Paswan", "Gautam", "Chauhan", "Mehra", "Sonkar", "Jatav", "Bharti", "Vanshi"
]


async def seed_database(session: AsyncSession):
    """Seed the database with realistic demo data for CreditGPS."""
    # Check if data already exists
    scheme_count = await session.scalar(select(func.count(Scheme.id)))
    if scheme_count and scheme_count > 0:
        return

    # ── 10 Credit Schemes ──────────────────────────────────────────
    schemes = [
        Scheme(
            name="Micro Credit Scheme",
            description="Provides micro-finance assistance up to ₹1.40 lakh for small businesses and self-employment ventures. Ideal for tailoring shops, small retail, mobile repair, and other micro-enterprises.",
            max_loan=140000, max_income=300000, interest_rate=5.0,
            moratorium_months=3, max_tenure_months=36,
            eligible_purposes=json.dumps(["business", "self_employment"]),
            required_documents=json.dumps(["Aadhaar Card", "PAN Card", "Income Certificate", "Caste Certificate", "Bank Statement (6 months)", "Passport Photo"])
        ),
        Scheme(
            name="Term Loan Scheme",
            description="Medium to large term loan up to ₹50 lakh for established businesses in manufacturing, trading, and service sectors. Supports expansion, modernization, and new unit establishment.",
            max_loan=5000000, max_income=500000, interest_rate=6.0,
            moratorium_months=6, max_tenure_months=120,
            eligible_purposes=json.dumps(["business", "manufacturing", "services"]),
            required_documents=json.dumps(["Aadhaar Card", "PAN Card", "Income Certificate", "Caste Certificate", "Project Report", "Bank Statement (12 months)", "Business Registration", "Collateral Documents"])
        ),
        Scheme(
            name="Educational Loan Scheme",
            description="Educational loans up to ₹10 lakh for professional courses, higher education, and technical training. Includes tuition fees, hostel, books, and equipment costs.",
            max_loan=1000000, max_income=450000, interest_rate=4.0,
            moratorium_months=12, max_tenure_months=84,
            eligible_purposes=json.dumps(["education"]),
            required_documents=json.dumps(["Aadhaar Card", "Admission Letter", "Fee Structure", "Marksheets", "Income Certificate", "Caste Certificate"])
        ),
        Scheme(
            name="Entrepreneurship Development Scheme",
            description="Comprehensive support up to ₹25 lakh for new entrepreneurs and startups. Covers working capital, machinery, raw materials, and initial operational costs.",
            max_loan=2500000, max_income=500000, interest_rate=5.5,
            moratorium_months=6, max_tenure_months=84,
            eligible_purposes=json.dumps(["business", "startup", "manufacturing"]),
            required_documents=json.dumps(["Aadhaar Card", "PAN Card", "Business Plan", "Income Certificate", "Caste Certificate", "Training Certificate", "Bank Statement (6 months)"])
        ),
        Scheme(
            name="Green Energy Enterprise Scheme",
            description="Special scheme up to ₹15 lakh for green and renewable energy businesses including solar panel installation, biogas plants, and energy-efficient enterprises.",
            max_loan=1500000, max_income=500000, interest_rate=4.5,
            moratorium_months=6, max_tenure_months=60,
            eligible_purposes=json.dumps(["business", "green_energy", "solar"]),
            required_documents=json.dumps(["Aadhaar Card", "PAN Card", "Vendor/Supplier Quote", "Income Certificate", "Caste Certificate", "Technical Feasibility Report"])
        ),
        Scheme(
            name="Mahila Udyam Nidhi Scheme",
            description="Exclusive scheme for women entrepreneurs providing up to ₹10 lakh for self-employment, handicrafts, food processing, and beauty parlor businesses.",
            max_loan=1000000, max_income=400000, interest_rate=4.0,
            moratorium_months=3, max_tenure_months=60,
            eligible_purposes=json.dumps(["business", "self_employment", "handicraft"]),
            required_documents=json.dumps(["Aadhaar Card", "PAN Card", "Income Certificate", "Caste Certificate", "Bank Statement (6 months)", "Skill Certificate"])
        ),
        Scheme(
            name="Skill Development Loan",
            description="Financing up to ₹5 lakh for vocational training, skill development courses, and certification programs from recognized institutions.",
            max_loan=500000, max_income=350000, interest_rate=3.5,
            moratorium_months=6, max_tenure_months=48,
            eligible_purposes=json.dumps(["education", "skill_training"]),
            required_documents=json.dumps(["Aadhaar Card", "Course Admission Letter", "Institute Recognition Certificate", "Income Certificate", "Caste Certificate"])
        ),
        Scheme(
            name="Agriculture & Allied Activities Scheme",
            description="Agricultural credit up to ₹20 lakh for farming, dairy, poultry, fishery, and allied agricultural activities. Supports equipment purchase, livestock, and farm development.",
            max_loan=2000000, max_income=500000, interest_rate=5.0,
            moratorium_months=6, max_tenure_months=84,
            eligible_purposes=json.dumps(["agriculture", "dairy", "poultry", "fishery"]),
            required_documents=json.dumps(["Aadhaar Card", "Land Record/Patta", "Income Certificate", "Caste Certificate", "Bank Statement (6 months)", "Veterinary Certificate (if applicable)"])
        ),
        Scheme(
            name="Artisan Credit Card Scheme",
            description="Quick credit up to ₹2 lakh for traditional artisans and craftsmen. Supports purchase of raw materials, tools, and working capital for handicraft businesses.",
            max_loan=200000, max_income=300000, interest_rate=4.5,
            moratorium_months=0, max_tenure_months=36,
            eligible_purposes=json.dumps(["handicraft", "artisan", "self_employment"]),
            required_documents=json.dumps(["Aadhaar Card", "Artisan Identity Card", "Income Certificate", "Caste Certificate", "Craft Sample Photos"])
        ),
        Scheme(
            name="Housing Loan Scheme",
            description="Housing finance up to ₹30 lakh for construction, purchase, renovation, or repair of residential property. Longest tenure available with competitive interest rates.",
            max_loan=3000000, max_income=600000, interest_rate=6.5,
            moratorium_months=3, max_tenure_months=180,
            eligible_purposes=json.dumps(["housing", "construction", "renovation"]),
            required_documents=json.dumps(["Aadhaar Card", "PAN Card", "Property Documents", "Income Certificate", "Caste Certificate", "Construction Estimate", "Land Ownership Proof", "Bank Statement (12 months)"])
        ),
    ]
    session.add_all(schemes)
    await session.commit()

    # ── 50 Channel Partners ────────────────────────────────────────
    states = list(CITY_COORDS.keys())
    partner_types = ["SCA", "PSB", "RRB", "NBFC-MFI"]

    partners = []
    for i in range(50):
        state = states[i % len(states)]
        coords = CITY_COORDS[state]
        coord = coords[i % len(coords)]
        district = DISTRICTS[state][i % len(DISTRICTS[state])]
        # Each partner supports 3-7 random scheme IDs (1-10)
        supported = sorted(random.sample(range(1, 11), random.randint(3, 7)))

        p = Partner(
            name=PARTNER_NAMES[i] if i < len(PARTNER_NAMES) else f"Financial Partner {i+1}",
            partner_type=partner_types[i % len(partner_types)],
            latitude=coord[0] + random.uniform(-0.1, 0.1),
            longitude=coord[1] + random.uniform(-0.1, 0.1),
            state=state,
            district=district,
            address=f"{random.randint(1, 500)} {random.choice(['MG Road', 'Station Road', 'Civil Lines', 'Gandhi Nagar', 'Nehru Marg', 'Market Road'])}, {district}",
            contact_phone=f"9{random.randint(100000000, 999999999)}",
            supported_schemes=json.dumps(supported),
            fund_utilization_pct=round(random.uniform(30, 95), 1),
            npa_score=round(random.uniform(1, 8), 1),
            pending_applications=random.randint(10, 400),
            avg_processing_days=random.randint(3, 30),
            reliability_score=round(random.uniform(40, 98), 1),
            max_capacity=random.choice([300, 400, 500, 600, 800])
        )
        partners.append(p)
    session.add_all(partners)
    await session.commit()

    # ── 100 Mock Applications ──────────────────────────────────────
    purposes = ["business", "education", "agriculture", "housing", "self_employment", "handicraft", "dairy"]
    business_types = ["tailoring", "grocery", "mobile_repair", "dairy_farm", "poultry", "food_stall", "beauty_parlor", "auto_repair", "welding", "carpentry", None]
    statuses = ["initiated", "eligibility_checked", "scheme_selected", "partner_assigned", "documents_submitted", "under_review", "approved", "disbursed"]

    apps = []
    for i in range(100):
        state = random.choice(states)
        district = random.choice(DISTRICTS[state])
        purpose = random.choice(purposes)
        loan_amt = random.choice([50000, 80000, 100000, 130000, 200000, 300000, 500000, 800000, 1000000, 1500000, 2000000, 2500000])
        first = random.choice(APPLICANT_FIRST_NAMES)
        last = random.choice(APPLICANT_LAST_NAMES)

        a = Application(
            applicant_name=f"{first} {last}",
            purpose=purpose,
            business_type=random.choice(business_types),
            loan_amount=float(loan_amt),
            project_cost=float(loan_amt * random.uniform(1.1, 1.5)),
            annual_income=float(random.choice([120000, 180000, 200000, 250000, 300000, 350000, 400000, 450000])),
            age=random.randint(20, 55),
            state=state,
            district=district,
            status=random.choice(statuses),
            scheme_id=random.randint(1, 10) if random.random() > 0.2 else None,
            partner_id=random.randint(1, 50) if random.random() > 0.3 else None,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 365))
        )
        apps.append(a)
    session.add_all(apps)
    await session.commit()

    print("[OK] Database seeded: 10 schemes, 50 partners, 100 applications")
