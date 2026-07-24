import { Link } from "react-router-dom";

function BookClass() {
  return (
    <section style={{ padding: "90px 0", position: "relative", zIndex: 1 }}>
      <div className="container">
        <div style={{
          background: "linear-gradient(120deg, #2D0E7A, #4A22CC 55%, #6B2BE0)",
          borderRadius: 32, padding: "56px 48px", textAlign: "center", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -100, right: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,.08)" }} />
          <div className="section-label" style={{ position: "relative", zIndex: 1 }}>Certification & Tutoring Marketplace</div>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-1px", marginBottom: 16, position: "relative", zIndex: 1 }}>
            Ready for real, one-on-one classes?
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.75, position: "relative", zIndex: 1 }}>
            IELTS, JLPT, DELF, corporate training, university programs, and 1:1 tutoring — trained live by expert tutors, not the app.
          </p>
          <Link to="/programs" className="btn-primary" style={{ position: "relative", zIndex: 1 }}>
            Book a Class →
          </Link>
        </div>
      </div>
    </section>
  );
}
export default BookClass;