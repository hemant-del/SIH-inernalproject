# 🧭 CreditGPS

**Intelligent Government Credit Scheme Recommendation & Channel Partner Routing Platform**

Built for **Smart India Hackathon** — An AI-powered financial navigation system that helps Scheduled Caste beneficiaries find the right government credit schemes, check eligibility, compare options, and connect with the best authorized Channel Partners.

> ⚠️ **Prototype Disclaimer**: This is a hackathon prototype. All partner metrics, scheme data, and application statistics shown are **simulated/demo data** for demonstration purposes.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    React Frontend                     │
│   Vite + TypeScript + Tailwind CSS + Framer Motion   │
│   React Router • Recharts • React Leaflet • Web Speech│
├─────────────────────────────────────────────────────┤
│                    FastAPI Backend                     │
│   Eligibility Engine │ Recommendation Engine          │
│   Partner Ranking    │ Financial Calculator            │
│   Gemini AI Service  │ OCR • PDF Generation           │
├─────────────────────────────────────────────────────┤
│              SQLite (default) / PostgreSQL             │
│          10 Schemes • 50 Partners • 100 Applications  │
└─────────────────────────────────────────────────────┘
```

### Key Design Principle

```
LLM understands user intent → Structured JSON extraction → 
Rule Engine determines eligibility → Recommendation Algorithm ranks schemes → 
LLM explains the result in human-friendly language
```

**The LLM (Gemini) NEVER makes eligibility decisions.** All eligibility logic is deterministic and rule-based.

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **AI Credit Navigator** | Conversational interface with NLU, Hindi/English support |
| 2 | **Eligibility Engine** | Deterministic rule-based scheme eligibility checking |
| 3 | **Scheme Recommendations** | Weighted scoring algorithm (40% eligibility + 25% purpose + 20% amount + 15% interest) |
| 4 | **EMI Calculator** | Full EMI calculation with moratorium support |
| 5 | **Financial Health Analyzer** | Disposable income, stress score, risk level assessment |
| 6 | **What-If Simulator** | Interactive loan parameter adjustment with real-time updates |
| 7 | **Partner Routing** | Multi-factor ranking (scheme compatibility, fund availability, distance, load balancing) |
| 8 | **Document Readiness** | Application preparedness scoring with checklist |
| 9 | **OCR Scanner** | Document information extraction using Tesseract |
| 10 | **Project Report Generator** | AI-generated business plans with PDF export |
| 11 | **Multilingual Support** | English, Hindi, Hinglish |
| 12 | **Voice Assistant** | Web Speech API for speech-to-text and text-to-speech |
| 13 | **Loan Journey Tracker** | Visual step-by-step application progress |
| 14 | **Admin Dashboard** | Analytics with charts, demand heatmap, scheme gap detection |
| 15 | **Interactive Map** | Leaflet/OpenStreetMap with partner markers |
| 16 | **PWA Support** | Offline-capable Progressive Web App |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **Python** 3.10+ ([download](https://python.org))
- **Git** (optional)

### 1. Clone / Navigate to Project

```bash
cd credit-gps
```

### 2. Start the Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment config
copy ..\.env.example .env     # Windows
# cp ../.env.example .env     # Linux/Mac

# (Optional) Add your Gemini API key to .env
# GOOGLE_API_KEY=your_key_here

# Start the server
uvicorn app.main:app --reload --port 8000
```

The backend will:
- Create a SQLite database automatically
- Seed it with 10 schemes, 50 partners, and 100 applications
- Start serving at http://localhost:8000

### 3. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at http://localhost:5173 (proxies API calls to :8000)

---

## 🔑 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | No | `sqlite+aiosqlite:///./creditgps.db` | Database connection string |
| `GOOGLE_API_KEY` | No | _(empty)_ | Gemini API key for AI features |
| `ORS_API_KEY` | No | _(empty)_ | OpenRouteService key for route distances |

