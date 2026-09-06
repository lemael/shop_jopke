from fastapi import APIRouter
from app.controllers.health_controller import health_controller

router = APIRouter(prefix="/api", tags=["Health"])

@router.get("/health")
def health_check():
    return health_controller.check_health()