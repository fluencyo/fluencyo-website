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
  french: {
    label: "French", flag: "🇫🇷", tagline: "The language of diplomacy, EU careers & global mobility", accent: "cyan",
    why: "French is an official language in 29 countries and a core requirement for EU institutions, UN roles, and Canadian immigration points.",
    stats: [{ v: "29", l: "Countries" }, { v: "2nd", l: "Most-Taught Globally" }, { v: "🇨🇦", l: "Canada PR Boost" }],
    whoFor: ["Students targeting Canada PR — French fluency adds real immigration points", "Commerce & international relations students", "Hospitality & tourism aspirants eyeing French-speaking markets"],
    levels: EUROPEAN_LEVELS,
  },
  spanish: {
    label: "Spanish", flag: "🇪🇸", tagline: "500M+ speakers, the fastest-growing business language", accent: "orange",
    why: "Spanish is the world's 2nd most-spoken native language and the most requested second language in US and LATAM business roles.",
    stats: [{ v: "500M+", l: "Native Speakers" }, { v: "2nd", l: "Most Spoken Globally" }, { v: "20+", l: "Countries" }],
    whoFor: ["Business & commerce students eyeing LATAM/US-Hispanic markets", "Customer support & BPO career aspirants", "Anyone wanting the highest-ROI second language globally"],
    levels: EUROPEAN_LEVELS,
  },
  german: {
    label: "German", flag: "🇩🇪", tagline: "Europe's engineering powerhouse — and mostly tuition-free Master's", accent: "green",
    why: "Germany runs Europe's largest economy and hundreds of public universities offer tuition-free Master's programs.",
    stats: [{ v: "400+", l: "Tuition-Free Universities" }, { v: "#1", l: "Europe's Economy" }, { v: "High", l: "Engineering Demand" }],
    whoFor: ["Engineering & STEM students planning an MS in Germany", "Anyone targeting Bosch, Siemens, VW, or similar German employers", "Students seeking tuition-free European education"],
    levels: EUROPEAN_LEVELS,
  },
  japanese: {
    label: "Japanese", flag: "🇯🇵", tagline: "JLPT-certified fluency for Japan's tech & manufacturing boom", accent: "pink",
    why: "Japan's aging workforce is actively recruiting skilled foreign talent, and most corporate roles require JLPT certification.",
    stats: [{ v: "125M", l: "Speakers" }, { v: "JLPT", l: "Corporate Standard" }, { v: "🇯🇵", l: "Aging Workforce = Opportunity" }],
    whoFor: ["Engineering & CS students eyeing Japan's tech sector", "Anyone pursuing JLPT for corporate sponsorship", "Students drawn to Japanese business culture & innovation"],
    levels: { N5: { price: 2000, duration: 35 }, N4: { price: 3500, duration: 50 }, N3: { price: 5000, duration: 65 } },
  },
  mandarin: {
    label: "Mandarin Chinese", flag: "🇨🇳", tagline: "The world's most-spoken language, essential for global trade", accent: "gold",
    why: "Mandarin is critical for international trade, supply chain, and manufacturing careers given China's role in global commerce.",
    stats: [{ v: "1.1B+", l: "Speakers Worldwide" }, { v: "#1", l: "Most Spoken Language" }, { v: "Global", l: "Trade Standard" }],
    whoFor: ["International business & trade students", "Import-export and supply chain career aspirants", "Anyone working with China-linked manufacturing or sourcing"],
    levels: { HSK1: { price: 5000, duration: 35 }, HSK2: { price: 7000, duration: 50 } },
  },
  arabic: {
    label: "Arabic", flag: "🇸🇦", tagline: "Your gateway to the booming Gulf job market", accent: "purple",
    why: "The UAE, Saudi Arabia, and Qatar host millions of Indian professionals across construction, hospitality, aviation, and business.",
    stats: [{ v: "22", l: "Countries" }, { v: "Gulf", l: "Job Market Boom" }, { v: "High", l: "NRI Workforce Demand" }],
    whoFor: ["Anyone targeting UAE, Saudi, or Qatar employment", "Hospitality & aviation career aspirants", "Business students pursuing Middle East trade"],
    custom: true,
  },
  korean: {
    label: "Korean", flag: "🇰🇷", tagline: "Ride the Korean Wave — culturally and professionally", accent: "cyan",
    why: "Beyond K-pop and K-dramas, Korea is home to Samsung, LG, and Hyundai — global tech and manufacturing leaders.",
    stats: [{ v: "K-Wave", l: "Global Cultural Reach" }, { v: "3", l: "Fortune 500 HQs" }, { v: "TOPIK", l: "Certification Standard" }],
    whoFor: ["Students interested in Korean tech companies", "K-culture enthusiasts wanting real fluency", "Anyone pursuing study-abroad programs in Korea"],
    custom: true,
  },
};
const OFFLINE_FLAT_RATE = 5000;

