import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Gamepad2, Mail, X } from "lucide-react";
import { createCassoGame } from "./casso";
import { projectsData } from "./projects";

const email = "arun.creative@design.in";
const filters = [
  { label: "All Work", value: "all" },
  ...Array.from(
    new Set(projectsData.map(({ category }) => category)),
    (category) => ({
      label: category,
      value: category,
    }),
  ),
];
const activeFilterClass =
  "px-4 py-2 rounded-full bg-white text-black text-xs font-bold transition-all";
const inactiveFilterClass =
  "px-4 py-2 rounded-full bg-[#161616] text-neutral-400 hover:text-white border border-white/10 text-xs font-semibold transition-all";

function openEmailDraft(event) {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const subject = fields.get("scope") || "Portfolio project inquiry";
  const body = `Name: ${fields.get("name")}\nEmail: ${fields.get("email")}\n\n${fields.get("brief")}`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Hero({
  monochrome,
  toggleTheme,
  openCassoGame,
  openContactModal,
}) {
  return (
    <header
      id="home"
      className="hero-container max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-6 pb-12 sm:pb-16 shadow-2xl"
    >
      <div className="pointer-events-none absolute inset-0 flex justify-center items-end overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/d/1A7o0kWDg8c9SCyfczUKNBoDqDmSFF2TY"
          alt="Arun — Creative Director Portrait"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          className="hero-portrait-mask w-full max-w-[660px] h-[94%] object-cover object-[center_18%] grayscale contrast-125 mix-blend-luminosity opacity-75 select-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#110806] via-[#110806]/65 to-transparent"></div>
      </div>
      <nav className="relative z-20 flex items-center justify-between gap-4">
        <a
          href="#home"
          className="text-xl sm:text-2xl font-extrabold tracking-tighter text-white flex items-center gap-1"
        >
          Arun<span className="dynamic-accent-text">.</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <a href="#home" className="hover:text-white transition-colors">
            Home
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#works" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
          <button
            onClick={openCassoGame}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black border border-white/15 text-xs font-semibold text-white transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full dynamic-accent-bg"></span>
            Casso Game Space
          </button>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={openCassoGame}
            aria-label="Open Casso Game Space"
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/35 border border-white/15 text-[11px] font-semibold text-white"
          >
            <Gamepad2 aria-hidden="true" className="w-3.5 h-3.5" />
            <span>Casso</span>
          </button>
          <button
            id="themeToggleBtn"
            onClick={toggleTheme}
            aria-pressed={monochrome}
            type="button"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/35 hover:bg-black/55 border border-white/15 text-xs font-medium text-white/90 backdrop-blur-md transition-all"
          >
            <span
              id="themeDot"
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: monochrome ? "#fff" : "#f50" }}
            ></span>
            <span id="themeLabel">
              {monochrome ? "Monochrome" : "Amber Glow"}
            </span>
          </button>
          <button
            onClick={openContactModal}
            className="pill-btn inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold shadow-lg hover:bg-neutral-100 transition-all"
          >
            <span>Get in touch</span>
            <span className="w-7 h-7 rounded-full dynamic-accent-bg flex items-center justify-center">
              <ArrowRight
                aria-hidden="true"
                className="pill-arrow w-3.5 h-3.5"
              />
            </span>
          </button>
        </div>
      </nav>
      <div className="relative z-10 mt-16 sm:mt-24 lg:mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div id="heroTiltStage" className="lg:col-span-8 hero-tilt-stage">
          <div id="heroTiltCard" className="hero-tilt-card select-none">
            <p
              id="heroDepthKicker"
              className="hero-depth-kicker text-sm sm:text-base font-medium text-white/85 mb-2 tracking-tight"
            >
              Hey, I'm a
            </p>
            <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold tracking-tighter leading-[0.95] text-white">
              <span id="heroDepthLine1" className="hero-depth-line-1">
                Creative
              </span>
              <br />
              <span id="heroDepthLine2" className="hero-depth-line-2">
                Director
              </span>
            </h1>
          </div>
        </div>
        <div className="lg:col-span-4 lg:pb-2">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            Great design should feel invisible.
          </h2>
          <p className="text-xs sm:text-sm text-white/75 mt-2.5 leading-relaxed max-w-xs font-body">
            From logo to language, I build identities that move—sometimes
            polished, sometimes raw, always intentional.
          </p>
        </div>
      </div>
      <div className="relative z-10 mt-14 sm:mt-20 pt-6 border-t border-white/15 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="pillar-item">
          <span className="text-xs font-mono font-bold dynamic-accent-text">
            #01
          </span>
          <p className="text-xs sm:text-sm font-semibold text-white/95 mt-1">
            Brand Strategy
          </p>
        </div>
        <div className="pillar-item">
          <span className="text-xs font-mono font-bold dynamic-accent-text">
            #02
          </span>
          <p className="text-xs sm:text-sm font-semibold text-white/95 mt-1">
            Brand Identity Design
          </p>
        </div>
        <div className="pillar-item">
          <span className="text-xs font-mono font-bold dynamic-accent-text">
            #03
          </span>
          <p className="text-xs sm:text-sm font-semibold text-white/95 mt-1">
            Packaging &amp; Print
          </p>
        </div>
        <div className="pillar-item">
          <span className="text-xs font-mono font-bold dynamic-accent-text">
            #04
          </span>
          <p className="text-xs sm:text-sm font-semibold text-white/95 mt-1">
            Creative Direction
          </p>
        </div>
      </div>
    </header>
  );
}