> **Note**: The app works fully without any API keys — AI features gracefully degrade to template-based responses.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/schemes` | List all credit schemes |
| `POST` | `/api/recommendation` | Get scheme recommendations for a profile |
| `POST` | `/api/calculator/emi` | Calculate EMI |
| `POST` | `/api/calculator/health` | Analyze financial health |
| `POST` | `/api/calculator/whatif` | Run what-if simulation |
| `POST` | `/api/partners/recommend` | Find best Channel Partners |
| `POST` | `/api/ai/extract-intent` | Extract structured intent from text |
| `POST` | `/api/ai/explain` | Explain recommendation in natural language |
| `POST` | `/api/documents/readiness` | Check document readiness score |
| `POST` | `/api/documents/analyze` | OCR document analysis |
| `POST` | `/api/project-report/generate` | Generate project report |
| `POST` | `/api/project-report/pdf` | Download report as PDF |
| `GET` | `/api/admin/analytics` | Dashboard analytics data |

Full API documentation available at: http://localhost:8000/docs (Swagger UI)

---

## 🗂️ Project Structure

```
credit-gps/
├── backend/
│   ├── app/
│   │   ├── core/config.py           # Settings & env vars
│   │   ├── database/
│   │   │   ├── database.py          # Async SQLAlchemy setup
│   │   │   └── seed_data.py         # Demo data seeding
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   ├── schemas/                  # Pydantic validation schemas
│   │   ├── services/
│   │   │   ├── eligibility_engine.py # Rule-based eligibility
│   │   │   ├── recommendation_engine.py # Weighted scoring
│   │   │   ├── financial_calculator.py  # EMI & health analysis
│   │   │   ├── partner_ranking.py    # Multi-factor partner ranking
│   │   │   ├── gemini_service.py     # AI intent extraction
│   │   │   └── project_report_service.py # PDF generation
│   │   ├── routers/                  # FastAPI route handlers
│   │   └── main.py                   # App entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/                    # 9 page components
│   │   ├── components/               # Reusable UI components
│   │   ├── services/api.ts           # Backend API client
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── context/AppContext.tsx     # Global state
│   │   └── data/i18n/                # Translations
│   ├── public/                       # PWA manifest & service worker
│   └── package.json
├── docker-compose.yml                # PostgreSQL + PostGIS (optional)
├── .env.example                      # Environment template
└── README.md
```

---

## 🧮 Core Algorithms

### Eligibility Engine (Deterministic)
- Income range check
- Loan amount ceiling check
- Project cost validation
- Purpose matching
- Age criteria verification

### Recommendation Scoring
| Factor | Weight | Description |
|--------|--------|-------------|
| Eligibility Match | 40% | All rules pass = full score |
| Purpose Match | 25% | Exact purpose alignment |
| Loan Amount Fit | 20% | How well amount fits scheme limits |
| Interest Advantage | 15% | Lower rate = higher score |

### Partner Ranking
| Factor | Weight | Description |
|--------|--------|-------------|
| Scheme Compatibility | 30% | Supports recommended scheme |
| Fund Availability | 25% | Lower utilization = more funds |
| Processing Efficiency | 20% | Faster processing = higher score |
| Distance | 15% | Haversine distance from user |
| Reliability | 10% | Historical reliability score |

Load balancing penalty applied when partner capacity > 80%.

---

## 🐳 Docker (Optional)

For PostgreSQL + PostGIS:

```bash
docker-compose up -d
```

Then update `.env`:
```
DATABASE_URL=postgresql+asyncpg://creditgps:creditgps_pass@localhost:5432/creditgps_db
```

---

## 🛠️ Tech Stack

**Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Framer Motion, Recharts, React Leaflet, Lucide React

**Backend**: Python, FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn

**Database**: SQLite (default) / PostgreSQL + PostGIS

**AI**: Google Gemini 2.0 Flash

**Maps**: OpenStreetMap + Leaflet

**Voice**: Web Speech API

**Documents**: Tesseract OCR, ReportLab PDF

---

## 👥 Team

Built for **Smart India Hackathon 2026**

---

## 📄 License

This project is a hackathon prototype for educational and demonstration purposes.
#   S I H - i n e r n a l p r o j e c t  
 