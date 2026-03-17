import { useEffect, useRef, useState } from "react";

function Features() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="features-section" id="features" ref={sectionRef}>
      <div className="container">
        <div className={`features-header reveal reveal-scale${visible ? " visible" : ""}`}>
          <div className="section-label">Features</div>
          <h2>Everything you need to<br/><span className="gradient-text">actually get fluent</span></h2>
          <p>Not just flashcards. A full learning ecosystem with AI at its core.</p>
        </div>
        <div className="features-grid">
          <div className={`glass-card orby-feature-card feature-card-big feature-card reveal${visible ? " visible" : ""}`}>
            <div className="feature-tag tag-ai">AI-Powered</div>
            <div className="feature-icon fi-purple">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="var(--cyan)"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" fill="var(--cyan)" opacity=".6"/><circle cx="19" cy="5" r="3" fill="var(--cyan)" opacity=".8"/><path d="M17.5 5h3M19 3.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3>Meet Fluto — Your AI Speaking Partner</h3>
            <p>Fluto isn't a chatbot. It's a voice-first AI that holds real conversations in your target language — listens to your speech, responds naturally, and gives gentle corrections after you speak.</p>
            <div className="orby-screen-live">
              <div className="osl-head">
                <div className="osl-av">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" opacity=".7"/><circle cx="19" cy="5" r="3" fill="var(--cyan)"/></svg>
                </div>
                <div>
                  <div className="osl-name">Fluto AI</div>
                  <div className="osl-status"><span className="osl-sdot"></span>Spanish · Active</div>
                </div>
              </div>
              <div className="osl-convo">
                <div className="osl-them">Hola! Como te llamas?<span style={{fontSize:"9px",opacity:".55",display:"block",marginTop:"2px"}}>Hello! What's your name?</span></div>
                <div className="osl-user">Me llamo Priya. Y tu?</div>
                <div className="osl-them">Mucho gusto, Priya! De donde eres?</div>
                <div className="osl-correction"><span className="osl-ctag">Fluto Feedback</span>Your intonation on "Y tu?" was perfect — rising naturally, just like a native speaker!</div>
              </div>
              <div className="osl-wave">
                <div className="owvb"></div><div className="owvb"></div><div className="owvb"></div>
                <div className="owvb"></div><div className="owvb"></div><div className="owvb"></div><div className="owvb"></div>
                <span className="osl-wave-lbl">Fluto responding...</span>
              </div>
            </div>
          </div>

          <div className={`glass-card feature-card reveal${visible ? " visible" : ""}`} style={{transitionDelay:"100ms"}}>
            <div className="feature-icon fi-gold">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--gold)"/></svg>
            </div>
            <h3>Toffys & FireBoost</h3>
            <p>Earn Toffys for daily motivation and trigger FireBoost when you complete sections — a high-energy sprint that locks in progress and earns bonus rewards.</p>
          </div>

          <div className={`glass-card feature-card reveal${visible ? " visible" : ""}`} style={{transitionDelay:"200ms"}}>
            <div className="feature-icon fi-green">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="var(--green)"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="23" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="23" x2="16" y2="23" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h3>Pronunciation Coach</h3>
            <p>Speak into the app and get real-time accuracy scores on your pronunciation — word-level and sentence-level scoring powered by Voice AI.</p>
          </div>

          <div className={`glass-card feature-card reveal${visible ? " visible" : ""}`} style={{transitionDelay:"300ms"}}>
            <div className="feature-icon fi-cyan">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="var(--cyan)" strokeWidth="2"/><path d="M8 21h8M12 17v4" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h3>Adaptive Lesson Paths</h3>
            <p>Your curriculum adapts based on what you know and don't know. No wasted time on things you've already mastered. Pure efficiency.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
