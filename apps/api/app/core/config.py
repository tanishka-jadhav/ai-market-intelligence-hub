import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "AI Market Intelligence Hub API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "antigravity-ai-market-intelligence-super-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Dual database support: SQLite fallback for local standalone, PostgreSQL for production
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../database/ai_market_hub.db'))}"
    )

settings = Settings()
