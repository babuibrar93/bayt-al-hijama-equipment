"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Plus, X, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/utils";
import { cn } from "@/lib/classes";
import { Button, Input, Textarea, Select, Checkbox } from "@/components/ui";
import type { Category, ProductWithCategory, BadgeVariant } from "@/types/db";

interface ProductFormProps {
  categories: Category[];
  product?: ProductWithCategory;
}

const BADGE_OPTIONS = [
  { value: "default", label: "Green" },
  { value: "new", label: "Gold (soft)" },
  { value: "gold", label: "Gold (outline)" },
];

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "0");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [badge, setBadge] = useState(product?.badge ?? "");
  const [badgeVariant, setBadgeVariant] = useState<BadgeVariant>(
    product?.badge_variant ?? "default",
  );
  const [features, setFeatures] = useState<string[]>(
    product?.features.length ? product.features : [""],
  );
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const categoryOptions = [
    { value: "", label: "No category" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const onNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const updateFeature = (index: number, value: string) => {
    setFeatures((curr) => curr.map((f, i) => (i === index ? value : f)));
  };

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Upload failed");
      setImages((curr) => [...curr, result.url]);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      images,
      features: features.map((f) => f.trim()).filter(Boolean),
      badge,
      badge_variant: badgeVariant,
      category_id: categoryId || null,
      is_active: isActive,
      is_featured: isFeatured,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Save failed");
      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <Link
        href="/admin/products"
        className="mb-5 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <h1 className="mb-6 font-display text-2xl font-normal text-white sm:text-3xl">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
          <Input
            label="Slug (URL)"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <Textarea
          label="Description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Price (PKR)"
            required
            type="number"
            min="0"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Stock"
            required
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Select
            label="Category"
            options={categoryOptions}
            value={categoryId ?? ""}
            onChange={setCategoryId}
            placeholder="Select category"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Badge (optional)"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="e.g. Best Seller"
          />
          <Select
            label="Badge Style"
            options={BADGE_OPTIONS}
            value={badgeVariant}
            onChange={(v) => setBadgeVariant(v as BadgeVariant)}
            searchable={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">Features</span>
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                containerClassName="flex-1"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
              />
              <button
                type="button"
                onClick={() =>
                  setFeatures((curr) => curr.filter((_, i) => i !== index))
                }
                aria-label="Remove feature"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-glass-border text-white/50 hover:text-red-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeatures((curr) => [...curr, ""])}
            className="inline-flex w-fit items-center gap-1.5 text-sm text-gold hover:text-gold-light"
          >
            <Plus className="h-4 w-4" /> Add feature
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/70">Images</span>
          <div className="flex flex-wrap gap-3">
            {images.map((url) => (
              <div
                key={url}
                className="relative h-24 w-24 overflow-hidden rounded-md border border-glass-border"
              >
                <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((curr) => curr.filter((u) => u !== url))}
                  aria-label="Remove image"
                  className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label
              className={cn(
                "flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-glass-border text-white/50 transition-colors hover:border-gold/40 hover:text-gold",
                uploading && "pointer-events-none opacity-60",
              )}
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">Upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={onUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Checkbox
            label="Active (visible in shop)"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <Checkbox
            label="Featured on homepage"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
        </div>

        <div className="flex gap-3 pt-1">
          <Button type="submit" loading={submitting} size="lg">
            {isEdit ? "Save Changes" : "Create Product"}
          </Button>
          <Button variant="ghost" size="lg" href="/admin/products">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
