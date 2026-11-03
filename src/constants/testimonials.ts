import type { Testimonial } from "@/types";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "abdul-rahman",
    text: "I have been ordering from Bayt Al Hijama for over a year now. The quality of their vacuum pump kits is exceptional — I have used them on hundreds of clients without a single issue. Fast delivery to Lahore every time.",
    author: "Abdul Rahman",
    role: "Certified Hijama Therapist, Lahore",
    initials: "AR",
  },
  {
    id: "sister-asma",
    text: "We run a Hijama training institute in Karachi and Bayt Al Hijama is our exclusive equipment supplier. They give us bulk pricing, deliver on time, and the students love the quality. Highly recommended for institutes.",
    author: "Sister Asma",
    role: "Director, Al-Shifa Hijama Institute, Karachi",
    initials: "SA",
  },
  {
    id: "dr-umar",
    text: "Ordered the complete clinic kit when I was setting up my practice in Islamabad. Everything was properly packaged, sterile, and exactly as described. Their WhatsApp support helped me choose the right sizes. JazakAllah Khair.",
    author: "Dr. Umar Khan",
    role: "Alternative Medicine Practitioner, Islamabad",
    initials: "UK",
  },
  {
    id: "fatima-malik",
    text: "Best silicone cups I have ever used — the grip, the flexibility, the suction — all perfect. I travel between cities for Hijama sessions and these are easy to carry and clean. Will not buy from anywhere else now.",
    author: "Fatima Malik",
    role: "Mobile Hijama Therapist, Faisalabad",
    initials: "FM",
  },
  {
    id: "zainab-ahmed",
    text: "I was a student learning Hijama and Bayt Al Hijama gave me a student discount on my first kit. The quality was far better than I expected for the price. Now I recommend them to all my fellow students.",
    author: "Zainab Ahmed",
    role: "Hijama Student, Peshawar",
    initials: "ZA",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Do you deliver Hijama equipment across Pakistan?",
    answer:
      "Yes. Bayt Al Hijama Equipment delivers Hijama cups, pumps, kits, and clinic supplies to cities and towns across Pakistan, including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar.",
  },
  {
    question: "Is shipping included in the product price?",
    answer:
      "No. The price on each product is the item price only. Shipping is confirmed with you after the order, based on your city and what you ordered.",
  },
  {
    question: "How can I order Hijama equipment?",
    answer:
      "Add products to your cart on baytalhijama.com and place the order online, or message WhatsApp at +92 329 3561309. The team can help you choose cup sizes, pumps, and clinic supplies.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "You can pay by cash on delivery, Meezan Bank transfer or Raast, JazzCash, or Easypaisa. Payment details are shown at checkout.",
  },
  {
    question: "What products do you supply?",
    answer:
      "The shop covers Hijama cups, vacuum pumps and machines, therapy tools such as hijama pens and massage rollers, and consumables including gloves, blades, lancets, masks, gowns, and clinic disposables.",
  },
  {
    question: "Who do you supply?",
    answer:
      "Hijama therapists, clinic owners, training institutes, students, and wellness centers across Pakistan. There is no minimum order, and bulk pricing is available on WhatsApp.",
  },
  {
    question: "Where is Bayt Al Hijama Equipment based?",
    answer:
      "The business is based in Lahore, Pakistan, and ships nationwide. Call or WhatsApp +92 329 3561309, or email info@baytalhijama.com.",
  },
] as const;
