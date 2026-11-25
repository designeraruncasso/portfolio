export function startVisualEffects() {
  const listeners = new AbortController();
  const { signal } = listeners;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const sections = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 },
  );

  for (const section of sections) {
    if (reducedMotion) section.classList.add("active");
    else observer.observe(section);
  }

  if (!reducedMotion && finePointer) {
    const spotlight = document.getElementById("cursor-spotlight");
    const hero = document.getElementById("home");
    const tiltCard = document.getElementById("heroTiltCard");
    window.addEventListener(
      "pointermove",
      (event) => {
        spotlight.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        spotlight.classList.add("is-visible");
        spotlight.classList.toggle(
          "is-expanded",
          Boolean(event.target.closest("a, button, .work-card, .pillar-item")),
        );
      },
      { signal, passive: true },
    );
    document.documentElement.addEventListener(
      "pointerleave",
      () => spotlight.classList.remove("is-visible"),
      { signal },
    );
    hero?.addEventListener(
      "pointermove",
      (event) => {
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        tiltCard.style.transform = `rotateX(${-y * 22}deg) rotateY(${x * 28}deg)`;
      },
      { signal, passive: true },
    );
    hero?.addEventListener(
      "pointerleave",
      () => {
        tiltCard.style.transform = "";
      },
      { signal },
    );
  }

  return () => {
    observer.disconnect();
    listeners.abort();
  };
}
