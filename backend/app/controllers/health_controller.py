from app.repositories.excel_repository import excel_repository

class HealthController:
    def __init__(self, repo=excel_repository):
        self.repo = repo

    def check_health(self) -> dict:
        return {"status": "ok", "excel_loaded": self.repo.is_loaded()}

health_controller = HealthController()