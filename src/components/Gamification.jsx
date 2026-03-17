import { useEffect, useRef, useState } from "react";

function Gamification() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="gamification-section" ref={sectionRef}>
      <div className="container">
        <div className="gamification-inner">
          <div className={`gamification-content reveal-left${visible ? " visible" : ""}`}>
            <span className="section-label">Progress & Rewards</span>
            <h2>Track your progress. <span className="gradient-text">Celebrate every win.</span></h2>
            <p>Fluencyo's reward system is built to keep you motivated every single day — from your first word to full fluency.</p>
            <div className="gamification-items">
              <div className="gamification-item">
                <div className="gamification-item-icon" style={{background:"rgba(61,191,255,.12)",border:"1px solid rgba(61,191,255,.22)"}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div className="gamification-item-text">
                  <h4>Real-Time AI Feedback</h4>
                  <p>Every answer, every spoken word — Fluto gives you precise, contextual feedback so you learn from every interaction.</p>
                </div>
              </div>
              <div className="gamification-item">
                <div className="gamification-item-icon" style={{background:"rgba(48,216,138,.12)",border:"1px solid rgba(48,216,138,.22)"}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="var(--green)"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="23" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <div className="gamification-item-text">
                  <h4>Voice AI Scoring</h4>
                  <p>Pronunciation scored at word, sentence, and conversation level. See exactly where your accent stands against native speakers.</p>
                </div>
              </div>
              <div className="gamification-item">
                <div className="gamification-item-icon" style={{background:"rgba(255,210,76,.12)",border:"1px solid rgba(255,210,76,.22)"}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 20V10M12 20V4M6 20v-6" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <div className="gamification-item-text">
                  <h4>Fluency Score</h4>
                  <p>Your rolling fluency score tracks overall progress — vocabulary, grammar, pronunciation, and comprehension all in one number.</p>
                </div>
              </div>
              <div className="gamification-item">
                <div className="gamification-item-icon" style={{background:"rgba(255,87,34,.12)",border:"1px solid rgba(255,87,34,.22)"}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="var(--orange)"/></svg>
                </div>
                <div className="gamification-item-text">
                  <h4>Toffys, FireBoost & Badges</h4>
                  <p>Earn Toffys for daily motivation, trigger FireBoost after completing sections, and collect badges that mark your journey milestones.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`streak-visual reveal-right${visible ? " visible" : ""}`}>
            <div className="progress-dashboard">
              <div className="pd-head">
                <div className="pd-title">Your Progress Dashboard</div>
                <div className="pd-live"><span className="pd-live-dot"></span>Live</div>
              </div>
              <div className="pd-metrics">
                <div className="pd-metric">
                  <div className="pdm-top"><span className="pdm-label">Fluency Score</span><span className="pdm-val" style={{color:"var(--cyan)"}}>78%</span></div>
                  <div className="pdm-bar"><div className="pdm-fill pdm-cyan" style={{width:"78%"}}></div></div>
                </div>
                <div className="pd-metric">
                  <div className="pdm-top"><span className="pdm-label">Pronunciation Accuracy</span><span className="pdm-val" style={{color:"var(--green)"}}>92%</span></div>
                  <div className="pdm-bar"><div className="pdm-fill pdm-green" style={{width:"92%"}}></div></div>
                </div>
                <div className="pd-metric">
                  <div className="pdm-top"><span className="pdm-label">Vocabulary Mastered</span><span className="pdm-val" style={{color:"var(--gold)"}}>245 words</span></div>
                  <div className="pdm-bar"><div className="pdm-fill pdm-gold" style={{width:"61%"}}></div></div>
                </div>
                <div className="pd-metric">
                  <div className="pdm-top"><span className="pdm-label">Grammar Accuracy</span><span className="pdm-val" style={{color:"var(--pink)"}}>84%</span></div>
                  <div className="pdm-bar"><div className="pdm-fill pdm-pink" style={{width:"84%"}}></div></div>
                </div>
              </div>
              <div className="pd-rewards">
                <div className="pdr"><span className="pdr-ico">🍬</span><div className="pdr-val">320</div><div className="pdr-lbl">Toffys</div></div>
                <div className="pdr"><span className="pdr-ico">⚡</span><div className="pdr-val">FireBoost</div><div className="pdr-lbl">Active</div></div>
                <div className="pdr"><span className="pdr-ico">🎖️</span><div className="pdr-val">Gold</div><div className="pdr-lbl">Badge</div></div>
                <div className="pdr"><span className="pdr-ico">🎯</span><div className="pdr-val">Lv. 12</div><div className="pdr-lbl">Level</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Gamification;
