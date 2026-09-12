import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status, UploadFile, File
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.database import get_db
from app.models.schema import (
    Product, Category, Industry, Company, PricingPlan, AIModel, AgentCapabilities, OutboundClick, ChangeHistory
)
from app.schemas.dto import (
    ProductDTO, SearchResponse, ComparisonResponse, SystemStats, CategoryDTO, IndustryDTO, AIModelDTO, ProductCreateDTO
)
from app.services.search import search_products
from app.services.compare import compare_products
from app.ingestion.pipeline import DataIngestionPipeline

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Market Intelligence Hub API", "timestamp": datetime.datetime.utcnow().isoformat()}

@router.get("/stats", response_model=SystemStats)
def get_stats(db: Session = Depends(get_db)):
    total_products = db.query(Product).filter(Product.is_deleted == False).count()
    total_agents = db.query(Product).filter(Product.is_deleted == False, Product.product_type == "AI Agent").count()
    total_tools = db.query(Product).filter(Product.is_deleted == False, Product.product_type == "AI Tool").count()
    total_platforms = db.query(Product).filter(Product.is_deleted == False, Product.product_type == "AI Platform").count()
    total_models = db.query(AIModel).count()
    total_categories = db.query(Category).count()
    total_industries = db.query(Industry).count()
    verified_count = db.query(Product).filter(Product.is_deleted == False, Product.verification_status == "Verified").count()
    stale_count = db.query(Product).filter(Product.is_deleted == False, Product.verification_status == "Stale").count()
    outbound_count = db.query(OutboundClick).count()
    
    return SystemStats(
        total_products=total_products,
        total_agents=total_agents,
        total_tools=total_tools,
        total_platforms=total_platforms,
        total_models=total_models,
        total_categories=total_categories,
        total_industries=total_industries,
        verified_count=verified_count,
        stale_count=stale_count,
        outbound_clicks_count=outbound_count
    )

@router.get("/products", response_model=SearchResponse)
def list_products(
    q: Optional[str] = Query(None, description="Search query across name, tagline, description, company"),
    product_type: Optional[str] = Query(None, description="AI Agent, AI Tool, AI Model, AI Platform, etc."),
    category: Optional[str] = Query(None, description="Category slug or name"),
    industry: Optional[str] = Query(None, description="Industry slug or name"),
    business_model: Optional[str] = Query(None, description="B2B, B2C, Enterprise, Developer, etc."),
    free_only: bool = Query(False, description="Filter for products with a free tier"),
    api_only: bool = Query(False, description="Filter for products with API availability"),
    open_source_only: bool = Query(False, description="Filter for open source products"),
    min_context: Optional[int] = Query(None, description="Minimum context window tokens"),
    sort_by: str = Query("popular", description="popular, recently_added, recently_updated, name_asc, context_desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    total, products = search_products(
        db, query=q, product_type=product_type, category=category, industry=industry,
        business_model=business_model, free_only=free_only, api_only=api_only,
        open_source_only=open_source_only, min_context=min_context, sort_by=sort_by,
        page=page, limit=limit
    )
    
    return SearchResponse(
        total=total,
        page=page,
        limit=limit,
        products=[ProductDTO.from_orm(p) for p in products]
    )

@router.get("/products/{slug_or_id}", response_model=ProductDTO)
def get_product(slug_or_id: str, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(
        (Product.slug == slug_or_id) | (Product.id == slug_or_id),
        Product.is_deleted == False
    ).first()
    
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return ProductDTO.from_orm(prod)

@router.get("/categories", response_model=List[CategoryDTO])
def list_categories(db: Session = Depends(get_db)):
    cats = db.query(Category).order_by(Category.name).all()
    return [CategoryDTO.from_orm(c) for c in cats]

@router.get("/industries", response_model=List[IndustryDTO])
def list_industries(db: Session = Depends(get_db)):
    inds = db.query(Industry).order_by(Industry.name).all()
    return [IndustryDTO.from_orm(i) for i in inds]

@router.get("/models", response_model=List[AIModelDTO])
def list_models(db: Session = Depends(get_db)):
    models = db.query(AIModel).order_by(AIModel.name).all()
    return [AIModelDTO.from_orm(m) for m in models]

@router.post("/compare", response_model=ComparisonResponse)
def compare(product_ids: List[str], db: Session = Depends(get_db)):
    if not product_ids or len(product_ids) < 1:
        raise HTTPException(status_code=400, detail="Provide at least one product ID to compare")
        
    products, metrics, differences = compare_products(db, product_ids[:4]) # Limit max 4 comparison
    return ComparisonResponse(
        products=[ProductDTO.from_orm(p) for p in products],
        metrics=metrics,
        differences=differences
    )

@router.get("/redirect")
def redirect_to_official(product_id: str, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Log outbound click telemetry
    click = OutboundClick(
        id=str(uuid.uuid4()),
        product_id=prod.id,
        clicked_at=datetime.datetime.utcnow()
    )
    db.add(click)
    db.commit()
    
    return RedirectResponse(url=prod.official_url, status_code=307)

# --- ADMIN ENDPOINTS ---

@router.post("/admin/products", response_model=ProductDTO)
def create_product(dto: ProductCreateDTO, db: Session = Depends(get_db)):
    pipeline = DataIngestionPipeline(db)
    raw_data = dto.dict()
    prod = pipeline.process_raw_item(raw_data)
    return ProductDTO.from_orm(prod)

@router.post("/admin/import")
def bulk_import(file: UploadFile = File(...), db: Session = Depends(get_db)):
    import json
    try:
        content = file.file.read()
        data = json.loads(content.decode("utf-8"))
        pipeline = DataIngestionPipeline(db)
        imported_count = 0
        if isinstance(data, list):
            for item in data:
                pipeline.process_raw_item(item)
                imported_count += 1
        return {"status": "success", "imported_count": imported_count}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process import file: {str(e)}")

@router.post("/admin/verify-all")
def trigger_verification(db: Session = Depends(get_db)):
    # Run full verification sweep marking unverified records older than 30 days as stale
    now = datetime.datetime.utcnow()
    stale_threshold = now - datetime.timedelta(days=30)
    
    updated_stale = db.query(Product).filter(
        Product.last_verified < stale_threshold,
        Product.verification_status == "Verified"
    ).update({"verification_status": "Stale"})
    
    db.commit()
    return {"status": "completed", "products_marked_stale": updated_stale, "timestamp": now.isoformat()}
