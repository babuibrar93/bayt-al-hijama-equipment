import { SITE } from "@/constants/site";

const base = `https://wa.me/${SITE.whatsappNumber}`;

export const WHATSAPP = {
  general: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I am interested in your Hijama equipment.")}`,
  nav: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I am interested in your Hijama equipment.")}`,
  hero: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I want to enquire about Hijama equipment and pricing.")}`,
  sticky: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I am interested in Hijama equipment.")}`,
  cta: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I would like to place an order for Hijama equipment. Please guide me.")}`,
  mobile: base,
  products: {
    vacuumKit: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I want to order the Vacuum Pump Hijama Kit. Please share pricing.")}`,
    siliconeSet: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I am interested in the Premium Silicone Cup Set. Please send details.")}`,
    clinicKit: `${base}?text=${encodeURIComponent("Assalamu Alaikum! I want details about the Complete Clinic Starter Kit.")}`,
  },
  categories: {
    cups: `${base}?text=${encodeURIComponent("I want to enquire about Hijama Cups.")}`,
    kits: `${base}?text=${encodeURIComponent("I want to enquire about Complete Hijama Kits.")}`,
    accessories: `${base}?text=${encodeURIComponent("I want to enquire about Hijama Accessories.")}`,
    consumables: `${base}?text=${encodeURIComponent("I want to enquire about Hijama Consumables and disposables.")}`,
  },
  footer: {
    cups: `${base}?text=${encodeURIComponent("I want to enquire about Hijama Cups.")}`,
    kits: `${base}?text=${encodeURIComponent("I want to enquire about Complete Hijama Kits.")}`,
    accessories: `${base}?text=${encodeURIComponent("I want to enquire about Hijama Accessories.")}`,
    consumables: `${base}?text=${encodeURIComponent("I want to enquire about Hijama Consumables.")}`,
    bulk: `${base}?text=${encodeURIComponent("I want bulk pricing for Hijama equipment.")}`,
    therapists: `${base}?text=${encodeURIComponent("I am a Hijama Therapist looking for equipment.")}`,
    clinics: `${base}?text=${encodeURIComponent("I run a Hijama Clinic and need equipment.")}`,
    institutes: `${base}?text=${encodeURIComponent("I run a Hijama Training Institute.")}`,
    students: `${base}?text=${encodeURIComponent("I am a student learning Hijama.")}`,
    wellness: `${base}?text=${encodeURIComponent("I run a Wellness Center.")}`,
  },
} as const;