const ACCENTS = {
  cyan: { color: "var(--cyan)", bg: "rgba(61,191,255,.14)", border: "rgba(61,191,255,.35)" },
  orange: { color: "var(--orange)", bg: "rgba(255,87,34,.14)", border: "rgba(255,87,34,.35)" },
  green: { color: "var(--green)", bg: "rgba(48,216,138,.14)", border: "rgba(48,216,138,.35)" },
  pink: { color: "var(--pink)", bg: "rgba(232,121,249,.14)", border: "rgba(232,121,249,.35)" },
  gold: { color: "var(--gold)", bg: "rgba(255,210,76,.14)", border: "rgba(255,210,76,.35)" },
  purple: { color: "var(--purple-vivid)", bg: "rgba(107,43,224,.18)", border: "rgba(107,43,224,.4)" },
};

const FEATURE_ICON_CLASSES = ["fi-purple", "fi-gold", "fi-green", "fi-cyan", "fi-orange", "fi-pink"];

const PROGRAM_INCLUDES = [
  { icon: "🎥", label: "Live tutor-led sessions" },
  { icon: "🤖", label: "Unlimited AI practice with Fluto" },
  { icon: "📊", label: "Dedicated CMS dashboard for your institution" },
  { icon: "📱", label: "Full LMS access for every student" },
  { icon: "🏅", label: "Verified, checkable certification" },
  { icon: "📼", label: "Recorded sessions for revision" },
];

