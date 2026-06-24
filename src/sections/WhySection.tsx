import SectionHeader from "@/components/ui/SectionHeader";
import { TIMELINE_ITEMS } from "@/constants/why";
import { cn, container, getRevealClass, section } from "@/lib/classes";

export default function WhySection() {
  return (
    <section
      data-section
      className={`${section} bg-black`}
      id="why"
      aria-label="Why choose us"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-why-pattern"
        aria-hidden="true"
      />
      <div className={`${container} relative`}>
        <SectionHeader
          eyebrow="Our Promise"
          title={
            <>
              Not Just a Supplier —
              <br />
              <em>Your Practice Partner</em>
            </>
          }
        />

        <div className="relative mt-[72px] before:absolute before:bottom-0 before:left-1/2 before:top-0 before:hidden before:w-px before:-translate-x-1/2 before:bg-gradient-to-b before:from-transparent before:via-glass-border before:to-transparent lg:before:block">
          {TIMELINE_ITEMS.map((item) => {
            const isLeft = item.direction === "left";

            return (
              <div
                key={item.number}
                data-reveal
                className={cn(
                  "relative mb-16 grid grid-cols-[auto_1fr] items-center gap-5 last:mb-0 lg:mb-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-10",
                  getRevealClass(isLeft ? "left" : "right"),
                )}
              >
                <div
                  className={cn(
                    "group z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold bg-black transition-all duration-[350ms] hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(201,168,76,0.2)]",
                    "lg:col-start-2 lg:row-start-1",
                  )}
                >
                  <span className="text-[0.7rem] font-bold tracking-[0.05em] text-gold">
                    {item.number}
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-md border border-glass-border bg-glass-bg p-8 transition-all duration-[350ms] hover:border-gold/20 hover:bg-glass-bg-hover",
                    isLeft
                      ? "lg:col-start-1 lg:row-start-1"
                      : "lg:col-start-3 lg:row-start-1",
                  )}
                >
                  <h3 className="mb-2.5 font-display text-[1.3rem] font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-[0.9rem] leading-[1.75] text-white/60">
                    {item.description}
                  </p>
                </div>

                <div
                  className={cn(
                    "hidden lg:block",
                    isLeft ? "lg:col-start-3" : "lg:col-start-1",
                  )}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
