export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
}

export interface PricingPlan {
  id: string;
  plan_name: string;
  price: number;
  currency: string;
  billing_period: string;
  features_summary?: string;
  input_price_per_1m?: number;
  output_price_per_1m?: number;
  source_url?: string;
  last_verified?: string;
}

export interface AgentCapabilities {
  autonomy_level: number;
  web_browsing: boolean;
  code_execution: boolean;
  computer_use: boolean;
  multi_agent: boolean;
  workflow_automation: boolean;
  memory_type?: string;
  human_approval_required: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  slug: string;
  model_family?: string;
  context_window?: number;
  input_price_per_1m?: number;
  output_price_per_1m?: number;
  supports_text: boolean;
  supports_vision: boolean;
  supports_audio: boolean;
  supports_video: boolean;
  supports_reasoning: boolean;
  supports_tool_calling: boolean;
  official_docs_url?: string;
}

export interface ChangeHistory {
  id: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  source_url: string;
  detected_at: string;
  status: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  company_name?: string;
  product_type: string;
  tagline?: string;
  description: string;
  official_url: string;
  pricing_url?: string;
  docs_url?: string;
  api_docs_url?: string;
  logo_url?: string;
  open_source_status: boolean;
  api_available: boolean;
  free_plan_available: boolean;
  autonomy_level?: number;
  context_window?: number;
  input_token_limit?: number;
  output_token_limit?: number;
  verification_status: 'Verified' | 'Partially Verified' | 'Needs Review' | 'Stale' | 'Deprecated';
  confidence_score: number;
  last_verified: string;
  categories: Category[];
  industries: Industry[];
  business_models: string[];
  pricing_plans: PricingPlan[];
  agent_capabilities?: AgentCapabilities;
  models: AIModel[];
  changes: ChangeHistory[];
}

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}

export interface ComparisonResponse {
  products: Product[];
  metrics: string[];
  differences: Record<string, boolean>;
}

export interface SystemStats {
  total_products: number;
  total_agents: number;
  total_tools: number;
  total_platforms: number;
  total_models: number;
  total_categories: number;
  total_industries: number;
  verified_count: number;
  stale_count: number;
  outbound_clicks_count: number;
}
