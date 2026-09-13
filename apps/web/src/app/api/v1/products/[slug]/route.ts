import { NextRequest, NextResponse } from "next/server";
import productsData from "@/data/products.json";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const rawSlug = params.slug;
  if (!rawSlug) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const slug = decodeURIComponent(rawSlug).toLowerCase().trim();

  try {
    const products = productsData as any[];
    const product = products.find((p: any) => {
      if (!p) return false;
      const pSlug = (p.slug || "").toLowerCase();
      const pId = (p.id || "").toLowerCase();
      const pNameSlug = (p.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const pNameSpace = (p.name || "").toLowerCase().replace(/\s+/g, "-");
      
      return (
        pSlug === slug ||
        pId === slug ||
        pNameSlug === slug ||
        pNameSpace === slug ||
        pSlug.includes(slug) ||
        slug.includes(pSlug)
      );
    });

    if (product) {
      return NextResponse.json(product);
    }
  } catch (e) {
    console.error("Error fetching product detail in API route:", e);
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}

