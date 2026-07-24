import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Programs.css";

const API_URL = process.env.REACT_APP_API_URL || "https://api.fluencyo.com/api";

const SAMPLE_SLOTS = [
  { day: "Mon", time: "6:00 PM" }, { day: "Mon", time: "8:00 PM" }, { day: "Wed", time: "7:00 PM" },
  { day: "Thu", time: "6:30 PM" }, { day: "Sat", time: "11:00 AM" }, { day: "Sat", time: "4:00 PM" },
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

function LeadForm({ program, planType, price, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "" });
  const [slot, setSlot] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const canSubmit = form.name.trim() && form.email.trim() && form.phone.trim();

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      // Step 1: create the lead, same as before
      const leadRes = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          program_id: program.id,
          program_slug: program.slug,
          plan_type: planType,
          selected_slot: `${SAMPLE_SLOTS[slot].day} ${SAMPLE_SLOTS[slot].time}`,
        }),
      });
      if (!leadRes.ok) throw new Error("Could not save your details");
      const leadData = await leadRes.json();
      const leadId = leadData.leadId;

      // Step 2: create a real Razorpay order for this lead
      const orderRes = await fetch(`${API_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, amount: price }),
      });
      if (!orderRes.ok) throw new Error("Could not start payment");
      const orderData = await orderRes.json();

      // Step 3: open Razorpay's real checkout popup
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
            setDone(true);
          } catch {
            setError("Payment succeeded but verification failed — contact support with your payment ID.");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
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
              <div className="lead-field"><label>Email</label><input value={form.email} onChange={update("email")} placeholder="you@example.com" type="email" /></div>
              <div className="lead-field"><label>Phone</label><input value={form.phone} onChange={update("phone")} placeholder="+91 98765 43210" /></div>
              <div className="lead-field"><label>Country</label><input value={form.country} onChange={update("country")} placeholder="India" /></div>

              <div className="modal-section-h">Pick a Departure Time</div>
              <div className="modal-slot-grid">
                {SAMPLE_SLOTS.map((s, i) => (
                  <div key={i} className={`modal-slot${slot === i ? " selected" : ""}`} onClick={() => setSlot(i)}>
                    <small>{s.day}</small><b>{s.time}</b>
                  </div>
                ))}
              </div>

              {error && <p style={{ color: "#E11D48", fontSize: 12.5, marginTop: 10 }}>{error}</p>}
              <button className="btn3d btn-violet lead-submit" disabled={!canSubmit || submitting} onClick={submit}>
                {submitting ? "Opening payment…" : `Pay ₹${price}`}
              </button>
            </div>
          </>
        ) : (
          <div className="lead-body lead-success">
            <div className="lead-success-icon">🎉</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 900, marginBottom: 8 }}>Payment successful!</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 16 }}>Check your email — we've sent your welcome message with a link to set up your Fluencyo account.</p>
            <button className="btn3d btn-violet lead-submit" onClick={onClose}>Done</button>
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

  return (
    <div className="programs-page">
      <div className="container detail-wrap">
        <Link to="/programs" className="pd-back">← All Programs</Link>

        <div className="journey-card">
          <div className="journey-top">
            <div className="journey-tags">
              <div className="journey-tag">{program.language}</div>
              {program.level_code && <div className="journey-tag">{program.level_code}</div>}
              {isPartner && <div className="journey-tag">Certified by {program.partner_name}</div>}
            </div>
            <div className="journey-code">TICKET · {program.slug.toUpperCase()}</div>
          </div>
          <div className="journey-route">
            <div className="journey-pt"><small>Language</small><b>{program.language}</b></div>
            <div className="journey-line"><div className="dash" /><span>✈</span></div>
            <div className="journey-pt" style={{ textAlign: "right" }}><small>Certify</small><b>{program.level_code || "Completion"}</b></div>
          </div>
          <div className="journey-title">{program.title}</div>
          <div className="journey-desc">{program.full_description}</div>
        </div>

        <div className="deliverables-cert-grid">
          <div className="deliverables-col">
            <h3>What You Get</h3>
            <div className="deliverables-grid">
              {(program.includes || []).map((item, i) => {
                const meta = getDeliverableMeta(item);
                return (
                  <div className="deliverable-card" key={i}>
                    <div className="deliverable-icon" style={{ background: meta.color }}>{meta.icon}</div>
                    <div>
                      <div className="deliverable-title">{item}</div>
                      <div className="deliverable-sub">{meta.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cert-col">
            <h3>Your Certificate</h3>
            <p className="cert-sub">Signed, dated, and shipped to you on completion.</p>
            <div className="cert-stage">
              {program.certificate_sample_url ? (
                <div style={{ width: "100%", maxWidth: 460, aspectRatio: "1.42/1", borderRadius: 10, overflow: "hidden", boxShadow: "0 22px 44px rgba(74,34,224,.22)" }}>
                  <img src={program.certificate_sample_url} alt="Certificate sample" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div className="certificate">
                  <div className="cert-inner">
                    <div className="cert-eyebrow">CERTIFICATE OF COMPLETION</div>
                    <h4>This certifies that</h4>
                    <div className="cert-name">Your Name Here</div>
                    <div className="cert-body-text">has successfully completed the one-on-one training program in</div>
                    <div className="cert-program">{program.title} — Fluencyo</div>
                    <div className="cert-foot">
                      <div className="cert-sig">Program Director<small>Signature</small></div>
                      <div className="cert-seal">🏆</div>
                      <div className="cert-sig">Issue Date<small>On Completion</small></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pricing-head">
          <h3>Choose Your Pass</h3>
          <p>Not sure yet? Start with the demo — no commitment.</p>
        </div>
        <div className="passes">
          <div className="pass demo">
            <div className="pass-head">
              <div className="pass-class">Day Pass</div>
              <div className="pass-name">Demo Class</div>
              <div className="pass-sub">1 hour, no commitment</div>
            </div>
            <div className="pass-perf" />
            <div className="pass-stub">
              <div className="pass-price-row"><span className="pass-price">₹{program.trial_fee}</span></div>
              <div className="pass-barcode" />
              <button className="btn3d btn-violet" onClick={() => setLeadModal({ planType: "trial", price: program.trial_fee })}>Book Demo</button>
            </div>
          </div>
          <div className="pass full">
            <div className="pass-head">
              <div className="pass-class">Season Pass</div>
              <div className="pass-name">Full Program</div>
              <div className="pass-sub">{program.duration_weeks} weeks, lifetime access</div>
            </div>
            <div className="pass-perf" />
            <div className="pass-stub">
              {hasDiscount && <div className="pass-sale">SAVE {Math.round((1 - program.discount_price / program.full_fee) * 100)}%</div>}
              <div className="pass-price-row">
                <span className="pass-price">₹{hasDiscount ? program.discount_price : program.full_fee}</span>
                {hasDiscount && <span className="pass-strike">₹{program.full_fee}</span>}
              </div>
              {hasDiscount && <div className="pass-save">Save ₹{program.full_fee - program.discount_price}</div>}
              <div className="pass-barcode" />
              <button
                className="btn3d btn-gold"
                onClick={() => setLeadModal({ planType: "full", price: hasDiscount ? program.discount_price : program.full_fee })}
              >
                Enroll Now
              </button>
            </div>
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