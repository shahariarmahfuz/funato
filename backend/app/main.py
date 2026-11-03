from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import AsyncSessionLocal, Base, engine
from app.routers import admin, public
from app.seed import seed_initial_data


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        await seed_initial_data(session)
    yield
    await engine.dispose()


app = FastAPI(
    title="MASTUL-Style Humanitarian Foundation API",
    version="1.0.0",
    description="Backend API for Foundation Website & Complete Admin Panel powered by FastAPI + Neon PostgreSQL",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)


@app.get("/api/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "foundation-backend"}
