import { useEffect, useRef, useState } from "react";
import { flagUrl } from "./Globe";

function Languages() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const langs = [
    {code:"es", name:"Spanish", label:"Most popular"},
    {code:"fr", name:"French", label:"Top pick"},
    {code:"jp", name:"Japanese", label:"Trending"},
    {code:"de", name:"German", label:"Top 5"},
    {code:"kr", name:"Korean", label:"K-wave"},
    {code:"cn", name:"Mandarin", label:"1B speakers"},
    {code:"in", name:"Hindi", label:"600M speakers"},
    {code:"sa", name:"Arabic", label:"Rich culture"},
    {code:"br", name:"Portuguese", label:"5 continents"},
    {code:"it", name:"Italian", label:"Art & food"},
    {code:"ru", name:"Russian", label:"Literary legacy"},
    {code:"tr", name:"Turkish", label:"East meets West"},
  ];

  return (
    <section className="languages-section" id="languages" ref={sectionRef}>
      <div className="container">
        <div className={`languages-header reveal${visible ? " visible" : ""}`}>
          <div className="section-label">Languages</div>
          <h2>25+ languages,<br/><span className="gradient-text">one app</span></h2>
          <p>From the world's most spoken languages to niche gems — Fluencyo has your target language covered.</p>
        </div>
        <div className={`languages-grid reveal${visible ? " visible" : ""}`}>
          {langs.map((lang, i) => (
            <div key={i} className="glass-card language-card" style={{transitionDelay:`${i*50}ms`}}>
              <img className="flag-img" src={flagUrl(lang.code)} alt={lang.name} />
              <div className="name">{lang.name}</div>
              <div className="learners">{lang.label}</div>
            </div>
          ))}
        </div>
        <p className="more-langs">+ many more languages coming soon</p>
      </div>
    </section>
  );
}

export default Languages;
