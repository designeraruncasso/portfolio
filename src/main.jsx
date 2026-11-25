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
  ProjectDrawer,
  Works,
} from "./components";
import { projectsData } from "./projects";
import { startVisualEffects } from "./visual-effects";
import "./styles.css";

const dialogIds = {
  project: "caseStudyDrawer",
  contact: "contactModal",
  casso: "cassoGameModal",
};

function App() {
  const [monochrome, setMonochrome] = useState(false);
  const [filter, setFilter] = useState("all");
  const [dialog, setDialog] = useState(null);
  const [projectIndex, setProjectIndex] = useState(0);
  const [slide, setSlide] = useState(0);

  const openCassoGame = () => setDialog("casso");
  const openContactModal = () => setDialog("contact");
  const closeDialog = () => setDialog(null);

  function openProject(index) {
    setProjectIndex(index);
    setSlide(0);
    setDialog("project");
  }

  function switchDrawerProject(step) {
    const count = projectsData.length;
    setProjectIndex((index) => (index + step + count) % count);
    setSlide(0);
  }

  const slideCount = projectsData[projectIndex].slides.length;
  const moveGallerySlide = (step) =>
    setSlide((index) => (index + step + slideCount) % slideCount);

  useEffect(startVisualEffects, []);

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

  useEffect(() => {
    if (dialog !== "project") return;
    function handleGalleryKeys(event) {
      if (event.key === "ArrowRight")
        setSlide((index) => (index + 1) % slideCount);
      if (event.key === "ArrowLeft")
        setSlide((index) => (index + slideCount - 1) % slideCount);
    }
    document.addEventListener("keydown", handleGalleryKeys);
    return () => document.removeEventListener("keydown", handleGalleryKeys);
  }, [dialog, slideCount]);

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
        <Hero
          monochrome={monochrome}
          toggleTheme={() => setMonochrome((value) => !value)}
          openCassoGame={openCassoGame}
          openContactModal={openContactModal}
        />
        <main>
          <Brands />
          <About openContactModal={openContactModal} />
          <Works
            filter={filter}
            setFilter={setFilter}
            openProject={openProject}
          />
          <Contact openCassoGame={openCassoGame} />
        </main>
      </div>
      <ProjectDrawer
        open={dialog === "project"}
        projectIndex={projectIndex}
        slide={slide}
        setSlide={setSlide}
        closeCaseDrawer={closeDialog}
        switchDrawerProject={switchDrawerProject}
        moveGallerySlide={moveGallerySlide}
      />
      {dialog === "contact" && <ContactModal closeContactModal={closeDialog} />}
      <CassoModal open={dialog === "casso"} closeCassoGame={closeDialog} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
