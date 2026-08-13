import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

const API_URL = process.env.REACT_APP_API_URL || "https://api.fluencyo.com/api";

const AUDIENCES = {
  college: {
    label: "Colleges",
    icon: "🎓",
    headline: "Give every student real fluency, not just a certificate",
    points: [
      "Live tutor-led classes + AI practice, bundled into one program",
      "Dedicated CMS dashboard for your placement or language cell",
      "Certification your students can verify and show recruiters",
    ],
  },
  school: {
    label: "Schools",
    icon: "🏫",
    headline: "A safe, structured second-language program your school can trust",
    points: [
      "Curriculum-aligned language tracks for your students",
      "Full visibility for your administration — attendance, progress, results",
      "Hybrid delivery: on-campus faculty or fully online, your call",
    ],
  },
  consultancy: {
    label: "Visa Consultancies",
    icon: "🌍",
    headline: "Get your clients exam-ready, faster",
    points: [
      "Fast-track spoken fluency for visa & immigration interviews",
      "Individual client billing option — they pay, you coordinate",
      "Track every client's readiness from one dashboard",
    ],
  },
};

const STEPS = [
  { n: "01", title: "MOU & Scope", desc: "We agree on languages, student count, and delivery mode — online, offline, or hybrid." },
  { n: "02", title: "Licensed Onboarding", desc: "Your students get access — via central invoice or individual payment, your choice." },
  { n: "03", title: "Live Classes + AI Practice", desc: "Real tutors, real schedules, backed by unlimited AI conversation practice." },
  { n: "04", title: "Certification", desc: "Verified certificates issued within 10 working days of final results." },
];

