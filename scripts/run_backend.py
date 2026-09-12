import os
import sys

# Add apps/api to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../apps/api")))

import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting AI Market Intelligence Hub FastAPI Backend on http://127.0.0.1:8000...")
    uvicorn.run(app, host="127.0.0.1", port=8000)
