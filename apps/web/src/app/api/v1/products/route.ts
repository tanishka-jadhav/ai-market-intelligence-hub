import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

let cachedProducts: any[] | null = null;

function getProducts() {
  if (cachedProducts) return cachedProducts;
  try {
    const filePath = path.join(process.cwd(), "src/data/products.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      cachedProducts = JSON.parse(data);
      return cachedProducts!;
    }
  } catch (e) {
    console.error("Error reading products.json:", e);
  }
  return [];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const search = (searchParams.get("search") || searchParams.get("q") || "").toLowerCase();
  const productType = searchParams.get("product_type") || "";
  const category = (searchParams.get("category") || "").toLowerCase();
  const businessModel = searchParams.get("business_model") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "24", 10);

  let filtered = getProducts();

  if (productType) {
    filtered = filtered.filter(p => 
      p.product_type?.toLowerCase() === productType.toLowerCase() ||
      (productType.toLowerCase().includes("agent") && p.product_type?.toLowerCase().includes("agent"))
    );
  }

  if (category) {
    filtered = filtered.filter(p => 
      p.categories?.some((c: any) => c.name.toLowerCase().includes(category)) ||
      p.description?.toLowerCase().includes(category) ||
      p.name?.toLowerCase().includes(category)
    );
  }

  if (businessModel) {
    filtered = filtered.filter(p => 
      p.business_models?.includes(businessModel)
    );
  }

  if (search) {
    filtered = filtered.filter(p => 
      p.name?.toLowerCase().includes(search) ||
      p.company_name?.toLowerCase().includes(search) ||
      p.description?.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    products: paginated,
    items: paginated
  });
}
