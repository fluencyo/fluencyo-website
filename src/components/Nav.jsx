import { useState, useEffect } from "react";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <div className="container">
          <div className="nav-inner">
            <a href="/" className="nav-logo">
              <span className="nav-logo-text">Fluencyo</span>
            </a>
            <div className="nav-links">
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo("features"); }}>Features</a>
              <a href="#languages" onClick={(e) => { e.preventDefault(); scrollTo("languages"); }}>Languages</a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>How it Works</a>
            </div>
            <div className="nav-cta">
              <a href="#download" className="nav-download-btn" onClick={(e) => { e.preventDefault(); scrollTo("download"); }}>
                Download the App
              </a>
            </div>
            <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo("features"); }}>Features</a>
        <a href="#languages" onClick={(e) => { e.preventDefault(); scrollTo("languages"); }}>Languages</a>
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>How it Works</a>
        <a href="#download" onClick={(e) => { e.preventDefault(); scrollTo("download"); }}>Download App</a>
      </div>
    </>
  );
}

export default Nav;
