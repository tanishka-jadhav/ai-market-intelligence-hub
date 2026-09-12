from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc, asc
from app.models.schema import Product, Category, Industry, PricingPlan, AIModel, product_business_models

def search_products(
    db: Session,
    query: str = None,
    product_type: str = None,
    category: str = None,
    industry: str = None,
    business_model: str = None,
    free_only: bool = False,
    api_only: bool = False,
    open_source_only: bool = False,
    min_context: int = None,
    sort_by: str = "popular",
    page: int = 1,
    limit: int = 20
):
    q = db.query(Product).filter(Product.is_deleted == False)
    
    # 1. Text Search across name, tagline, description, company_name
    if query and query.strip():
        term = f"%{query.strip()}%"
        q = q.filter(
            or_(
                Product.name.ilike(term),
                Product.tagline.ilike(term),
                Product.description.ilike(term),
                Product.company_name.ilike(term),
                Product.product_type.ilike(term)
            )
        )
        
    # 2. Product Type Filter
    if product_type and product_type.strip():
        q = q.filter(Product.product_type == product_type.strip())
        
    # 3. Category Filter
    if category and category.strip():
        q = q.join(Product.categories).filter(
            or_(Category.slug == category.strip(), Category.name == category.strip())
        )
        
    # 4. Industry Filter
    if industry and industry.strip():
        q = q.join(Product.industries).filter(
            or_(Industry.slug == industry.strip(), Industry.name == industry.strip())
        )
        
    # 5. Business Model Filter
    if business_model and business_model.strip():
        subq = db.query(product_business_models.c.product_id).filter(
            product_business_models.c.business_model == business_model.strip()
        ).subquery()
        q = q.filter(Product.id.in_(subq))
        
    # 6. Boolean Flags
    if free_only:
        q = q.filter(Product.free_plan_available == True)
    if api_only:
        q = q.filter(Product.api_available == True)
    if open_source_only:
        q = q.filter(Product.open_source_status == True)
        
    # 7. Min Context Window
    if min_context and min_context > 0:
        q = q.filter(Product.context_window >= min_context)
        
    # Deduplicate joined rows
    q = q.distinct()
    
    total = q.count()
    
    # 8. Sorting
    if sort_by == "recently_added":
        q = q.order_by(desc(Product.created_at))
    elif sort_by == "recently_updated":
        q = q.order_by(desc(Product.last_verified))
    elif sort_by == "name_asc":
        q = q.order_by(asc(Product.name))
    elif sort_by == "name_desc":
        q = q.order_by(desc(Product.name))
    elif sort_by == "context_desc":
        q = q.order_by(desc(Product.context_window))
    else: # Popular / Default
        q = q.order_by(desc(Product.confidence_score), desc(Product.last_verified))
        
    offset = (page - 1) * limit
    products = q.offset(offset).limit(limit).all()
    
    return total, products
