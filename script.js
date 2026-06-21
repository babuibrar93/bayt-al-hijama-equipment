/* ═══════════════════════════════════════════════
   BAYT AL HIJAMA EQUIPMENT — MASTER SCRIPT
   ═══════════════════════════════════════════════ */

"use strict";

/* ── LOADER ── */
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 2200);
  });
  // Failsafe
  setTimeout(() => loader.classList.add("hidden"), 3500);
})();

/* ── CURSOR GLOW (desktop only) ── */
(function initCursorGlow() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const glow = document.getElementById("cursorGlow");
  if (!glow) return;
  let mx = window.innerWidth / 2,
    my = window.innerHeight / 2;
  let cx = mx,
    cy = my;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + "px";
    glow.style.top = cy + "px";
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ── NAVIGATION ── */
(function initNav() {
  const nav = document.getElementById("nav");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  // Scroll state
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileMenu.querySelectorAll(".mobile-menu__link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();

/* ── PARTICLES ── */
(function initParticles() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  function createParticles(containerId, count, opts = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const {
      goldRatio = 0.4,
      minSize = 1,
      maxSize = 3,
      minDur = 6,
      maxDur = 16,
    } = opts;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const isGold = Math.random() < goldRatio;
      const size = minSize + Math.random() * (maxSize - minSize);
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = minDur + Math.random() * (maxDur - minDur);
      const delay = Math.random() * -duration;
      const color = isGold
        ? `rgba(201, 168, 76, ${0.2 + Math.random() * 0.5})`
        : `rgba(27, 107, 71, ${0.2 + Math.random() * 0.4})`;

      Object.assign(p.style, {
        left: x + "%",
        top: y + "%",
        width: size + "px",
        height: size + "px",
        background: color,
        animationName: "particleRise",
        animationDuration: duration + "s",
        animationDelay: delay + "s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
      });
      container.appendChild(p);
    }
  }

  // Inject keyframes
  const style = document.createElement("style");
  style.textContent = `
       @keyframes particleRise {
         0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
         10%  { opacity: 1; }
         50%  { transform: translateY(-120px) translateX(${Math.random() > 0.5 ? "" : "-"}${20 + Math.random() * 30}px) scale(1.2); }
         90%  { opacity: 0.3; }
         100% { transform: translateY(-240px) translateX(0) scale(0.5); opacity: 0; }
       }
     `;
  document.head.appendChild(style);

  createParticles("heroParticles", 40, { goldRatio: 0.4 });
  createParticles("ctaParticles", 20, {
    goldRatio: 0.5,
    minDur: 5,
    maxDur: 12,
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const elements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
})();

/* ── COUNTER ANIMATION ── */
(function initCounters() {
  const stats = document.querySelectorAll("[data-target]");
  if (!stats.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((el) => observer.observe(el));
})();

/* ── TESTIMONIALS CAROUSEL ── */
(function initTestimonials() {
  const track = document.getElementById("testimonialsTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsContainer = document.getElementById("testimonialsDots");
  if (!track) return;

  const cards = track.querySelectorAll(".testimonial-card");
  let current = 0;
  let autoTimer;

  // Create dots
  const dots = [];
  cards.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "testimonials__dot" + (i === 0 ? " active" : "");
    btn.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
    btn.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(btn);
    dots.push(btn);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      goTo(current - 1);
      resetAuto();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      goTo(current + 1);
      resetAuto();
    });

  // Touch swipe
  let startX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      goTo(current + (dx < 0 ? 1 : -1));
      resetAuto();
    }
  });

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }
  startAuto();
})();

/* ── MAGNETIC BUTTONS ── */
(function initMagnetic() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  document.querySelectorAll(".btn, .nav__cta, .sticky-wa").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      setTimeout(() => {
        btn.style.transition = "";
      }, 500);
    });
  });
})();

/* ── PRODUCT CARD TILT ── */
(function initCardTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  document
    .querySelectorAll(".product-card, .trust__card, .cat-card")
    .forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        card.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
        setTimeout(() => {
          card.style.transition = "";
        }, 600);
      });
    });
})();

/* ── HERO PARALLAX ── */
(function initParallax() {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reducedMotion) return;

  const visual = document.querySelector(".hero__visual");
  const geos = document.querySelectorAll(".hero__geo");
  if (!visual) return;

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const heroH =
            document.querySelector(".hero")?.offsetHeight || window.innerHeight;
          if (scrollY <= heroH) {
            const p = scrollY / heroH;
            if (visual) visual.style.transform = `translateY(${p * 60}px)`;
            geos.forEach((g, i) => {
              g.style.transform = `translateY(${p * (30 + i * 15)}px)`;
            });
          }
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
})();

/* ── STICKY WA SHOW/HIDE ── */
(function initStickyWA() {
  const wa = document.getElementById("stickyWA");
  if (!wa) return;
  const hero = document.getElementById("hero");
  if (!hero) return;

  const observer = new IntersectionObserver(
    (entries) => {
      wa.style.opacity = entries[0].isIntersecting ? "0" : "1";
      wa.style.pointerEvents = entries[0].isIntersecting ? "none" : "auto";
    },
    { threshold: 0.3 },
  );

  wa.style.transition = "opacity 0.4s ease";
  observer.observe(hero);
})();

/* ── GRADIENT HIGHLIGHT on section entry ── */
(function initGlowEntrance() {
  const sections = document.querySelectorAll(".section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty("--entry-glow", "1");
        }
      });
    },
    { threshold: 0.1 },
  );
  sections.forEach((s) => observer.observe(s));
})();

/* ── HERO GEO MOUSE TRACKING ── */
(function initGeoMouseTrack() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  const hero = document.getElementById("hero");
  const geos = document.querySelectorAll(".hero__geo");
  if (!hero || !geos.length) return;

  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = (e.clientX - rect.left - cx) / cx;
    const y = (e.clientY - rect.top - cy) / cy;
    geos.forEach((g, i) => {
      const depth = (i + 1) * 8;
      g.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
  });
  hero.addEventListener("mouseleave", () => {
    geos.forEach((g) => {
      g.style.transform = "";
    });
  });
})();
