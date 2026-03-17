import { useCallback, useEffect, useRef, useState } from "react";
import Globe, { flagUrl } from "./Globe";
import config from "../data/siteConfig";

function GlobeSection() {
  const languages = config.languages;
  const [selectedLang, setSelectedLang] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      function(entries) {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return function() { obs.disconnect(); };
  }, []);

  const handleSelect = useCallback(function(lang) {
    setSelectedLang(lang);
  }, []);

  const selBarClass = selectedLang ? "globe-sel-bar show" : "globe-sel-bar";
  const headerClass = visible ? "globe-header reveal visible" : "globe-header reveal";

  return (
    <section className="globe-section" id="globe" ref={sectionRef}>
      <div className="container">
        <div className={headerClass}>
          <span className="section-label">World Coverage</span>
          <h2>
            Pick Your Language,{" "}
            <span className="gradient-text">Explore the World</span>
          </h2>
          <p>Tap any language to spin the globe to that country. Drag the globe to explore freely.</p>
        </div>

        <div className="globe-layout">
          <Globe
            languages={languages}
            selectedLang={selectedLang}
            onSelectLang={handleSelect}
          />

          <div className="globe-right">
            <div className="lang-grid-title">Choose a language to learn</div>
            <div className="lang-chip-grid">
              {languages.map(function(lang) {
                const chipClass = selectedLang && selectedLang.id === lang.id
                  ? "lang-chip active"
                  : "lang-chip";
                return (
                  <div
                    key={lang.id}
                    className={chipClass}
                    onClick={function() { handleSelect(lang); }}
                    title={lang.name}
                  >
                    {lang.hot && <div className="chip-hot">Hot</div>}
                    <div className="chip-flag-wrap">
                      <img
                        src={flagUrl(lang.flagCode)}
                        alt={lang.name}
                        onError={function(e) { e.target.style.display = "none"; }}
                      />
                    </div>
                    <div className="chip-label">{lang.name}</div>
                  </div>
                );
              })}
            </div>

            <div className={selBarClass}>
              {selectedLang && (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                  <img
                    className="sel-flag-img"
                    src={flagUrl(selectedLang.flagCode)}
                    alt={selectedLang.name}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="sel-lang-name">Learning {selectedLang.name}</div>
                    <div className="sel-lang-sub">Ready to start? Download the app!</div>
                  </div>
                  <button
                    onClick={function() { window.open(config.appLinks.appStore); }}
                    className="btn-primary"
                    style={{ padding: "10px 20px", fontSize: "13px", whiteSpace: "nowrap", border: "none", cursor: "pointer" }}
                  >
                    Start
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlobeSection;
