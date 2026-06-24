export type BadgeVariant = "default" | "new" | "gold";

export type PaymentMethod = "cod" | "bank_transfer" | "jazzcash" | "easypaisa";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

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

export interface ProductWithCategory extends Product {
  category: Pick<Category, "id" | "name" | "slug"> | null;
}

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
  quantity: number;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  customer?: CustomerProfile | null;
}
