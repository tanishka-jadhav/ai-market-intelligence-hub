from typing import List
from sqlalchemy.orm import Session
from app.models.schema import Product

def compare_products(db: Session, product_ids: List[str]):
    products = db.query(Product).filter(
        Product.id.in_(product_ids),
        Product.is_deleted == False
    ).all()
    
    metrics = [
        "Product Type", "Company", "Free Plan", "API Available", "Open Source",
        "Context Window", "Input Token Limit", "Output Token Limit", "Autonomy Level",
        "Verification Status", "Pricing Plans", "Supported Models"
    ]
    
    # Compute differences dictionary for fast UI highlighting
    differences = {}
    if len(products) > 1:
        for metric in metrics:
            vals = []
            for p in products:
                if metric == "Product Type":
                    vals.append(p.product_type)
                elif metric == "Company":
                    vals.append(p.company_name)
                elif metric == "Free Plan":
                    vals.append(p.free_plan_available)
                elif metric == "API Available":
                    vals.append(p.api_available)
                elif metric == "Open Source":
                    vals.append(p.open_source_status)
                elif metric == "Context Window":
                    vals.append(p.context_window or 0)
                elif metric == "Autonomy Level":
                    vals.append(p.autonomy_level or 0)
            
            # Check if all values in list are identical
            is_different = len(set(vals)) > 1 if vals else False
            differences[metric] = is_different

    return products, metrics, differences
