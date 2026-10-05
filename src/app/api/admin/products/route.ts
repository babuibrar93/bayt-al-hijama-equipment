import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { productSchema } from "@/lib/validation/product";

/** Lightweight product list for admin order form refresh. */
export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") === "1";

  const db = createAdminClient();
  let query = db
    .from("products")
    .select("id, name, price, cost_price, stock, is_active")
    .order("name");

  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("products")
    .insert({
      ...parsed.data,
      cost_price: parsed.data.cost_price ?? null,
      category_id: parsed.data.category_id || null,
    })
    .select("id, slug")
    .single();

  if (error) {
    const message = error.code === "23505" ? "A product with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  revalidatePath("/shop");
  revalidatePath("/");
  return NextResponse.json({ id: data.id, slug: data.slug });
}
