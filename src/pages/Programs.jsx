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

function TicketCard({ p }) {
  const [g1, g2] = LANG_GRADIENTS[p.language] || ["#4A22CC", "#6B2BE0"];
  const hasDiscount = p.discount_price && p.discount_price < p.full_fee;
  const hasImage = !!p.image_url;

  const bannerStyle = hasImage
    ? { backgroundImage: `url(${p.image_url})` }
    : { background: `linear-gradient(135deg, ${g1}, ${g2})` };

  return (
    <Link to={`/programs/${p.slug}`} className="ticket">
      {hasDiscount && <div className="ticket-stamp">SAVE {Math.round((1 - p.discount_price / p.full_fee) * 100)}%</div>}
      <div className={`ticket-stub-top${hasImage ? " has-image" : ""}`} style={bannerStyle} />
      <div className="ticket-perf" />
      <div className="ticket-body">
        <div className="ticket-info-row">
          <span className="ticket-info-flag">{LANG_FLAGS[p.language] || "🌐"}</span>
          <span className="ticket-info-lang">{p.language}</span>
          {p.level_code && <span className="ticket-info-level">{p.level_code}</span>}
        </div>
        <div className="demo-pill">✓ Demo class available</div>
        <h3>{p.title}</h3>
        <p>{p.short_description}</p>
        <div className="ticket-code">SEAT · {p.slug.toUpperCase()} · {p.duration_weeks} WEEKS</div>
        <div className="ticket-foot">
          <div className="ticket-price"><small>Trial from</small><b>₹{p.trial_fee}</b></div>
          <div className="ticket-go">→</div>
        </div>
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
];

function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/programs`)
      .then((r) => r.json())
      .then((data) => setPrograms(data.programs || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const realCategories = [...new Set(programs.map((p) => p.category))];

  const filtered = programs.filter((p) => {
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    const matchesSearch = !search.trim() ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.language.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
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

        {realCategories.length > 1 && (
          <div className="filters">
            <div className={`filter-stamp${categoryFilter === "All" ? " active" : ""}`} onClick={() => setCategoryFilter("All")}>All</div>
            {realCategories.map((c) => (
              <div key={c} className={`filter-stamp${categoryFilter === c ? " active" : ""}`} onClick={() => setCategoryFilter(c)}>{c}</div>
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
                <div className="ticket-grid">
                  {fluencyoPrograms.map((p) => <TicketCard key={p.id} p={p} />)}
                </div>
              </div>
            )}

            {partnerPrograms.length > 0 && (
              <div className="group">
                <div className="group-head">
                  <h2>Partner Programs</h2>
                  <span className="group-tag tag-partner">Certified by our partners</span>
                </div>
                <div className="ticket-grid">
                  {partnerPrograms.map((p) => <TicketCard key={p.id} p={p} />)}
                </div>
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