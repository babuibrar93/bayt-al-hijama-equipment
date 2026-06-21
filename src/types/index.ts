export interface NavLink {
  href: string;
  label: string;
}

export interface TrustCard {
  title: string;
  description: string;
  iconId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  features: string[];
  badge: string;
  badgeVariant: "default" | "new" | "gold";
  whatsappUrl: string;
  iconId: string;
}

export interface TimelineItem {
  number: string;
  title: string;
  description: string;
  direction: "left" | "right";
}

export interface Category {
  number: string;
  title: string;
  description: string;
  whatsappUrl: string;
  iconId: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  initials: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export type RevealVariant = "up" | "left" | "right";

export interface ParticleOptions {
  count: number;
  goldRatio?: number;
  minSize?: number;
  maxSize?: number;
  minDur?: number;
  maxDur?: number;
}
