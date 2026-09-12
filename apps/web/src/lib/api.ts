import { Product, SearchResponse, SystemStats, Category, Industry, AIModel, ComparisonResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export async function fetchStats(): Promise<SystemStats> {
  try {
    const res = await fetch(`${API_BASE}/stats`, { cache: 'no-store' });
    if (!res.ok) throw new Error('API Stats request failed');
    return await res.json();
  } catch (e) {
    // Fallback data
    return {
      total_products: 15,
      total_agents: 3,
      total_tools: 5,
      total_platforms: 4,
      total_models: 8,
      total_categories: 12,
      total_industries: 10,
      verified_count: 15,
      stale_count: 0,
      outbound_clicks_count: 142
    };
  }
}

export async function fetchProducts(params: {
  q?: string;
  product_type?: string;
  category?: string;
  industry?: string;
  business_model?: string;
  free_only?: boolean;
  api_only?: boolean;
  open_source_only?: boolean;
  min_context?: number;
  sort_by?: string;
  page?: number;
  limit?: number;
}): Promise<SearchResponse> {
  try {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.product_type) query.append('product_type', params.product_type);
    if (params.category) query.append('category', params.category);
    if (params.industry) query.append('industry', params.industry);
    if (params.business_model) query.append('business_model', params.business_model);
    if (params.free_only) query.append('free_only', 'true');
    if (params.api_only) query.append('api_only', 'true');
    if (params.open_source_only) query.append('open_source_only', 'true');
    if (params.min_context) query.append('min_context', params.min_context.toString());
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    const res = await fetch(`${API_BASE}/products?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (e) {
    return { total: 0, page: 1, limit: 20, products: [] };
  }
}

export async function fetchProductDetail(slugOrId: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slugOrId}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchIndustries(): Promise<Industry[]> {
  try {
    const res = await fetch(`${API_BASE}/industries`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function fetchModels(): Promise<AIModel[]> {
  try {
    const res = await fetch(`${API_BASE}/models`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    return [];
  }
}

export async function compareProducts(productIds: string[]): Promise<ComparisonResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productIds)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}
