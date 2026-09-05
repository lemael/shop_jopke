from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.routers import health_router, tarife_router
from app.routers import ausstattung_config_router

app = FastAPI(
    title="Mailing Pricing API",
    version="1.0.0",
    description="API pour l'extraction et la distribution des tarifs de mailing",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrement des Routers
app.include_router(health_router.router)
app.include_router(tarife_router.router)
app.include_router(ausstattung_config_router.router)