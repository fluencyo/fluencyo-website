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
  { n: "01", title: "Initial Consultation", desc: "Tell us your languages, student count, and delivery mode — we shape a program around your institution." },
  { n: "02", title: "MOU & Scope Sign-off", desc: "A formal agreement covering languages, batch size, and commercial terms." },
  { n: "03", title: "Licensed Seats & Payment", desc: "Pay instantly below for standard programs, or receive an invoice from our team for bank transfer." },
  { n: "04", title: "Student Onboarding", desc: "Share your student list — each one gets LMS credentials within 24 hours of payment confirmation." },
  { n: "05", title: "Tutor & Schedule Assignment", desc: "A dedicated tutor is assigned and your batch calendar is locked in." },
  { n: "06", title: "Live Classes + AI Practice", desc: "Students attend live sessions and get unlimited AI conversation practice with Fluto between classes." },
  { n: "07", title: "Assessment", desc: "Exams are conducted; results are published within 5 days." },
  { n: "08", title: "Certification", desc: "Verified, checkable certificates issued within 10 working days of results." },
];

// Fixed rate card, mirrored on the backend as the actual source of truth --
// this copy is only for display/estimate; the real charge is computed
// server-side so a tampered client value can never under-pay.
const EUROPEAN_LEVELS = {
  A1: { price: 1000, duration: 30 },
  A2: { price: 1500, duration: 40 },
  B1: { price: 3000, duration: 55 },
  B2: { price: 5000, duration: 75 },
};
const LANGUAGES_CONFIG = {
  french: { label: "French", flag: "🇫🇷", levels: EUROPEAN_LEVELS },
  spanish: { label: "Spanish", flag: "🇪🇸", levels: EUROPEAN_LEVELS },
  german: { label: "German", flag: "🇩🇪", levels: EUROPEAN_LEVELS },
  japanese: { label: "Japanese", flag: "🇯🇵", levels: { N5: { price: 2000, duration: 35 }, N4: { price: 3500, duration: 50 }, N3: { price: 5000, duration: 65 } } },
  mandarin: { label: "Mandarin Chinese", flag: "🇨🇳", levels: { HSK1: { price: 5000, duration: 35 }, HSK2: { price: 7000, duration: 50 } } },
  arabic: { label: "Arabic", flag: "🇸🇦", custom: true },
  korean: { label: "Korean", flag: "🇰🇷", custom: true },
};
const OFFLINE_FLAT_RATE = 5000;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ProgramCalculator() {
  const [language, setLanguage] = useState("french");
  const [level, setLevel] = useState("A1");
  const [mode, setMode] = useState("online");
  const [count, setCount] = useState(40);
  const [details, setDetails] = useState({ institution_name: "", type: "college", contact_person: "", contact_email: "", contact_phone: "" });
  const [showDetails, setShowDetails] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const config = LANGUAGES_CONFIG[language];
  const isCustom = config.custom;
  const levelKeys = isCustom ? [] : Object.keys(config.levels);

  useEffect(() => {
    if (!isCustom && !config.levels[level]) setLevel(levelKeys[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const levelInfo = !isCustom ? config.levels[level] : null;
  const ratePerStudent = isCustom ? null : mode === "offline" ? OFFLINE_FLAT_RATE : levelInfo?.price;
  const total = ratePerStudent ? ratePerStudent * count : null;
  const minThreshold = mode === "online" ? 40 : 50;
  const belowMin = count < minThreshold;

  const detailsValid = details.institution_name.trim() && details.contact_person.trim() && details.contact_email.trim();

  async function handlePay() {
    if (!detailsValid) return;
    setError("");
    const ok = await loadRazorpayScript();
    if (!ok) { setError("Could not load payment gateway — check your connection."); return; }

    setPaying(true);
    try {
      const orderRes = await fetch(`${API_URL}/b2b/selfserve/quote-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, language, level, delivery_mode: mode, student_count: count }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not create order");

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Fluencyo",
        description: `${config.label} ${level} — ${count} students (${mode})`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/b2b/selfserve/quote-verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                licenseId: orderData.licenseId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Verification failed");
            setSuccess(true);
          } catch {
            setError("Payment captured but verification failed — contact partners@fluencyo.com with your payment ID.");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#6B2BE0" },
      });
      rzp.on("payment.failed", () => { setError("Payment failed — please try again."); setPaying(false); });
      rzp.open();
    } catch (e) {
      setError(e.message || "Could not start payment.");
      setPaying(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card" style={{ padding: 48, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Payment confirmed — you're in</h3>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: 15, lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
          Your {count} seats for {config.label} {level} are reserved. Our team will reach out within 24 hours to collect your student list and get credentials generated.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: 40 }}>
      <div className="section-label">Program Calculator</div>
      <h3 style={{ fontSize: 26, fontWeight: 800, marginBottom: 28, letterSpacing: "-0.5px" }}>Configure your program</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={fieldLabelStyle}>Language</label>
          <select style={fieldInputStyle} value={language} onChange={(e) => setLanguage(e.target.value)}>
            {Object.entries(LANGUAGES_CONFIG).map(([key, l]) => <option key={key} value={key}>{l.flag} {l.label}</option>)}
          </select>
        </div>
        <div>
          <label style={fieldLabelStyle}>Delivery Mode</label>
          <select style={fieldInputStyle} value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="online">Online</option>
            <option value="offline">Offline (on-campus)</option>
          </select>
        </div>
      </div>

      {isCustom ? (
        <div style={{ background: "rgba(255,210,76,.08)", border: "1px solid rgba(255,210,76,.25)", borderRadius: 14, padding: 24, textAlign: "center", marginBottom: 8 }}>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.75)", marginBottom: 14 }}>{config.label} pricing is custom — talk to our team for a quote.</p>
          <a href="#lead-form" className="btn-secondary" style={{ display: "inline-flex" }}>Contact Us Instead</a>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={fieldLabelStyle}>Level</label>
              <select style={fieldInputStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
                {levelKeys.map((lv) => <option key={lv} value={lv}>{lv} — {config.levels[lv].duration} days</option>)}
              </select>
            </div>
            <div>
              <label style={fieldLabelStyle}>Number of Students</label>
              <input type="number" min={1} style={fieldInputStyle} value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} />
            </div>
          </div>

          {belowMin && (
            <div style={{ background: "rgba(255,210,76,.08)", border: "1px solid rgba(255,210,76,.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>
              Recommended minimum for {mode} is {minThreshold} students. Smaller batches are still possible — contact us to negotiate.
            </div>
          )}

          <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(255,255,255,.55)", marginBottom: 8 }}>
              <span>Rate per student</span><span>₹{ratePerStudent?.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "rgba(255,255,255,.55)", marginBottom: 14 }}>
              <span>Students</span><span>× {count}</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,.1)", marginBottom: 14 }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 900 }}>
              <span>Total</span><span className="gradient-text">₹{total?.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.4)", marginTop: 8 }}>Program duration: {levelInfo?.duration} days · Negotiable for 100+ students</div>
          </div>

          {!showDetails ? (
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setShowDetails(true)}>Reserve & Pay Now</button>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={fieldLabelStyle}>Institution Name</label>
                  <input style={fieldInputStyle} value={details.institution_name} onChange={(e) => setDetails((d) => ({ ...d, institution_name: e.target.value }))} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Type</label>
                  <select style={fieldInputStyle} value={details.type} onChange={(e) => setDetails((d) => ({ ...d, type: e.target.value }))}>
                    <option value="college">College</option><option value="school">School</option><option value="consultancy">Visa Consultancy</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={fieldLabelStyle}>Contact Person</label>
                  <input style={fieldInputStyle} value={details.contact_person} onChange={(e) => setDetails((d) => ({ ...d, contact_person: e.target.value }))} />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Phone</label>
                  <input style={fieldInputStyle} value={details.contact_phone} onChange={(e) => setDetails((d) => ({ ...d, contact_phone: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={fieldLabelStyle}>Email</label>
                <input type="email" style={fieldInputStyle} value={details.contact_email} onChange={(e) => setDetails((d) => ({ ...d, contact_email: e.target.value }))} />
              </div>
              {error && <div style={{ background: "rgba(255,75,75,.1)", border: "1px solid rgba(255,75,75,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 13.5, color: "#FF9B9B", fontWeight: 600 }}>{error}</div>}
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", opacity: detailsValid ? 1 : 0.6, cursor: detailsValid ? "pointer" : "not-allowed" }} onClick={handlePay} disabled={!detailsValid || paying}>
                {paying ? "Processing…" : `Pay ₹${total?.toLocaleString("en-IN")} Now`}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

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
            <div className="section-label" style={{ margin: "0 auto 20px" }}>Full Process — Prospect to Certification</div>
            <h2>From first conversation to <span className="gradient-text">certified students</span></h2>
          </div>
          <div className="hiw-steps" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="hiw-step" style={{ position: "relative" }}>
                {(i + 1) % 4 !== 0 && <div className="hiw-connector" />}
                <div className="hiw-step-num">{s.n}</div>
                <h3 style={{ fontSize: 17 }}>{s.title}</h3>
                <p style={{ fontSize: 13.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING TABLE */}
        <section className="container inst-reveal reveal" style={{ marginBottom: 60 }}>
          <div className="hiw-header">
            <div className="section-label" style={{ margin: "0 auto 20px" }}>Pricing</div>
            <h2>Clear rates, <span className="gradient-text">level by level</span></h2>
            <p>Online batches: minimum 40 students · Offline batches: minimum 50 students · Negotiable for larger volumes</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {Object.entries(LANGUAGES_CONFIG).map(([key, l]) => (
              <div key={key} className="glass-card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <span style={{ fontSize: 26 }}>{l.flag}</span>
                  <span style={{ fontWeight: 800, fontSize: 17 }}>{l.label}</span>
                </div>
                {l.custom ? (
                  <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.5)", padding: "16px 0" }}>Custom pricing — <a href="#lead-form" style={{ color: "var(--cyan)" }}>contact us</a></div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {Object.entries(l.levels).map(([lvl, info]) => (
                      <div key={lvl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13.5 }}>
                        <span style={{ fontWeight: 700, color: "rgba(255,255,255,.8)" }}>{lvl}</span>
                        <span style={{ color: "rgba(255,255,255,.45)" }}>{info.duration}d</span>
                        <span style={{ fontWeight: 800, color: "var(--gold)" }}>₹{info.price.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,.4)", marginTop: 24 }}>
            Offline (on-campus) delivery: flat ₹5,000/student across all languages and levels, minimum 50 students.
          </p>
        </section>

        {/* CALCULATOR */}
        <section className="container inst-reveal reveal" style={{ maxWidth: 640, margin: "0 auto 100px" }}>
          <ProgramCalculator />
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
        <section className="container inst-reveal reveal" ref={formRef} id="lead-form" style={{ maxWidth: 640, margin: "0 auto" }}>
          <InstitutionsLeadForm />
        </section>
      </main>
    </>
  );
}

export default Institutions;