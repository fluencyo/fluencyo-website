import { useEffect, useRef, useState } from "react";

function HowItWorks() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="hiw-section" id="about" ref={sectionRef}>
      <div className="container">
        <div className={`hiw-header reveal reveal-scale${visible ? " visible" : ""}`}>
          <div className="section-label">How It Works</div>
          <h2>Three steps to <span className="gradient-text">fluency</span></h2>
          <p>Fluencyo's AI adapts to your pace, style, and goals — making every minute count.</p>
        </div>
        <div className="hiw-steps">
          <div className={`glass-card hiw-step reveal${visible ? " visible" : ""}`} style={{transitionDelay:"100ms"}}>
            <div className="hiw-connector"></div>
            <div className="hiw-step-num">1</div>
            <div className="hiw-step-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(196,181,253,.7)" strokeWidth="1.5"/><path d="M12 8v8M8 12h8" stroke="rgba(196,181,253,.7)" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h3>Pick Your Language</h3>
            <p>Choose from 25+ languages and tell us your goal — travel, career, or just for fun. Fluencyo builds your personalized path instantly.</p>
          </div>
          <div className={`glass-card hiw-step reveal${visible ? " visible" : ""}`} style={{transitionDelay:"250ms"}}>
            <div className="hiw-connector"></div>
            <div className="hiw-step-num">2</div>
            <div className="hiw-step-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--gold)" strokeWidth="1.5"/><path d="M8 12l3 3 5-5" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Learn with Fluto AI</h3>
            <p>Your AI tutor Fluto guides you through interactive lessons, corrects your pronunciation, answers your questions, and keeps you engaged.</p>
          </div>
          <div className={`glass-card hiw-step reveal${visible ? " visible" : ""}`} style={{transitionDelay:"400ms"}}>
            <div className="hiw-step-num">3</div>
            <div className="hiw-step-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="var(--green)"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="23" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="23" x2="16" y2="23" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h3>Speak with Fluto AI</h3>
            <p>Graduate to real voice conversations with Fluto — your 24/7 AI speaking partner that listens, responds, and corrects you like a native speaker would.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
