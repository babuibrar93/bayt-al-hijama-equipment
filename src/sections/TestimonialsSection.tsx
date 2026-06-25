"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/constants/testimonials";
import { cn, container, section } from "@/lib/classes";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartRef = useRef(0);

  const goTo = useCallback((index: number) => {
    setCurrent((index + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  const resetAuto = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [resetAuto]);

  const handlePrev = () => {
    goTo(current - 1);
    resetAuto();
  };

  const handleNext = () => {
    goTo(current + 1);
    resetAuto();
  };

  return (
    <section
      data-section
      className={`${section} bg-black-3`}
      id="testimonials"
      aria-label="Customer testimonials"
    >
      <div className={container}>
        <SectionHeader
          eyebrow="Voices of Trust"
          title={
            <>
              What Our Community <em>Says About Us</em>
            </>
          }
          subtitle="Feedback from therapists, clinic owners, and students across Pakistan."
        />

        <div className="mt-5 mb-5 overflow-hidden">
          <div
            id="testimonialsTrack"
            className="flex transition-transform duration-[600ms] ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
            onTouchStart={(event) => {
              touchStartRef.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              const dx = event.changedTouches[0].clientX - touchStartRef.current;
              if (Math.abs(dx) > 50) {
                goTo(current + (dx < 0 ? 1 : -1));
                resetAuto();
              }
            }}
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="relative min-w-full rounded-xl border border-glass-border bg-glass-bg px-6 py-5 max-sm:px-4 max-sm:py-4"
              >
                <div
                  className="mb-2 font-body text-[2.25rem] font-normal leading-[0.8] text-gold/40 max-sm:text-[2rem]"
                  aria-hidden="true"
                >
                  &quot;
                </div>
                <p className="mb-4 max-w-[700px] font-body text-[1.05rem] font-normal italic leading-[1.55] text-white/80 max-sm:text-[0.95rem]">
                  {testimonial.text}
                </p>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-mid to-gold text-[0.75rem] font-bold text-white"
                    aria-hidden="true"
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <strong className="mb-0.5 block font-semibold text-white">
                      {testimonial.author}
                    </strong>
                    <span className="text-[0.8rem] text-white/50">{testimonial.role}</span>
                  </div>
                </div>
                <div className="text-[0.9rem] tracking-[3px] text-gold" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            id="prevBtn"
            aria-label="Previous testimonial"
            onClick={handlePrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-white/80 transition-all duration-[250ms] hover:scale-110 hover:border-green-mid hover:bg-green-mid hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                aria-label={`Go to testimonial ${index + 1}`}
                aria-selected={index === current}
                role="tab"
                onClick={() => {
                  goTo(index);
                  resetAuto();
                }}
                className={cn(
                  "h-1.5 cursor-pointer rounded-[3px] border-none bg-white/30 transition-all duration-300 ease-out",
                  index === current ? "w-6 bg-gold" : "w-1.5",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            id="nextBtn"
            aria-label="Next testimonial"
            onClick={handleNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border bg-glass-bg text-white/80 transition-all duration-[250ms] hover:scale-110 hover:border-green-mid hover:bg-green-mid hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
