import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field

class CompanyDTO(BaseModel):
    id: str
    name: str
    slug: str
    website_url: str
    country: Optional[str] = None
    founded_year: Optional[int] = None

    class Config:
        from_attributes = True

class CategoryDTO(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class IndustryDTO(BaseModel):
    id: str
    name: str
    slug: str

    class Config:
        from_attributes = True

class PricingPlanDTO(BaseModel):
    id: str
    plan_name: str
    price: float
    currency: str = "USD"
    billing_period: str = "monthly"
    features_summary: Optional[str] = None
    input_price_per_1m: Optional[float] = None
    output_price_per_1m: Optional[float] = None
    source_url: Optional[str] = None
    last_verified: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class AgentCapabilitiesDTO(BaseModel):
    autonomy_level: int = 1
    web_browsing: bool = False
    code_execution: bool = False
    computer_use: bool = False
    multi_agent: bool = False
    workflow_automation: bool = False
    memory_type: Optional[str] = None
    human_approval_required: bool = True

    class Config:
        from_attributes = True

class AIModelDTO(BaseModel):
    id: str
    name: str
    slug: str
    model_family: Optional[str] = None
    context_window: Optional[int] = None
    input_price_per_1m: Optional[float] = None
    output_price_per_1m: Optional[float] = None
    supports_text: bool = True
    supports_vision: bool = False
    supports_audio: bool = False
    supports_video: bool = False
    supports_reasoning: bool = False
    supports_tool_calling: bool = False
    official_docs_url: Optional[str] = None

    class Config:
        from_attributes = True

class ChangeHistoryDTO(BaseModel):
    id: str
    field_name: str
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    source_url: str
    detected_at: datetime.datetime
    status: str

    class Config:
        from_attributes = True

class ProductDTO(BaseModel):
    id: str
    name: str
    slug: str
    company_name: Optional[str] = None
    product_type: str
    tagline: Optional[str] = None
    description: str
    official_url: str
    pricing_url: Optional[str] = None
    docs_url: Optional[str] = None
    api_docs_url: Optional[str] = None
    logo_url: Optional[str] = None
    open_source_status: bool = False
    api_available: bool = False
    free_plan_available: bool = False
    autonomy_level: Optional[int] = None
    context_window: Optional[int] = None
    input_token_limit: Optional[int] = None
    output_token_limit: Optional[int] = None
    verification_status: str = "Verified"
    confidence_score: float = 1.0
    last_verified: datetime.datetime
    
    categories: List[CategoryDTO] = []
    industries: List[IndustryDTO] = []
    business_models: List[str] = []
    pricing_plans: List[PricingPlanDTO] = []
    agent_capabilities: Optional[AgentCapabilitiesDTO] = None
    models: List[AIModelDTO] = []
    changes: List[ChangeHistoryDTO] = []

    class Config:
        from_attributes = True

class SearchResponse(BaseModel):
    total: int
    page: int
    limit: int
    products: List[ProductDTO]

class ComparisonResponse(BaseModel):
    products: List[ProductDTO]
    metrics: List[str]
    differences: dict

class SystemStats(BaseModel):
    total_products: int
    total_agents: int
    total_tools: int
    total_platforms: int
    total_models: int
    total_categories: int
    total_industries: int
    verified_count: int
    stale_count: int
    outbound_clicks_count: int

class ProductCreateDTO(BaseModel):
    name: str
    company_name: str
    product_type: str
    tagline: Optional[str] = None
    description: str
    official_url: str
    pricing_url: Optional[str] = None
    docs_url: Optional[str] = None
    api_docs_url: Optional[str] = None
    logo_url: Optional[str] = None
    open_source_status: bool = False
    api_available: bool = False
    free_plan_available: bool = False
    autonomy_level: Optional[int] = None
    context_window: Optional[int] = None
    categories: List[str] = []
    industries: List[str] = []
    business_models: List[str] = []
    source_url: Optional[str] = None
