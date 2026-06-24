import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { productSchema } from "@/lib/validation/product";

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
      badge: parsed.data.badge || null,
      category_id: parsed.data.category_id || null,
    })
    .select("id, slug")
    .single();

  if (error) {
    const message = error.code === "23505" ? "A product with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id, slug: data.slug });
}
