import { useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Gamepad2 } from "lucide-react";
import {
  About,
  Brands,
  CassoModal,
  Contact,
  ContactModal,
  Hero,
  Works,
} from "./components";
import { ProjectDetail } from "./project-detail";
import { projectsData } from "./projects";
import { startVisualEffects } from "./visual-effects";
import "./styles.css";

const dialogIds = {
  contact: "contactModal",
  casso: "cassoGameModal",
};

function App() {
  const [monochrome, setMonochrome] = useState(false);
  const [filter, setFilter] = useState("all");
  const [dialog, setDialog] = useState(null);
  const [hash, setHash] = useState(() => window.location.hash);
  const detailRoute = hash.startsWith("#/works/");
  const project = detailRoute
    ? projectsData.find((item) => hash === `#/works/${item.id}`)
    : undefined;

  const openCassoGame = () => setDialog("casso");
  const openContactModal = () => setDialog("contact");
  const closeDialog = () => setDialog(null);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(startVisualEffects, [detailRoute]);

  useLayoutEffect(() => {
    document.title = project
      ? `${project.client} — Arun’s Portfolio`
      : "Arun — Creative Director & Senior Graphic Designer";
    if (detailRoute) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("project-title")?.focus({ preventScroll: true });
    } else if (hash === "#works") {
      document.getElementById("works")?.scrollIntoView();
    }
  }, [hash, project, detailRoute]);

  useLayoutEffect(() => {
    document.body.classList.toggle("monochrome-mode", monochrome);
  }, [monochrome]);

  useLayoutEffect(() => {
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const target = document.getElementById(dialogIds[dialog]);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    target.querySelector("button")?.focus();

    function manageFocus(event) {
      if (event.key === "Escape") setDialog(null);
      if (event.key !== "Tab") return;
      const controls = [
        ...target.querySelectorAll("button, input, textarea, select, a[href]"),
      ].filter(
        (element) => !element.disabled && element.getClientRects().length > 0,
      );
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", manageFocus);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", manageFocus);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [dialog]);

  return (
    <>
      <div id="cursor-spotlight" aria-hidden="true" />
      <div inert={Boolean(dialog)}>
        <button
          type="button"
          id="casso-mascot-dock"
          onClick={openCassoGame}
          aria-label="Open Casso Game Space"
        >
          <span className="casso-mascot-badge">Play Casso Game Space</span>
          <Gamepad2
            id="casso-mascot-img"
            aria-hidden="true"
            className="w-12 rounded-xl border border-white/20 bg-neutral-900 p-2 dynamic-accent-text"
          />
        </button>
        {detailRoute ? (
          <ProjectDetail project={project} />
        ) : (
          <>
            <Hero
              monochrome={monochrome}
              toggleTheme={() => setMonochrome((value) => !value)}
              openCassoGame={openCassoGame}
              openContactModal={openContactModal}
            />
            <main>
              <Brands />
              <About openContactModal={openContactModal} />
              <Works filter={filter} setFilter={setFilter} />
              <Contact openCassoGame={openCassoGame} />
            </main>
          </>
        )}
      </div>
      {dialog === "contact" && <ContactModal closeContactModal={closeDialog} />}
      <CassoModal open={dialog === "casso"} closeCassoGame={closeDialog} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
