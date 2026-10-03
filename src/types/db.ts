export type BadgeVariant = "default" | "new" | "gold";

export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash" | "easypaisa";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PurchaseStatus = "draft" | "confirmed" | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  /** Admin-only; never expose on storefront. */
  cost_price: number | null;
  stock: number;
  images: string[];
  features: string[];
  badge: string | null;
  badge_variant: BadgeVariant;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

/** Public shop product — no cost_price. */
export type PublicProduct = Omit<Product, "cost_price">;

export interface ProductWithCategory extends Product {
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

export type PublicProductWithCategory = PublicProduct & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  avatar_url: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  is_admin: boolean;
  created_at: string;
}

export type CustomerProfile = Pick<
  Profile,
  "id" | "full_name" | "avatar_url" | "email"
>;

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  province: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total: number;
  notes: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  unit_cost: number | null;
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customer?: CustomerProfile | null;
}

export interface Purchase {
  id: string;
  purchase_number: string;
  supplier_name: string;
  supplier_phone: string | null;
  status: PurchaseStatus;
  subtotal: number;
  notes: string | null;
  purchased_at: string;
  created_at: string;
  updated_at: string;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string | null;
  product_name: string;
  unit_cost: number;
  quantity: number;
}

export interface PurchaseWithItems extends Purchase {
  items: PurchaseItem[];
}

export interface OrderProfit {
  goodsRevenue: number;
  cogs: number;
  profit: number;
  missingCostLines: number;
}
