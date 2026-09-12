import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  try {
    const filePath = path.join(process.cwd(), "src/data/products.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const products = JSON.parse(data);
      const product = products.find((p: any) => 
        p.slug === slug || p.id === slug || p.name?.toLowerCase().replace(/\s+/g, '-') === slug
      );
      if (product) {
        return NextResponse.json(product);
      }
    }
  } catch (e) {
    console.error("Error product detail API:", e);
  }

  return NextResponse.json({ error: "Product not found" }, { status: 404 });
}
