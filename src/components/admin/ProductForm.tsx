"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [costPrice, setCostPrice] = useState(
    product?.cost_price != null ? String(product.cost_price) : "",
  );
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

  const slug = slugify(name);

  const categoryOptions = [
    { value: "", label: "No category" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

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
    if (!slug) {
      toast.error("Enter a product name to generate the URL");
      return;
    }
    setSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      cost_price: costPrice === "" ? null : Number(costPrice),
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
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6 sm:gap-3">
        <Button
          href="/admin/products"
          variant="subtle"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="shrink-0"
        >
          Back
        </Button>
        <div className="min-w-0">
          <h1 className="truncate font-body text-xl font-normal text-white sm:text-2xl lg:text-3xl">
            {isEdit ? "Edit product" : "Add product"}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4 sm:space-y-5">
          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <h2 className="mb-3 text-sm font-medium text-white/80 sm:mb-4">
              Basics
            </h2>
            <Input
              label="Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product name"
            />
            <Textarea
              label="Description"
              required
              rows={4}
              autoGrow
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short product description"
              containerClassName="mt-3 sm:mt-4"
            />
          </section>

          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <h2 className="mb-3 text-sm font-medium text-white/80 sm:mb-4">
              Pricing & stock
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              <Input
                label="Sell price (PKR)"
                required
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Input
                label="Cost price (PKR)"
                type="number"
                min="0"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="Optional"
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
          </section>

          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <h2 className="mb-3 text-sm font-medium text-white/80 sm:mb-4">
              Badge
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Input
                label="Badge text (optional)"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Seller"
              />
              <Select
                label="Badge style"
                options={BADGE_OPTIONS}
                value={badgeVariant}
                onChange={(v) => setBadgeVariant(v as BadgeVariant)}
                searchable={false}
              />
            </div>
          </section>

          <section className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4 lg:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
              <h2 className="text-sm font-medium text-white/80">Features</h2>
              <button
                type="button"
                onClick={() => setFeatures((curr) => [...curr, ""])}
                className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light"
              >
                <Plus className="h-4 w-4" /> Add feature
              </button>
            </div>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[minmax(0,1fr)_2.75rem] items-end gap-2"
                >
                  <Input
                    label={index === 0 ? "Feature" : undefined}
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
                    disabled={features.length <= 1}
                    className="inline-flex h-11 w-full items-center justify-center rounded-md border border-glass-border text-white/50 hover:text-red-400 disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </div>

        <aside className="space-y-3 lg:sticky lg:top-0 lg:space-y-4">
          <div className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4">
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-white/80">Images</h2>
              {images.length > 0 ? (
                <span className="text-xs text-white/40">{images.length}</span>
              ) : null}
            </div>

            {images[0] ? (
              <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-md border border-glass-border bg-black/30">
                <Image
                  src={images[0]}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImages((curr) => curr.slice(1))}
                  aria-label="Remove cover image"
                  className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-1.5 left-1.5 rounded bg-black/65 px-1.5 py-0.5 text-[10px] text-white/80">
                  Cover
                </span>
              </div>
            ) : null}

            <div className="grid grid-cols-4 gap-1.5">
              {images.slice(1).map((url, index) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded border border-glass-border bg-black/30"
                >
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((curr) =>
                        curr.filter((_, i) => i !== index + 1),
                      )
                    }
                    aria-label="Remove image"
                    className="absolute inset-0 flex items-center justify-center bg-black/0 text-transparent transition-colors hover:bg-black/55 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              <label
                aria-label={images.length ? "Add image" : "Upload image"}
                title={images.length ? "Add image" : "Upload image"}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-md bg-gold/15 text-gold transition-colors hover:bg-gold/25 hover:text-gold-light",
                  images.length
                    ? "aspect-square"
                    : "col-span-4 aspect-[4/3]",
                  uploading && "pointer-events-none opacity-60",
                )}
              >
                {uploading ? (
                  <Loader2
                    className={cn(
                      "animate-spin",
                      images.length ? "h-4 w-4" : "h-6 w-6",
                    )}
                  />
                ) : (
                  <Upload
                    className={images.length ? "h-4 w-4" : "h-6 w-6"}
                    aria-hidden="true"
                  />
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

          <div className="rounded-lg border border-glass-border bg-glass-bg p-3 sm:p-4">
            <h2 className="mb-3 text-sm font-medium text-white/80">
              Visibility
            </h2>
            <div className="flex flex-col gap-3">
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
          </div>

          <Button
            type="submit"
            loading={submitting}
            size="lg"
            className="w-full"
          >
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            href="/admin/products"
            className="w-full"
          >
            Cancel
          </Button>
        </aside>
      </div>
    </form>
  );
}
