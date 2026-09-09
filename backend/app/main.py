from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import init_db, async_sessionmaker_instance
from app.database.seed_data import seed_database
from app.routers import schemes, recommendation, calculator, partners, documents, project_report, ai, admin, contact

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    async with async_sessionmaker_instance() as session:
        await seed_database(session)
    yield

app = FastAPI(title="CreditGPS API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schemes.router)
app.include_router(recommendation.router)
app.include_router(calculator.router)
app.include_router(partners.router)
app.include_router(documents.router)
app.include_router(project_report.router)
app.include_router(ai.router)
app.include_router(admin.router)
app.include_router(contact.router)

@app.get("/")
async def root():
    return {"status": "ok", "project": "CreditGPS"}
