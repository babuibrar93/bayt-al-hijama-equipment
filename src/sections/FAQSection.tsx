import SectionHeader from "@/components/ui/SectionHeader";
import { FAQ_ITEMS } from "@/constants/testimonials";
import { container, getRevealClass, glassCard, section } from "@/lib/classes";
import { cn } from "@/lib/classes";

export default function FAQSection() {
  return (
    <section
      data-section
      className={`${section} bg-black`}
      id="faq"
      aria-label="Frequently asked questions"
    >
      <div className={`${container} relative`}>
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Frequently Asked <em>Questions</em>
            </>
          }
          subtitle="Ordering, delivery, and product questions — answered."
        />

        <div className="mx-auto mt-5 flex max-w-3xl flex-col gap-2.5">
          {FAQ_ITEMS.map((item, index) => (
            <details
              key={item.question}
              data-reveal
              className={cn(
                glassCard,
                getRevealClass("up", (index % 4 || 1) as 1 | 2 | 3 | 4),
                "group px-5 py-4",
              )}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-body text-base text-white marker:content-none sm:text-lg [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1">{item.question}</span>
                <span
                  className="shrink-0 text-2xl font-light leading-none text-gold transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 leading-relaxed text-white/65">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
