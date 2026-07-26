import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Programs.css";

const API_URL = process.env.REACT_APP_API_URL || "https://api.fluencyo.com/api";

const LANG_FLAGS = { English: "🇬🇧", French: "🇫🇷", Japanese: "🇯🇵", German: "🇩🇪", Spanish: "🇪🇸", Hindi: "🇮🇳", Chinese: "🇨🇳", Italian: "🇮🇹" };
const LANG_GRADIENTS = {
  English: ["#4A22CC", "#6B2BE0"], French: ["#1C0850", "#4A22CC"], Japanese: ["#E879F9", "#6B2BE0"],
  German: ["#2D0E7A", "#3DBFFF"], Spanish: ["#FF5722", "#8B1FD4"], Hindi: ["#FF8C00", "#6B2BE0"],
  Chinese: ["#E11D48", "#4A22CC"], Italian: ["#30D88A", "#2D0E7A"],
};

function ProgramCarousel({ programs, cardsPerPage = 4 }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(programs.length / cardsPerPage);

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const goTo = (dir) => {
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  return (
    <div className="carousel-wrap">
      <button className="carousel-arrow carousel-arrow-left" onClick={() => goTo(-1)} aria-label="Previous">‹</button>
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${page * 100}%)` }}>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div className="carousel-page" key={pageIndex}>
              {programs.slice(pageIndex * cardsPerPage, pageIndex * cardsPerPage + cardsPerPage).map((p) => (
                <TicketCard key={p.id} p={p} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <button className="carousel-arrow carousel-arrow-right" onClick={() => goTo(1)} aria-label="Next">›</button>
      {totalPages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div key={i} className={`carousel-dot${i === page ? " active" : ""}`} onClick={() => setPage(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
function TicketCard({ p }) {
  const [g1, g2] = LANG_GRADIENTS[p.language] || ["#4A22CC", "#6B2BE0"];
  const hasImage = !!p.image_url;
  const providerName = p.source_type === "partner" ? (p.partner_name || "Partner") : "Fluencyo";

  const bannerStyle = hasImage
    ? { backgroundImage: `url(${p.image_url})` }
    : { background: `linear-gradient(135deg, ${g1}, ${g2})` };

  return (
    <Link to={`/programs/${p.slug}`} className="pcard">
      <div className={`pcard-banner${hasImage ? " has-image" : ""}`} style={bannerStyle} />
      <div className="pcard-body">
        <div className="pcard-provider">{providerName}</div>
        <h3 className="pcard-title">{p.title}</h3>
        <p className="pcard-desc">{p.short_description}</p>
        <div className="pcard-price-row">
          <span className="pcard-demo-label">Demo class from</span>
          <span className="pcard-price">₹{p.trial_fee}</span>
        </div>
        <div className="pcard-cta">View Program <span className="pcard-arrow">→</span></div>
      </div>
    </Link>
  );
}

const CATEGORY_TILES = [
  { key: "Certification Exam", cls: "cat-1", icon: "🎓", title: "Certification Programs", sub: "IELTS, JLPT, DELF, DELE & more — exam-ready, one-on-one." },
  { key: "Corporate Training", cls: "cat-2", icon: "🏢", title: "Corporate Training", sub: "Business & workplace English for teams." },
  { key: "University Partnership", cls: "cat-3", icon: "🏛️", title: "University Partnerships", sub: "Credit-bearing programs with partner institutes." },
  { key: "1:1 Tutoring", cls: "cat-4", icon: "👨‍👩‍👧", title: "1:1 Tutoring", sub: "Daily, weekly, or monthly — for every age." },
  { key: "Courses for NRIs", cls: "cat-5", icon: "🌍", title: "Courses for NRIs", sub: "Language and culture training tailored for NRIs abroad." },
  { key: "General Language Programs", cls: "cat-6", icon: "💬", title: "General Language Programs", sub: "Everyday conversational fluency, at your own pace." },
  { key: "Indian Language Programs", cls: "cat-7", icon: "🇮🇳", title: "Indian Language Programs", sub: "Hindi, Telugu, Tamil, and more — for learners of all backgrounds." },
];

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [fluencyoExpanded, setFluencyoExpanded] = useState(false);
  const [partnerExpanded, setPartnerExpanded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/programs`)
      .then((r) => r.json())
      .then((data) => setPrograms(data.programs || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const realCategories = [...new Set(programs.map((p) => p.category))];
  const realLanguages = [...new Set(programs.map((p) => p.language))];

  const filtered = programs.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesLanguage = languageFilter === "All" || p.language === languageFilter;
    const matchesSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.language.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesLanguage && matchesSearch;
  });

  const fluencyoPrograms = filtered.filter((p) => p.source_type === "fluencyo");
  const partnerPrograms = filtered.filter((p) => p.source_type === "partner");

  return (
    <div className="programs-page">
      <div className="prog-hero">
        <div className="container prog-hero-inner">
          <h1>Learn a language the <em>real way.</em></h1>
          <p>Certification prep, corporate language training, university partnerships, and 1:1 tutoring — all live, all one-on-one, all in one place.</p>

          <div className="prog-search-row">
            <div className="prog-search-big">
              <span>🔍</span>
              <input placeholder="Search programs by name or language…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <a className="btn3d btn-violet prog-signin-big" href="https://lms.fluencyo.com" target="_blank" rel="noreferrer">
              Already a learner? Sign in →
            </a>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="categories">
          <div className="categories-head">
            <h2>What are you here for?</h2>
            <p>Four ways to learn with Fluencyo — pick what fits you.</p>
          </div>
          <div className="cat-grid">
            {CATEGORY_TILES.map((c) => (
              <button
                key={c.key}
                className={`cat-tile ${c.cls}${categoryFilter === c.key ? " selected" : ""}`}
                onClick={() => setCategoryFilter(categoryFilter === c.key ? "All" : c.key)}
              >
                <span className="ic">{c.icon}</span>
                <b>{c.title}</b>
                <span>{c.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {realLanguages.length > 1 && (
          <div className="lang-filter-row">
            <button className={`lang-pill${languageFilter === "All" ? " active" : ""}`} onClick={() => setLanguageFilter("All")}>All Programs</button>
            {realLanguages.map((lang) => (
              <button key={lang} className={`lang-pill${languageFilter === lang ? " active" : ""}`} onClick={() => setLanguageFilter(lang)}>{lang}</button>
            ))}
          </div>
        )}

        {loading && <div className="programs-empty">Loading programs…</div>}
        {error && <div className="programs-empty">Could not load programs right now.</div>}

        {!loading && !error && (
          <>
            {fluencyoPrograms.length > 0 && (
              <div className="group">
                <div className="group-head">
                  <h2>Fluencyo Programs</h2>
                  <span className="group-tag tag-own">Trained by our tutors</span>
                </div>
                {fluencyoExpanded ? (
                  <div className="ticket-grid">
                    {fluencyoPrograms.map((p) => <TicketCard key={p.id} p={p} />)}
                  </div>
                ) : (
                  <ProgramCarousel programs={fluencyoPrograms} />
                )}
                {fluencyoPrograms.length > 4 && (
                  <button className="show-more-btn" onClick={() => setFluencyoExpanded((v) => !v)}>
                    {fluencyoExpanded ? "Show less" : `Show all ${fluencyoPrograms.length} programs →`}
                  </button>
                )}
              </div>
            )}

            {partnerPrograms.length > 0 && (
              <div className="group">
                <div className="group-head">
                  <h2>Partner Programs</h2>
                  <span className="group-tag tag-partner">Certified by our partners</span>
                </div>
                {partnerExpanded ? (
                  <div className="ticket-grid">
                    {partnerPrograms.map((p) => <TicketCard key={p.id} p={p} />)}
                  </div>
                ) : (
                  <ProgramCarousel programs={partnerPrograms} />
                )}
                {partnerPrograms.length > 4 && (
                  <button className="show-more-btn" onClick={() => setPartnerExpanded((v) => !v)}>
                    {partnerExpanded ? "Show less" : `Show all ${partnerPrograms.length} programs →`}
                  </button>
                )}
              </div>
            )}

            {filtered.length === 0 && <div className="programs-empty">No programs match right now — try a different filter.</div>}
          </>
        )}
      </div>
    </div>
  );
}
export default Programs;