import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";
import type { ProductWithCategory } from "@/types/db";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, categories] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(id, name, slug)")
      .eq("id", id)
      .maybeSingle(),
    getCategories(),
  ]);

  if (!data) notFound();

  return (
    <ProductForm
      categories={categories}
      product={data as unknown as ProductWithCategory}
    />
  );
}
