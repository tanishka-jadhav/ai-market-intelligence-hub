import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AI Market Intelligence Hub API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "antigravity-ai-market-intelligence-super-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    def __init__(self, **data):
        super().__init__(**data)
        if not self.DATABASE_URL:
            possible_paths = [
                os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../database/ai_market_hub.db")),
                os.path.abspath(os.path.join(os.getcwd(), "database/ai_market_hub.db")),
                os.path.abspath(os.path.join(os.getcwd(), "../database/ai_market_hub.db")),
            ]
            chosen = next((p for p in possible_paths if os.path.exists(p)), possible_paths[0])
            self.DATABASE_URL = f"sqlite:///{chosen}"

settings = Settings()
