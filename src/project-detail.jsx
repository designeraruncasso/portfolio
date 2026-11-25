import { ArrowLeft } from "lucide-react";

function BackToWorks() {
  return (
    <a
      href="#works"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-black"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      All projects
    </a>
  );
}

export function ProjectDetail({ project }) {
  return (
    <main className="mx-auto max-w-[1400px] px-5 pb-20 pt-6 sm:px-10 lg:px-14">
      <nav className="flex items-center justify-between gap-4">
        <a href="#home" className="text-2xl font-extrabold tracking-tighter">
          Arun<span className="dynamic-accent-text">.</span>
        </a>
        <BackToWorks />
      </nav>
      {project ? (
        <article>
          <header className="border-b border-white/10 py-12 sm:py-16 lg:py-20">
            <p className="dynamic-accent-text text-xs font-semibold uppercase tracking-[0.2em]">
              {project.category} <span aria-hidden="true">·</span>{" "}
              {project.year}
            </p>
            <h1
              id="project-title"
              tabIndex={-1}
              className="mt-4 max-w-5xl text-4xl font-extrabold leading-[1.02] tracking-tighter focus:outline-none sm:text-6xl lg:text-7xl"
            >
              {project.client}
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-neutral-300 sm:text-lg">
              {project.description}
            </p>
          </header>
          <div className="mt-7 grid grid-cols-1 items-start gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {project.slides.map((src, index) => (
              <figure
                key={src}
                className="overflow-hidden rounded-2xl border border-white/10 bg-surface sm:rounded-3xl"
              >
                <img
                  src={src}
                  alt={`${project.title} — image ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  decoding="async"
                  className="block h-auto w-full"
                />
              </figure>
            ))}
          </div>
          <footer className="mt-10 border-t border-white/10 pt-7">
            <BackToWorks />
          </footer>
        </article>
      ) : (
        <h1
          id="project-title"
          tabIndex={-1}
          className="mt-16 text-4xl font-bold"
        >
          Project not found
        </h1>
      )}
    </main>
  );
}
