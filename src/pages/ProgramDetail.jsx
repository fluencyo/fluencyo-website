import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./Programs.css";

const API_URL = process.env.REACT_APP_API_URL || "https://api.fluencyo.com/api";

const TIME_GROUPS = [
  { label: "Morning", slots: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"] },
  { label: "Afternoon", slots: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"] },
  { label: "Evening", slots: ["7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"] },
];

function getDeliverableMeta(text) {
  const t = text.toLowerCase();
  if (t.includes("lifetime") && t.includes("app")) return { icon: "📱", color: "rgba(48,216,138,.12)", sub: "Free forever access to the learning app" };
  if (t.includes("recording")) return { icon: "🎥", color: "rgba(61,191,255,.12)", sub: "Every session saved to your LMS" };
  if (t.includes("lms")) return { icon: "🖥️", color: "rgba(61,191,255,.12)", sub: "Your own dashboard for schedule & progress" };
  if (t.includes("tutor") || t.includes("trainer")) return { icon: "👤", color: "rgba(255,176,32,.14)", sub: "One trainer for your full program" };
  if (t.includes("partner") && t.includes("certificate")) return { icon: "🏅", color: "rgba(232,121,249,.14)", sub: "Issued directly by our partner institute" };
  if (t.includes("certificate")) return { icon: "📦", color: "rgba(232,121,249,.14)", sub: "Physical copy shipped on completion" };
  if (t.includes("mock test") || t.includes("scoring")) return { icon: "📝", color: "rgba(225,29,72,.1)", sub: "Weekly practice with real scoring" };
  if (t.includes("exam assistance") || t.includes("jlpt") || t.includes("delf") || t.includes("dele")) return { icon: "🎯", color: "rgba(107,43,224,.1)", sub: "Guided prep for your actual exam" };
  return { icon: "✓", color: "rgba(107,43,224,.1)", sub: "Included with your program" };
}

function nextSevenDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function fmtDay(d) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function isoDate(d) {
  return d.toISOString().split("T")[0];
}

function LeadForm({ program, planType, price, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);

  // Demo-only: pick a real date within the next 7 days
  const days = nextSevenDays();
  const [selectedDate, setSelectedDate] = useState(isoDate(days[0]));

  // Full-course-only: weekend or daily
  const [scheduleType, setScheduleType] = useState(null);

  // Shared: a fixed time bucket
  const [selectedTime, setSelectedTime] = useState(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const canSubmit =
    form.name.trim() && form.email.trim() && form.phone.trim() && selectedTime &&
    (planType === "trial" ? !!selectedDate : !!scheduleType);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const leadRes = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          program_id: program.id,
          program_slug: program.slug,
          plan_type: planType,
          preferred_time: selectedTime,
          preferred_date: planType === "trial" ? selectedDate : undefined,
          schedule_type: planType === "full" ? scheduleType : undefined,
        }),
      });
      if (!leadRes.ok) {
        const errData = await leadRes.json().catch(() => ({}));
        throw new Error(errData.error || "Could not save your details");
      }
      const leadData = await leadRes.json();
      const leadId = leadData.leadId;

      const orderRes = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, amount: price }),
      });
      if (!orderRes.ok) throw new Error("Could not start payment");
      const orderData = await orderRes.json();

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "Fluencyo",
        description: `${program.title} — ${planType === "trial" ? "Demo Class" : "Full Program"}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#4A22CC" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                leadId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            if (!verifyRes.ok) throw new Error("Verification failed");
            const verifyData = await verifyRes.json();
            setCredentials({
              email: verifyData.loginEmail || form.email,
              password: verifyData.defaultPassword || "fluencyo@123",
            });
            setDone(true);
          } catch {
            setError("Payment succeeded but verification failed — contact support with your payment ID.");
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="lead-overlay" onClick={onClose}>
      <div className="lead-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lead-close" onClick={onClose}>✕</button>
        {!done ? (
          <>
            <div className="lead-modal-head">
              <span>Passenger Details</span>
              <h3>{planType === "trial" ? "Book Your Demo Class" : "Enroll in " + program.title}</h3>
            </div>
            <div className="lead-body">
              <div className="lead-field"><label>Full Name</label><input value={form.name} onChange={update("name")} placeholder="Your name" /></div>
              <div className="lead-field">
                <label>Email</label>
                <input value={form.email} onChange={update("email")} placeholder="you@example.com" type="email" />
                <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 4, lineHeight: 1.5 }}>
                  This will be your login for the Fluencyo learning portal — double-check it's correct.
                </div>
              </div>
              <div className="lead-field"><label>Phone</label><input value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" /></div>
              <div className="lead-field"><label>Country</label><input value={form.country} onChange={update("country")} placeholder="India" /></div>

              {planType === "trial" ? (
                <>
                  <div className="modal-section-h">Pick a Date (within the next 7 days)</div>
                  <div className="modal-slot-grid">
                    {days.map((d, i) => {
                      const iso = isoDate(d);
                      return (
                        <div key={i} className={`modal-slot${selectedDate === iso ? " selected" : ""}`} onClick={() => setSelectedDate(iso)}>
                          <small>{fmtDay(d).split(",")[0]}</small><b>{fmtDay(d).split(", ")[1]}</b>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-section-h">Weekend or Daily Classes?</div>
                  <div className="modal-slot-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div className={`modal-slot${scheduleType === "weekend" ? " selected" : ""}`} onClick={() => setScheduleType("weekend")}>
                      <b>Weekends</b>
                    </div>
                    <div className={`modal-slot${scheduleType === "daily" ? " selected" : ""}`} onClick={() => setScheduleType("daily")}>
                      <b>Daily</b>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 6, marginBottom: 4 }}>
                    Once confirmed, your schedule can't be changed later — pick what genuinely works for you.
                  </p>
                </>
              )}

              {(planType === "trial" || scheduleType) && (
                <>
                  <div className="modal-section-h">Pick a Time</div>
                  {TIME_GROUPS.map((group) => (
                    <div key={group.label} style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>{group.label}</div>
                      <div className="modal-slot-grid">
                        {group.slots.map((t) => (
                          <div key={t} className={`modal-slot${selectedTime === t ? " selected" : ""}`} onClick={() => setSelectedTime(t)}>
                            <b>{t}</b>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {error && <p style={{ color: "#E11D48", fontSize: 12.5, marginTop: 10 }}>{error}</p>}
              <button className="btn3d btn-violet lead-submit" disabled={!canSubmit || submitting} onClick={submit}>
                {submitting ? "Opening payment…" : `Pay ₹${price}`}
              </button>
            </div>
          </>
        ) : (
          <div className="lead-body lead-success">
            <div className="lead-success-icon">🎉</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, marginBottom: 6 }}>Hurray! You've made a great decision.</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 20 }}>Welcome to Fluencyo — your learning journey starts now. Here's how to get in:</p>
            <div style={{ background: "#F7F5FF", border: "1.5px solid #ECE7F8", borderRadius: 14, padding: "18px 20px", textAlign: "left", marginBottom: 20 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9C93B5", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Login Email</div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#150636", marginBottom: 14 }}>{credentials?.email}</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9C93B5", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>Password</div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#150636", fontFamily: "monospace" }}>{credentials?.password}</div>
              <div style={{ fontSize: 11, color: "#9C93B5", marginTop: 12, lineHeight: 1.5 }}>
                You can change this anytime from the LMS using "Forgot Password."
              </div>
            </div>
            <a href="https://lms.fluencyo.com" className="btn3d btn-violet lead-submit" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
              Continue to LMS →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgramDetail() {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [leadModal, setLeadModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetch(`${API_URL}/programs/${slug}`)
      .then((r) => { if (r.status === 404) { setNotFound(true); return null; } return r.json(); })
      .then((data) => { if (data) setProgram(data.program); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="programs-page"><div className="container programs-empty">Loading…</div></div>;
  if (notFound || !program) return (
    <div className="programs-page"><div className="container programs-empty">Program not found. <Link to="/programs">Back to Programs</Link></div></div>
  );

  const isPartner = program.source_type === "partner";
  const hasDiscount = program.discount_price && program.discount_price < program.full_fee;
  const displayPrice = hasDiscount ? program.discount_price : program.full_fee;

  const scrollToPricing = (e) => {
    e.preventDefault();
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="programs-page">
      <Helmet>
        <title>{program.title} — 1-on-1 {program.language} Coaching | Fluencyo</title>
        <meta name="description" content={program.short_description || `Live 1-on-1 ${program.language} coaching. Book a demo class for ${program.title} today.`} />
        <meta property="og:title" content={`${program.title} — Fluencyo`} />
        <meta property="og:description" content={program.short_description || ""} />
        {program.image_url && <meta property="og:image" content={program.image_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": program.title,
            "description": program.short_description || program.full_description || "",
            "provider": {
              "@type": "Organization",
              "name": program.source_type === "partner" ? (program.partner_name || "Fluencyo") : "Fluencyo",
              "sameAs": "https://fluencyo.com",
            },
            "inLanguage": program.language,
            ...(program.image_url ? { "image": program.image_url } : {}),
            "offers": {
              "@type": "Offer",
              "category": "Paid",
              "price": program.discount_price || program.full_fee,
              "priceCurrency": "INR",
              "url": `https://fluencyo.com/programs/${program.slug}`,
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": "online",
              "courseWorkload": program.duration_weeks ? `P${program.duration_weeks}W` : undefined,
            },
          })}
        </script>
      </Helmet>
      <div className="sticky-bar">
        <div>
          <div className="sticky-bar-title">{program.title}</div>
          <div className="sticky-bar-sub">Trial from ₹{program.trial_fee} · Full program ₹{program.full_fee}</div>
        </div>
        <div className="sticky-bar-actions">
          <button className="btn-3d btn-ghost" onClick={() => setLeadModal({ planType: "trial", price: program.trial_fee })}>Try the Demo</button>
          <button className="btn-3d btn-gold" onClick={() => setLeadModal({ planType: "full", price: displayPrice })}>Enroll Now</button>
        </div>
      </div>

      <div className="hero-wrap">
        <Link to="/programs" className="back-link">← All Programs</Link>

        <div className="hero-photo-frame">
          {program.image_url && <img src={program.image_url} alt={program.title} />}
          <div className="hero-photo-badge"><span className="dot" /> Live 1-on-1 sessions</div>
        </div>

        <div className="info-section">
          <div className="info-tags">
            <div className="info-tag">{program.language}</div>
            {program.level_code && <div className="info-tag">{program.level_code}</div>}
            {isPartner && <div className="info-tag">Certified by {program.partner_name}</div>}
          </div>
          <div className="info-title">{program.title}</div>
          <div className="info-desc">{program.full_description}</div>
          <div className="info-cta-row">
            <a href="#pricing" className="cta-primary" onClick={scrollToPricing}>
              Enroll Now<small>From ₹{displayPrice}</small>
            </a>
            <a href="#pricing" className="cta-ghost" onClick={scrollToPricing}>Try a Demo Class</a>
          </div>
          <div className="stat-bar">
            <div className="stat-cell"><b>{program.duration_weeks} Weeks</b><span>Program Length</span></div>
            <div className="stat-cell"><b>{program.schedule_type_label || "Flexible"}</b><span>Schedule Type</span></div>
            <div className="stat-cell"><b>{program.level_label || "All Levels"}</b><span>Level</span></div>
            <div className="stat-cell"><b>{program.coaching_format_label || "1:1 Live"}</b><span>Coaching Format</span></div>
          </div>
        </div>
      </div>

      <div className="content-wrap">

        {program.description_2 && (
          <div className="section">
            <div className="section-inner">
              <span className="eyebrow">The Full Picture</span>
              <h2>What actually happens in this program</h2>
              <p className="lead">{program.description_2}</p>
            </div>
          </div>
        )}

        {program.benefits && program.benefits.length > 0 && (
          <div className="section">
            <div className="section-inner wide">
              <span className="eyebrow">Why It Works</span>
              <h2>Built around how fluency actually develops</h2>
              <div className="bullet-grid">
                {program.benefits.map((b, i) => (
                  <div className="bullet-item" key={i}>
                    <div className="num">{String(i + 1).padStart(2, "0")}</div>
                    <p>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {program.opportunities && program.opportunities.length > 0 && (
          <div className="section">
            <div className="section-inner wide">
              <span className="eyebrow">Where This Takes You</span>
              <h2>Opportunities this program opens up</h2>
              <div className="bullet-grid">
                {program.opportunities.map((o, i) => (
                  <div className="bullet-item" key={i}>
                    <div className="num">→</div>
                    <p>{o}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {program.includes && program.includes.length > 0 && (
          <div className="section">
            <div className="section-inner wide">
              <span className="eyebrow">Everything Included</span>
              <h2>What you get with this program</h2>
              <div className="includes-grid">
                {program.includes.map((item, i) => {
                  const meta = getDeliverableMeta(item);
                  return (
                    <div className="include-card" key={i}>
                      <div className="include-icon">{meta.icon}</div>
                      <b>{item}</b>
                      <span>{meta.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="section">
          <div className="section-inner wide">
            <span className="eyebrow">Proof You Can Show</span>
            <h2>Your certificate</h2>
            <div className="cert-row">
              <p className="lead" style={{ maxWidth: "none" }}>
                A real, signed certificate — not a generic PDF. Issued in your name on completion, with a verifiable ID, and shipped as a physical copy to your address.
              </p>
              <div className="cert-frame">
                {program.certificate_sample_url ? (
                  <div className="certificate" style={{ padding: 0 }}>
                    <img
                      src={program.certificate_sample_url}
                      alt="Certificate sample"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                  </div>
                ) : (
                  <div className="certificate">
                    <div className="cert-inner">
                      <div className="cert-eyebrow">CERTIFICATE OF COMPLETION</div>
                      <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>This certifies that</div>
                      <div className="cert-name">Your Name Here</div>
                      <div className="cert-sub-text">has successfully completed {program.title} — Fluencyo</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div id="pricing" className="pricing-head">
          <h2>Ready to start?</h2>
          <p>Try a real class first — no risk, no pressure. Upgrade whenever you're ready.</p>
        </div>

        <div className="passes">
          <div className="pass pass-demo">
            <div className="pass-name">Demo Class</div>
            <div className="pass-price-row">
              <span className="pass-price">₹{program.trial_fee}</span>
              <span className="pass-price-unit">one-time</span>
            </div>
            <div className="pass-desc">
              {program.demo_card_description || "Best for anyone who wants to try a real session before committing — meet your tutor, feel the coaching style."}
            </div>
            <div className="pass-features">
              {(program.demo_card_features && program.demo_card_features.length > 0
                ? program.demo_card_features
                : ["One live 1-on-1 session", "Meet a real certified tutor", "Full LMS access for the class", "Zero commitment after"]
              ).map((f, i) => (
                <div key={i} className="pass-feature"><span className="check-circle">✓</span> {f}</div>
              ))}
            </div>
            <button className="pass-btn" onClick={() => setLeadModal({ planType: "trial", price: program.trial_fee })}>
              Book Your Demo →
            </button>
            <div className="pass-note">No card needed for the demo</div>
          </div>

          <div className="pass pass-full">
            <div className="recommended-tag"><span className="star">⭐</span> Recommended</div>
            <div className="pass-name">Full Program</div>
            <div className="pass-price-row">
              <span className="pass-price">₹{displayPrice}</span>
              {hasDiscount && <span className="pass-strike">₹{program.full_fee}</span>}
            </div>
            <div className="pass-desc">
              {program.full_card_description || "Best for learners ready to commit to real, structured progress — everything you need, start to certificate."}
            </div>
            <div className="pass-features">
              {(program.full_card_features && program.full_card_features.length > 0
                ? program.full_card_features
                : [`${program.duration_weeks} weeks of live 1-on-1 coaching`, "Weekly mock tests & feedback", "All class recordings, lifetime app access", "Real, signed certificate on completion"]
              ).map((f, i) => (
                <div key={i} className="pass-feature"><span className="check-circle">✓</span> {f}</div>
              ))}
            </div>
            <button className="pass-btn" onClick={() => setLeadModal({ planType: "full", price: displayPrice })}>
              Enroll Now →
            </button>
            <div className="pass-note">Already did the demo? This upgrades you instantly</div>
          </div>
        </div>

      </div>

      {leadModal && (
        <LeadForm program={program} planType={leadModal.planType} price={leadModal.price} onClose={() => setLeadModal(null)} />
      )}
    </div>
  );
}
export default ProgramDetail;