function ProgramsShowcase({ onConfigure }) {
  const [active, setActive] = useState("french");
  const p = LANGUAGES_CONFIG[active];
  const acc = ACCENTS[p.accent];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
        {Object.entries(LANGUAGES_CONFIG).map(([key, l]) => {
          const a = ACCENTS[l.accent];
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 22px", borderRadius: 100, fontWeight: 700, fontSize: 14,
                border: isActive ? `1.5px solid ${a.border}` : "1px solid rgba(255,255,255,.12)",
                background: isActive ? a.bg : "rgba(255,255,255,.04)",
                color: isActive ? a.color : "rgba(255,255,255,.7)",
                cursor: "pointer", transition: "all .2s",
                transform: isActive ? "translateY(-2px)" : "none",
                boxShadow: isActive ? `0 8px 24px ${a.bg}` : "none",
              }}
            >
              <span style={{ fontSize: 17 }}>{l.flag}</span>{l.label}
            </button>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: "hidden", position: "relative", borderColor: acc.border }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${acc.bg}, transparent 70%)`, top: -160, right: -140, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${acc.color}, transparent)` }} />

        {/* HEADER */}
        <div style={{ padding: "40px 44px 0", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <div style={{ width: 76, height: 76, borderRadius: 22, background: acc.bg, border: `1.5px solid ${acc.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, flexShrink: 0, boxShadow: `0 8px 28px ${acc.bg}` }}>{p.flag}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: acc.color, marginBottom: 4 }}>Program Spotlight</div>
              <h3 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1.1 }}>{p.label} for Institutions</h3>
            </div>
          </div>
          <p style={{ fontSize: 16.5, fontWeight: 700, color: acc.color, marginBottom: 20 }}>{p.tagline}</p>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,.6)", lineHeight: 1.8, marginBottom: 28, maxWidth: 680 }}>{p.why}</p>

          {/* STAT ROW */}
          <div style={{ display: "flex", gap: 36, marginBottom: 32, flexWrap: "wrap" }}>
            {p.stats.map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 28, fontWeight: 900, background: `linear-gradient(135deg, #fff, ${acc.color})`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.45)", fontWeight: 700, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

        {/* WHO + INCLUDES */}
        <div style={{ padding: "32px 44px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, position: "relative" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 18 }}>Who Should Take This</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {p.whoFor.map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 16px" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: acc.bg, border: `1px solid ${acc.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: acc.color, fontWeight: 900 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", lineHeight: 1.5, fontWeight: 600 }}>{w}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="section-label" style={{ marginBottom: 18 }}>Every Program Includes</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {PROGRAM_INCLUDES.map((inc, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 12px" }}>
                  <div className={`feature-icon ${FEATURE_ICON_CLASSES[i % FEATURE_ICON_CLASSES.length]}`} style={{ width: 34, height: 34, borderRadius: 10, fontSize: 15, marginBottom: 8 }}>{inc.icon}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,.75)", fontWeight: 700, lineHeight: 1.35 }}>{inc.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,.08)" }} />

        {/* PRICING */}
        <div style={{ padding: "32px 44px 40px", position: "relative" }}>
          {p.custom ? (
            <div style={{ background: acc.bg, border: `1px solid ${acc.border}`, borderRadius: 16, padding: 32, textAlign: "center" }}>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,.85)", marginBottom: 18, fontWeight: 700 }}>{p.label} pricing is tailored per institution — let's talk scope.</p>
              <a href="#lead-form" className="btn-primary" style={{ display: "inline-flex" }}>Get a Custom Quote</a>
            </div>
          ) : (
            <>
              <div className="section-label" style={{ marginBottom: 18 }}>Levels, Duration & Pricing</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 28 }}>
                {Object.entries(p.levels).map(([lvl, info], i) => (
                  <div
                    key={lvl}
                    style={{
                      background: i === 0 ? acc.bg : "rgba(255,255,255,.04)",
                      border: i === 0 ? `1.5px solid ${acc.border}` : "1px solid rgba(255,255,255,.1)",
                      borderRadius: 18, padding: "22px 16px", textAlign: "center", position: "relative",
                      transition: "transform .2s",
                    }}
                  >
                    {i === 0 && (
                      <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: acc.color, color: "#1A1033", fontSize: 9, fontWeight: 900, padding: "4px 12px", borderRadius: 100, whiteSpace: "nowrap", letterSpacing: "0.03em" }}>
                        ★ MOST POPULAR START
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 10 }}>
                      {Object.keys(p.levels).map((_, dotI) => (
                        <div key={dotI} style={{ width: 5, height: 5, borderRadius: "50%", background: dotI <= i ? acc.color : "rgba(255,255,255,.15)" }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 21, fontWeight: 900, marginBottom: 4 }}>{lvl}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", marginBottom: 14, fontWeight: 600 }}>{info.duration} days</div>
                    <div style={{ fontSize: 24, fontWeight: 900 }} className="gradient-text">₹{info.price.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", fontWeight: 600 }}>per student</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <button className="btn-primary" onClick={() => onConfigure(active)}>Configure This Program →</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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

function ProgramCalculator({ initialLanguage = "french" }) {
  const [language, setLanguage] = useState(initialLanguage);
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

const FAQS = [
  { q: "How is pricing calculated for larger batches?", a: "Rates shown are per-student for standard batch sizes. For 100+ students, or multi-language/multi-year commitments, we offer custom negotiated pricing — use the calculator to get a baseline, then contact us for volume rates." },
  { q: "What's the difference between online and offline delivery?", a: "Online is fully remote via our live-class platform, minimum 40 students, priced per level. Offline means our tutors come to your campus, flat ₹5,000/student regardless of language or level, minimum 50 students." },
  { q: "Do we need to sign an MOU before paying?", a: "Not necessarily — you can reserve and pay for standard programs directly through the calculator above. For customized scope (larger volumes, mixed delivery modes, non-standard levels), we'll draft an MOU first." },
  { q: "How quickly do students get LMS access after payment?", a: "Automatically, usually within minutes of payment confirmation — but only once we have their names/emails from you. Share your student list right after paying and we'll get credentials out within 24 hours." },
  { q: "Can individual students pay instead of the institution paying centrally?", a: "Yes. Ask your account manager to set this up — each student gets their own secure payment link and activates independently." },
  { q: "What happens if we have fewer students than the minimum threshold?", a: "Smaller batches are still possible — reach out via the contact form and we'll work out custom pricing for your actual headcount." },
  { q: "How are exams and certificates handled?", a: "Exams are conducted at the end of each level. Results publish within 5 days, and verified certificates are issued within 10 working days of results — visible in both your CMS and each student's LMS." },
  { q: "Who do we contact for support after signing up?", a: "You'll get a dedicated account manager, plus direct email support at partners@fluencyo.com for anything partnership-related." },
];

function InstitutionsFaq() {
  const [open, setOpen] = useState(null);
  return (
    <section className="container inst-reveal reveal" style={{ maxWidth: 780, margin: "0 auto 100px" }}>
      <div className="hiw-header">
        <div className="section-label" style={{ margin: "0 auto 20px" }}>FAQs</div>
        <h2>Questions institutions <span className="gradient-text">actually ask</span></h2>
      </div>
      <div className="glass-card" style={{ padding: 8 }}>
        {FAQS.map((f, i) => (
          <div
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            style={{ padding: "20px 24px", borderBottom: i < FAQS.length - 1 ? "1px solid rgba(255,255,255,.08)" : "none", cursor: "pointer" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700, fontSize: 15.5 }}>
              {f.q}
              <span style={{ color: "var(--gold)", fontSize: 20, transform: open === i ? "rotate(45deg)" : "none", transition: ".2s", flexShrink: 0, marginLeft: 16 }}>+</span>
            </div>
            {open === i && <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)", marginTop: 12, lineHeight: 1.75 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Institutions() {
  const [audience, setAudience] = useState("college");
  const [calcLanguage, setCalcLanguage] = useState("french");
  const formRef = useRef(null);
  const calcRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".inst-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const handleConfigure = (langKey) => {
    setCalcLanguage(langKey);
    calcRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
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

        {/* PROGRAMS SHOWCASE */}
        <section className="container inst-reveal reveal" style={{ marginBottom: 100 }}>
          <div className="hiw-header">
            <div className="section-label" style={{ margin: "0 auto 20px" }}>Programs</div>
            <h2>A program for <span className="gradient-text">every language, every goal</span></h2>
            <p>Explore what each language offers, who it's built for, and exactly what your students get.</p>
          </div>
          <ProgramsShowcase onConfigure={handleConfigure} />
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

        {/* CALCULATOR */}
        <section className="container inst-reveal reveal" ref={calcRef} style={{ maxWidth: 640, margin: "0 auto 100px" }}>
          <ProgramCalculator key={calcLanguage} initialLanguage={calcLanguage} />
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
        <section className="container inst-reveal reveal" ref={formRef} id="lead-form" style={{ maxWidth: 640, margin: "0 auto 100px" }}>
          <InstitutionsLeadForm />
        </section>

        {/* FAQ */}
        <InstitutionsFaq />
      </main>
    </>
  );
}

export default Institutions;