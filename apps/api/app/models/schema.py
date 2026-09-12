import datetime
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, Numeric, ForeignKey, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship
from app.core.database import Base

# Junction tables
product_categories = Table(
    "product_categories",
    Base.metadata,
    Column("product_id", String(36), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", String(36), ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True)
)

product_industries = Table(
    "product_industries",
    Base.metadata,
    Column("product_id", String(36), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("industry_id", String(36), ForeignKey("industries.id", ondelete="CASCADE"), primary_key=True)
)

product_business_models = Table(
    "product_business_models",
    Base.metadata,
    Column("product_id", String(36), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("business_model", String(50), primary_key=True)
)

product_models = Table(
    "product_models",
    Base.metadata,
    Column("product_id", String(36), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True),
    Column("model_id", String(36), ForeignKey("models.id", ondelete="CASCADE"), primary_key=True)
)

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    website_url = Column(Text, nullable=False)
    country = Column(String(100), nullable=True)
    founded_year = Column(Integer, nullable=True)
    
    products = relationship("Product", back_populates="company")
    models = relationship("AIModel", back_populates="provider")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)

class Industry(Base):
    __tablename__ = "industries"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    tagline = Column(String(500), nullable=True)
    description = Column(Text, nullable=False)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=True)
    company_name = Column(String(255), nullable=True)
    product_type = Column(String(50), nullable=False, index=True) # AI Agent, AI Tool, AI Model, AI Platform, etc.
    official_url = Column(Text, nullable=False)
    pricing_url = Column(Text, nullable=True)
    docs_url = Column(Text, nullable=True)
    api_docs_url = Column(Text, nullable=True)
    logo_url = Column(Text, nullable=True)
    open_source_status = Column(Boolean, default=False, index=True)
    api_available = Column(Boolean, default=False, index=True)
    free_plan_available = Column(Boolean, default=False, index=True)
    autonomy_level = Column(Integer, nullable=True)
    context_window = Column(Integer, nullable=True, index=True)
    input_token_limit = Column(Integer, nullable=True)
    output_token_limit = Column(Integer, nullable=True)
    verification_status = Column(String(30), default="Verified", index=True)
    confidence_score = Column(Float, default=1.0)
    last_verified = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_deleted = Column(Boolean, default=False, index=True)
    
    company = relationship("Company", back_populates="products")
    categories = relationship("Category", secondary=product_categories)
    industries = relationship("Industry", secondary=product_industries)
    pricing_plans = relationship("PricingPlan", back_populates="product", cascade="all, delete-orphan")
    agent_capabilities = relationship("AgentCapabilities", uselist=False, back_populates="product", cascade="all, delete-orphan")
    models = relationship("AIModel", secondary=product_models, back_populates="supported_products")
    changes = relationship("ChangeHistory", back_populates="product", cascade="all, delete-orphan")

class PricingPlan(Base):
    __tablename__ = "pricing_plans"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    plan_name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), default=0.00)
    currency = Column(String(10), default="USD")
    billing_period = Column(String(20), default="monthly") # monthly, annual, custom, usage_based
    features_summary = Column(Text, nullable=True)
    input_price_per_1m = Column(Numeric(10, 4), nullable=True)
    output_price_per_1m = Column(Numeric(10, 4), nullable=True)
    source_url = Column(Text, nullable=True)
    last_verified = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product", back_populates="pricing_plans")

class AgentCapabilities(Base):
    __tablename__ = "agent_capabilities"
    
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), primary_key=True)
    autonomy_level = Column(Integer, default=1)
    web_browsing = Column(Boolean, default=False)
    code_execution = Column(Boolean, default=False)
    computer_use = Column(Boolean, default=False)
    multi_agent = Column(Boolean, default=False)
    workflow_automation = Column(Boolean, default=False)
    memory_type = Column(String(100), nullable=True)
    human_approval_required = Column(Boolean, default=True)
    
    product = relationship("Product", back_populates="agent_capabilities")

class AIModel(Base):
    __tablename__ = "models"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(255), nullable=False, unique=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    provider_id = Column(String(36), ForeignKey("companies.id"), nullable=True)
    model_family = Column(String(100), nullable=True)
    release_date = Column(DateTime, nullable=True)
    context_window = Column(Integer, nullable=True)
    input_token_limit = Column(Integer, nullable=True)
    output_token_limit = Column(Integer, nullable=True)
    input_price_per_1m = Column(Numeric(10, 4), nullable=True)
    output_price_per_1m = Column(Numeric(10, 4), nullable=True)
    supports_text = Column(Boolean, default=True)
    supports_vision = Column(Boolean, default=False)
    supports_audio = Column(Boolean, default=False)
    supports_video = Column(Boolean, default=False)
    supports_reasoning = Column(Boolean, default=False)
    supports_tool_calling = Column(Boolean, default=False)
    api_available = Column(Boolean, default=True)
    official_docs_url = Column(Text, nullable=True)
    last_verified = Column(DateTime, default=datetime.datetime.utcnow)
    
    provider = relationship("Company", back_populates="models")
    supported_products = relationship("Product", secondary=product_models, back_populates="models")

class ChangeHistory(Base):
    __tablename__ = "change_history"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    field_name = Column(String(100), nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    source_url = Column(Text, nullable=False)
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(30), default="Verified") # Verified, Pending Review, Rejected
    
    product = relationship("Product", back_populates="changes")

class OutboundClick(Base):
    __tablename__ = "outbound_clicks"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    clicked_at = Column(DateTime, default=datetime.datetime.utcnow)
    referrer_page = Column(String(255), nullable=True)

class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(String(36), primary_key=True)
    username = Column(String(100), nullable=False, unique=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="SuperAdmin") # SuperAdmin, Editor, Viewer
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
