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
      "Yes, Bayt Al Hijama Equipment delivers professional Hijama cups, kits, and accessories to all major cities and towns across Pakistan including Lahore, Karachi, Islamabad, and beyond.",
  },
  {
    question: "How can I order Hijama equipment?",
    answer:
      "You can order directly via WhatsApp at +92 329 3561309. Our team provides product recommendations, pricing, and delivery details within minutes.",
  },
  {
    question: "What products do you supply?",
    answer:
      "We supply Hijama cups, complete kits, vacuum pumps, accessories, and clinic consumables including lancets, gloves, and sterilization supplies.",
  },
] as const;
