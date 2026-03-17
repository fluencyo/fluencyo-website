import { useEffect, useRef, useState } from "react";

function AppleIcon() {
  return (
    <svg className="store-btn-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="store-btn-icon-svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 432L272 256 48 80v352z" fill="#00D2FF"/>
      <path d="M48 80l224 176L384 144 144 16C96-8 48 16 48 80z" fill="#00F076"/>
      <path d="M48 432c0 64 48 88 96 64l240-128-112-112L48 432z" fill="#F44336"/>
      <path d="M384 144L272 256l112 112 80-48c48-32 48-88 0-120l-80-56z" fill="#FFCA28"/>
    </svg>
  );
}

function CTA() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="cta-section" id="download" ref={sectionRef}>
      <div className="container">
        <div className={`cta-inner reveal${visible ? " visible" : ""}`}>
          <div className="cta-orb-1"></div>
          <div className="cta-orb-2"></div>
          <div className="section-label" style={{margin:"0 auto 24px"}}>Download Fluencyo</div>
          <h2>Start your language<br/><span className="gradient-text">journey today</span></h2>
          <p>Free to download. No commitment. Just you, Fluto, and the language you have always wanted to speak.</p>
          <div className="cta-btns">
            <a href="#" className="store-btn store-btn-ios">
              <AppleIcon />
              <div>
                <span className="store-btn-label">Download on the</span>
                <span className="store-btn-name">App Store</span>
              </div>
            </a>
            <a href="#" className="store-btn store-btn-android">
              <PlayIcon />
              <div>
                <span className="store-btn-label">Get it on</span>
                <span className="store-btn-name">Google Play</span>
              </div>
            </a>
          </div>
          <div className="cta-rating">
            <p className="cta-rating-text">Free to download · 25+ languages · No credit card needed</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
