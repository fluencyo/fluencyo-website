import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (!isHome) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navSolid = scrolled || !isHome;

  return (
    <>
      <nav id="nav" className={navSolid ? "scrolled" : ""}>
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo">
              <span className="nav-logo-text">Fluencyo</span>
            </Link>
            <div className="nav-links">
              <a href={isHome ? "#features" : "/#features"} onClick={(e) => { if (isHome) { e.preventDefault(); scrollTo("features"); } }}>Features</a>
              <a href={isHome ? "#languages" : "/#languages"} onClick={(e) => { if (isHome) { e.preventDefault(); scrollTo("languages"); } }}>Languages</a>
              <a href={isHome ? "#about" : "/#about"} onClick={(e) => { if (isHome) { e.preventDefault(); scrollTo("about"); } }}>How it Works</a>
              <Link to="/programs">Programs</Link>
            </div>
            <div className="nav-cta">
              <Link to="/programs" className="nav-download-btn">
                Book a Class
              </Link>
            </div>
            <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        <a href={isHome ? "#features" : "/#features"} onClick={(e) => { if (isHome) { e.preventDefault(); scrollTo("features"); } else setMobileOpen(false); }}>Features</a>
        <a href={isHome ? "#languages" : "/#languages"} onClick={(e) => { if (isHome) { e.preventDefault(); scrollTo("languages"); } else setMobileOpen(false); }}>Languages</a>
        <a href={isHome ? "#about" : "/#about"} onClick={(e) => { if (isHome) { e.preventDefault(); scrollTo("about"); } else setMobileOpen(false); }}>How it Works</a>
        <Link to="/programs" onClick={() => setMobileOpen(false)}>Programs</Link>
        <Link to="/programs" onClick={() => setMobileOpen(false)}>Book a Class</Link>
      </div>
    </>
  );
}
export default Nav;