export function Brands() {
  return (
    <section
      aria-label="Trusted by Brands Working"
      className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 mt-6"
    >
      <div className="rounded-3xl bg-[#111111] border border-white/[0.07] py-6 px-5 sm:px-8 flex flex-col md:flex-row items-center gap-5">
        <div className="shrink-0 text-center md:text-left md:pr-6 md:border-r border-white/10">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold leading-tight">
            Trusted by Brands
            <br className="hidden md:block" /> I've Helped Shape
          </p>
        </div>
        <div className="brand-marquee-viewport flex-1">
          <div className="brand-marquee-track items-center gap-10 sm:gap-12">
            <div className="flex items-center gap-10 sm:gap-12 shrink-0 text-neutral-400 text-sm sm:text-base font-bold tracking-tight">
              <span className="hover:text-white transition-colors">
                Mebanka
              </span>
              <span className="hover:text-white transition-colors">
                Entier Designs
              </span>
              <span className="hover:text-white transition-colors">
                KADS India
              </span>
              <span className="hover:text-white transition-colors">MVCTRA</span>
              <span className="hover:text-white transition-colors">
                Nattuchela
              </span>
              <span className="hover:text-white transition-colors">
                RacketLounge
              </span>
              <span className="hover:text-white transition-colors">
                Kumbil Productions
              </span>
              <span className="hover:text-white transition-colors">
                Sunrise Hospital
              </span>
              <span className="hover:text-white transition-colors">
                KVR Tata
              </span>
              <span className="hover:text-white transition-colors">
                Lingmei
              </span>
              <span className="hover:text-white transition-colors">
                Apacs Qatar
              </span>
              <span className="hover:text-white transition-colors">
                HYUNDAI
              </span>
              <span className="hover:text-white transition-colors">SAMRAS</span>
              <span className="hover:text-white transition-colors">
                Rummytime
              </span>
              <span className="hover:text-white transition-colors">Sagar</span>
              <span className="hover:text-white transition-colors">
                RV University
              </span>
              <span className="hover:text-white transition-colors">
                Yonex Kochi
              </span>
              <span className="hover:text-white transition-colors">
                Moopens
              </span>
              <span className="brands-count-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold text-white">
                <span className="brands-count-dot w-2 h-2 rounded-full"></span>
                100+ Brands
              </span>
            </div>
            <div
              className="flex items-center gap-10 sm:gap-12 shrink-0 text-neutral-400 text-sm sm:text-base font-bold tracking-tight"
              aria-hidden="true"
            >
              <span className="hover:text-white transition-colors">
                Mebanka
              </span>
              <span className="hover:text-white transition-colors">
                Entier Designs
              </span>
              <span className="hover:text-white transition-colors">
                KADS India
              </span>
              <span className="hover:text-white transition-colors">MVCTRA</span>
              <span className="hover:text-white transition-colors">
                Nattuchela
              </span>
              <span className="hover:text-white transition-colors">
                RacketLounge
              </span>
              <span className="hover:text-white transition-colors">
                Kumbil Productions
              </span>
              <span className="hover:text-white transition-colors">
                Sunrise Hospital
              </span>
              <span className="hover:text-white transition-colors">
                KVR Tata
              </span>
              <span className="hover:text-white transition-colors">
                Lingmei
              </span>
              <span className="hover:text-white transition-colors">
                Apacs Qatar
              </span>
              <span className="hover:text-white transition-colors">
                HYUNDAI
              </span>
              <span className="hover:text-white transition-colors">SAMRAS</span>
              <span className="hover:text-white transition-colors">
                Rummytime
              </span>
              <span className="hover:text-white transition-colors">Sagar</span>
              <span className="hover:text-white transition-colors">
                RV University
              </span>
              <span className="hover:text-white transition-colors">
                Yonex Kochi
              </span>
              <span className="hover:text-white transition-colors">
                Moopens
              </span>
              <span className="brands-count-badge inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold text-white">
                <span className="brands-count-dot w-2 h-2 rounded-full"></span>
                100+ Brands
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function About({ openContactModal }) {
  return (
    <section
      id="about"
      className="reveal max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-20 sm:pt-28 pb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-6">
          <span className="text-xs sm:text-sm font-semibold dynamic-accent-text tracking-tight">
            Behind the Designs
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white mt-2 leading-[1.08]">
            Shaping Visual Systems That Command Attention
          </h2>
        </div>
        <div className="lg:col-span-6 lg:pt-6">
          <p className="text-base sm:text-xl font-semibold text-white/90 leading-relaxed">
            I'm a Creative Head &amp; Senior Graphic Designer with 5+ years
            leading brand identities, commercial campaigns, and packaging across
            India and the GCC.
          </p>
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Let's Build Something
              <br />
              Meaningful Together
            </p>
            <button
              onClick={openContactModal}
              className="pill-btn inline-flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full dynamic-accent-bg text-xs font-bold shadow-lg"
            >
              <span>Get in touch</span>
              <span className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center">
                <ArrowRight
                  aria-hidden="true"
                  className="pill-arrow w-3.5 h-3.5"
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProjectCard({ project: proj }) {
  return (
    <article className="work-card group relative cursor-pointer rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-white/25 overflow-hidden flex flex-col transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
        <img
          src={proj.coverUrl}
          loading="lazy"
          alt={proj.title}
          className="work-card-img w-full h-full object-cover grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10">
            {proj.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-mono text-neutral-300">
            {proj.year}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-white transition-colors">
            {proj.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 line-clamp-1 font-body">
            {proj.summary}
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs font-semibold">
          <span className="text-neutral-500 font-mono">
            {proj.slides.length} Mockups
          </span>
          <a
            href={`#/works/${proj.id}`}
            aria-label={`View ${proj.title} project details`}
            className="dynamic-accent-text inline-flex items-center gap-1.5 after:absolute after:inset-0"
          >
            View Project{" "}
            <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function Works({ filter, setFilter }) {
  return (
    <section
      id="works"
      className="reveal max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 py-12 sm:py-16"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold dynamic-accent-text">
            Selected Case Studies
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
            My Portfolio Works
          </h2>
        </div>
        <div id="filterBar" className="flex flex-wrap items-center gap-2">
          {filters.map(({ label, value }) => (
            <button
              type="button"
              key={value}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={
                filter === value ? activeFilterClass : inactiveFilterClass
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div
        id="portfolioGrid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projectsData.map(
          (project) =>
            (filter === "all" || project.category === filter) && (
              <ProjectCard key={project.id} project={project} />
            ),
        )}
      </div>
    </section>
  );
}

export function Contact({ openCassoGame }) {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };
  return (
    <section
      id="contact"
      className="reveal max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-14 pt-12 pb-16"
    >
      <div className="rounded-3xl bg-[#111111] border border-white/[0.08] p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Available for Creative Direction &amp; Brand Projects
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white mt-4 leading-[1.06]">
              Ready to build an unforgettable brand?
            </h2>
            <p className="text-sm text-neutral-400 mt-3 max-w-md leading-relaxed font-body">
              Based in Kochi, Kerala — collaborating with ambitious founders,
              agencies, and enterprises across India and the GCC.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-semibold text-white transition-colors"
              >
                <Mail
                  aria-hidden="true"
                  className="w-4 h-4 dynamic-accent-text"
                />
                <span id="emailLabel">{email}</span>
                <span
                  id="copyBadge"
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300"
                >
                  {copied ? "COPIED!" : "COPY"}
                </span>
              </button>
              <span className="text-xs text-neutral-500 font-mono">
                Kochi, IN • GCC
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 bg-[#161616] border border-white/[0.07] rounded-2xl p-6 sm:p-8">
          <form onSubmit={openEmailDraft} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="inline-name"
                  className="block text-xs font-medium text-neutral-400 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="inline-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label
                  htmlFor="inline-email"
                  className="block text-xs font-medium text-neutral-400 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="inline-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@brand.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="inline-brief"
                className="block text-xs font-medium text-neutral-400 mb-1.5"
              >
                Project Brief
              </label>
              <textarea
                id="inline-brief"
                name="brief"
                rows="3"
                required
                placeholder="Share your project scope, goals, or timeline..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-full dynamic-accent-bg font-bold text-sm shadow-lg hover:opacity-95 transition-opacity"
            >
              Open Email Draft
            </button>
          </form>
        </div>
      </div>
      <footer className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>
          © <span id="year">{new Date().getFullYear()}</span> Arun — Creative
          Director &amp; Senior Graphic Designer.
        </p>
        <div className="flex items-center gap-6">
          <a href="#home" className="hover:text-white transition-colors">
            Top
          </a>
          <a href="#works" className="hover:text-white transition-colors">
            Works
          </a>
          <button
            onClick={openCassoGame}
            className="hover:text-white transition-colors"
          >
            Casso Game Space
          </button>
        </div>
      </footer>
    </section>
  );
}

export function ContactModal({ closeContactModal }) {
  return (
    <div
      id="contactModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contactTitle"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeContactModal();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#141414] border border-white/15 shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold dynamic-accent-text">
              Let's Collaborate
            </span>
            <h3
              id="contactTitle"
              className="text-2xl font-bold text-white mt-0.5"
            >
              Get in touch with Arun
            </h3>
          </div>
          <button
            aria-label="Close contact form"
            onClick={closeContactModal}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
        <form id="inquiryForm" onSubmit={openEmailDraft} className="space-y-4">
          <div>
            <label
              htmlFor="modal-name"
              className="block text-xs font-medium text-neutral-400 mb-1.5"
            >
              Your Name
            </label>
            <input
              id="modal-name"
              name="name"
              type="text"
              required
              placeholder="e.g. Rahul Menon"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label
              htmlFor="modal-email"
              className="block text-xs font-medium text-neutral-400 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="modal-email"
              name="email"
              type="email"
              required
              placeholder="rahul@company.com"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40"
            />
          </div>
          <div>
            <label
              htmlFor="modal-scope"
              className="block text-xs font-medium text-neutral-400 mb-1.5"
            >
              Project Scope
            </label>
            <select
              id="modal-scope"
              name="scope"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:outline-none focus:border-white/40"
            >
              <option value="Brand Identity & Logo System">
                Brand Identity &amp; Logo System
              </option>
              <option value="Creative Direction / Leadership Role">
                Creative Direction / Leadership Role
              </option>
              <option value="Packaging & Print Design">
                Packaging &amp; Print Design
              </option>
              <option value="Commercial Campaign & Posters">
                Commercial Campaign &amp; Posters
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="modal-brief"
              className="block text-xs font-medium text-neutral-400 mb-1.5"
            >
              Brief Details
            </label>
            <textarea
              id="modal-brief"
              name="brief"
              rows="3"
              required
              placeholder="Tell me about your brand, timeline, and goals..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/40"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-full dynamic-accent-bg font-bold text-sm shadow-lg hover:opacity-95 transition-opacity"
          >
            Open Email Draft
          </button>
        </form>
      </div>
    </div>
  );
}

export function CassoModal({ open, closeCassoGame }) {
  const modalRef = useRef(null);
  const game = useRef(null);
  useLayoutEffect(() => {
    game.current = createCassoGame(modalRef.current);
    return () => game.current.dispose();
  }, []);
  useLayoutEffect(() => {
    if (!game.current) return;
    if (open) game.current.open();
    else game.current.close();
  }, [open]);
  const resetCassoGame = () => game.current?.reset();
  const nextCassoStage = () => game.current?.next();
  return (
    <div
      id="cassoGameModal"
      className={`fixed inset-0 z-50 items-center justify-center p-4 bg-black/85 backdrop-blur-md ${open ? "flex" : "hidden"}`}
      ref={modalRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeCassoGame();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cassoGameTitle"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#111111] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-[#161616] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full dynamic-accent-bg animate-pulse"></span>
            <h3
              id="cassoGameTitle"
              className="text-sm sm:text-base font-extrabold tracking-tight text-white"
            >
              Casso Game Space{" "}
              <span className="text-neutral-500 font-medium">// Connect</span>
            </h3>
          </div>
          <button
            onClick={closeCassoGame}
            aria-label="Close Casso Game Space"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-3 bg-[#0D0D0D] border-b border-white/[0.06] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">
              SCORE:{" "}
              <strong id="cassoScore" className="text-white">
                0
              </strong>
            </span>
            <span className="text-neutral-400">
              TARGET:{" "}
              <strong id="cassoTarget" className="dynamic-accent-text">
                30
              </strong>
            </span>
          </div>
          <span className="text-neutral-400">
            MOVES:{" "}
            <strong id="cassoMoves" className="text-white">
              15
            </strong>
          </span>
        </div>
        <div className="relative w-full aspect-square bg-[#0A0A0A] select-none">
          <canvas
            id="cassoCanvas"
            className="w-full h-full block cursor-pointer touch-none"
          ></canvas>
          <div
            id="cassoToast"
            className="pointer-events-none absolute top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-white text-black text-xs font-extrabold tracking-wide opacity-0 transition-opacity duration-200 shadow-lg whitespace-nowrap"
          >
            CHAIN CLEARED!
          </div>
          <div
            id="cassoOverlay"
            className="hidden absolute inset-0 bg-black/80 backdrop-blur-sm flex-col items-center justify-center p-6 text-center z-10"
          >
            <span
              id="cassoOverlayBadge"
              className="px-3 py-1 rounded-full bg-white/10 text-[11px] font-mono uppercase tracking-widest text-neutral-300 mb-2"
            >
              STAGE COMPLETE
            </span>
            <h4
              id="cassoOverlayTitle"
              className="text-2xl font-extrabold text-white tracking-tight"
            >
              Target Reached!
            </h4>
            <p
              id="cassoOverlayDesc"
              className="text-xs text-neutral-400 mt-1.5 max-w-xs"
            >
              Clean chromatic flow. Ready for the next higher target?
            </p>
            <button
              id="cassoOverlayBtn"
              onClick={nextCassoStage}
              className="mt-5 px-6 py-2.5 rounded-full dynamic-accent-bg text-xs font-bold shadow-lg hover:opacity-95 transition-opacity"
            >
              Next Target
            </button>
          </div>
        </div>
        <div className="px-6 py-4 bg-[#141414] border-t border-white/10 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-400 leading-snug">
            Drag horizontally or vertically to connect 2+ matching squares.
          </p>
          <button
            onClick={resetCassoGame}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white hover:text-black text-xs font-semibold text-white transition-all shrink-0"
          >
            New Grid
          </button>
        </div>
      </div>
    </div>
  );
}
