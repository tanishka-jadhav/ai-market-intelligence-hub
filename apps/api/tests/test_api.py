import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_list_products():
    res = client.get("/api/v1/products")
    assert res.status_code == 200
    data = res.json()
    assert "products" in data
    assert data["total"] > 0

def test_get_product_detail():
    res = client.get("/api/v1/products/claude-3-5-sonnet")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Claude 3.5 Sonnet"
    assert data["context_window"] == 200000

def test_search_and_filter():
    res = client.get("/api/v1/products?product_type=AI Agent")
    assert res.status_code == 200
    data = res.json()
    for p in data["products"]:
        assert p["product_type"] == "AI Agent"

def test_stats():
    res = client.get("/api/v1/stats")
    assert res.status_code == 200
    data = res.json()
    assert data["total_products"] > 0

if __name__ == "__main__":
    test_health()
    test_list_products()
    test_get_product_detail()
    test_search_and_filter()
    test_stats()
    print("All Backend API Tests Passed Cleanly!")
