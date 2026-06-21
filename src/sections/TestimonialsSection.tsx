"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/constants/testimonials";

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
    <section className="testimonials section" id="testimonials" aria-label="Customer testimonials">
      <div className="container">
        <SectionHeader
          eyebrow="Voices of Trust"
          title={
            <>
              What Our Community
              <br />
              <em>Says About Us</em>
            </>
          }
        />

        <div className="testimonials__slider" id="testimonialsSlider">
          <div
            className="testimonials__track"
            id="testimonialsTrack"
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
              <div className="testimonial-card" key={testimonial.id}>
                <div className="testimonial-card__quote" aria-hidden="true">
                  &quot;
                </div>
                <p className="testimonial-card__text">{testimonial.text}</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar" aria-hidden="true">
                    {testimonial.initials}
                  </div>
                  <div>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
                <div className="testimonial-card__stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials__controls">
          <button
            type="button"
            className="testimonials__btn"
            id="prevBtn"
            aria-label="Previous testimonial"
            onClick={handlePrev}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="testimonials__dots" id="testimonialsDots" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((testimonial, index) => (
              <button
                key={testimonial.id}
                type="button"
                className={`testimonials__dot${index === current ? " active" : ""}`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-selected={index === current}
                role="tab"
                onClick={() => {
                  goTo(index);
                  resetAuto();
                }}
              />
            ))}
          </div>

          <button
            type="button"
            className="testimonials__btn"
            id="nextBtn"
            aria-label="Next testimonial"
            onClick={handleNext}
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