function InstitutionsLeadForm() {
  const [form, setForm] = useState({ institution_name: "", type: "college", contact_person: "", contact_email: "", contact_phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit = form.institution_name.trim() && form.contact_person.trim() && form.contact_email.trim();

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/b2b/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Could not submit — please try again.");
      }
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Thanks — we've got it</h3>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.7 }}>Our partnerships team will reach out within 1-2 business days to discuss scope and next steps.</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 40 }}>
      <div className="section-label">Partner With Us</div>
      <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>Let's talk scope</h3>
      <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14.5, marginBottom: 28 }}>Tell us a bit about your institution — we'll follow up to shape the right program.</p>

      {error && (
        <div style={{ background: "rgba(255,75,75,.1)", border: "1px solid rgba(255,75,75,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 18, fontSize: 13.5, color: "#FF9B9B", fontWeight: 600 }}>{error}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={fieldLabelStyle}>Institution Name</label>
          <input style={fieldInputStyle} value={form.institution_name} onChange={update("institution_name")} placeholder="Nizam College of Engineering" />
        </div>
        <div>
          <label style={fieldLabelStyle}>Type</label>
          <select style={fieldInputStyle} value={form.type} onChange={update("type")}>
            <option value="college">College</option>
            <option value="school">School</option>
            <option value="consultancy">Visa Consultancy</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={fieldLabelStyle}>Contact Person</label>
          <input style={fieldInputStyle} value={form.contact_person} onChange={update("contact_person")} placeholder="Dr. Suresh Iyer" />
        </div>
        <div>
          <label style={fieldLabelStyle}>Phone</label>
          <input style={fieldInputStyle} value={form.contact_phone} onChange={update("contact_phone")} placeholder="+91 98765 43210" />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={fieldLabelStyle}>Email</label>
        <input style={fieldInputStyle} type="email" value={form.contact_email} onChange={update("contact_email")} placeholder="you@institution.edu" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={fieldLabelStyle}>What are you looking for? (optional)</label>
        <textarea style={{ ...fieldInputStyle, minHeight: 90, resize: "vertical" }} value={form.message} onChange={update("message")} placeholder="e.g. French + German for 140 students, hybrid delivery, starting next month" />
      </div>

      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", opacity: canSubmit ? 1 : 0.6, cursor: canSubmit ? "pointer" : "not-allowed" }} onClick={submit} disabled={!canSubmit || submitting}>
        {submitting ? "Sending…" : "Request a Partnership"}
      </button>
    </div>
  );
}

const fieldLabelStyle = { display: "block", fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 };
const fieldInputStyle = { width: "100%", padding: "13px 16px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#fff", fontSize: 15, fontFamily: "'Nunito',sans-serif", boxSizing: "border-box" };

function Institutions() {
  const [audience, setAudience] = useState("college");
  const formRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".inst-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const current = AUDIENCES[audience];

  return (
    <>
      <Helmet>
        <title>Fluencyo for Institutions — Colleges, Schools & Visa Consultancies</title>
        <meta name="description" content="Bring live-tutor + AI language learning to your college, school, or consultancy. Licensed access, hybrid delivery, verified certification." />
      </Helmet>

      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <main style={{ paddingTop: 140, paddingBottom: 80 }}>
        {/* HERO */}
        <section className="container inst-reveal reveal" style={{ textAlign: "center", marginBottom: 90 }}>
          <div className="hero-badge" style={{ margin: "0 auto 24px" }}>
            <span className="dot" />
            For Institutions
          </div>
          <h1 className="hero-title" style={{ maxWidth: 820, margin: "0 auto 24px" }}>
            Bring live, certified<br /><span className="gradient-text">language learning</span> to your campus
          </h1>
          <p className="hero-subtitle" style={{ margin: "0 auto 40px", textAlign: "center", maxWidth: 600 }}>
            Live tutors, AI conversation practice, and a dedicated dashboard for your institution — for colleges, schools, and visa consultancies across India.
          </p>
          <div className="hero-btns" style={{ justifyContent: "center" }}>
            <button className="btn-primary" onClick={scrollToForm}>Partner With Us</button>
            <a href="#programs" className="btn-secondary">See What's Included</a>
          </div>
        </section>

        {/* AUDIENCE TABS */}
        <section className="container inst-reveal reveal" id="programs" style={{ marginBottom: 100 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
            {Object.entries(AUDIENCES).map(([key, a]) => (
              <button
                key={key}
                onClick={() => setAudience(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 100, fontWeight: 700, fontSize: 14.5,
                  border: audience === key ? "1.5px solid rgba(255,210,76,.5)" : "1px solid rgba(255,255,255,.12)",
                  background: audience === key ? "rgba(255,210,76,.12)" : "rgba(255,255,255,.04)",
                  color: audience === key ? "var(--gold)" : "rgba(255,255,255,.7)",
                  cursor: "pointer", transition: "all .2s",
                }}
              >
                <span>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: 48, maxWidth: 780, margin: "0 auto" }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px", lineHeight: 1.25 }}>{current.headline}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {current.points.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(48,216,138,.15)", border: "1px solid rgba(48,216,138,.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, fontSize: 13, color: "var(--green)" }}>✓</div>
                  <div style={{ fontSize: 15.5, color: "rgba(255,255,255,.8)", lineHeight: 1.6 }}>{p}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container inst-reveal reveal" style={{ marginBottom: 100 }}>
          <div className="hiw-header">
            <div className="section-label" style={{ margin: "0 auto 20px" }}>How It Works</div>
            <h2>From first conversation to <span className="gradient-text">certified students</span></h2>
          </div>
          <div className="hiw-steps">
            {STEPS.map((s, i) => (
              <div key={s.n} className="hiw-step" style={{ position: "relative" }}>
                {i < STEPS.length - 1 && <div className="hiw-connector" />}
                <div className="hiw-step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PARTNER PORTALS */}
        <section className="container inst-reveal reveal" style={{ marginBottom: 100 }}>
          <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
            <div className="section-label" style={{ margin: "0 auto 20px" }}>Already a Partner?</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 14 }}>Jump straight to your portal</h2>
            <p style={{ color: "rgba(255,255,255,.55)", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
              Institutions manage students, billing, and results from the CMS. Students access classes and certificates from their own institution's LMS link.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
              <a href="https://cms.fluencyo.com" target="_blank" rel="noreferrer" className="btn-primary">🏛 Partner CMS Login</a>
              <a href="https://lms.fluencyo.com" target="_blank" rel="noreferrer" className="btn-secondary">🎓 Student LMS Login</a>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,.35)", marginTop: 20 }}>
              Students at partner institutions use their own dedicated LMS link, shared after onboarding.
            </p>
          </div>
        </section>

        {/* LEAD FORM */}
        <section className="container inst-reveal reveal" ref={formRef} style={{ maxWidth: 640, margin: "0 auto" }}>
          <InstitutionsLeadForm />
        </section>
      </main>
    </>
  );
}

export default Institutions;