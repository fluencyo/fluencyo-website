import { useEffect, useRef, useState } from "react";

const row1 = [
  { initials:"AK", name:"Arjun K.", flag:"🇮🇳", detail:"Learning Japanese · 6 months", text:"Fluto feels like a real tutor. It catches when I'm struggling and slows down for me. I've tried every app and nothing comes close to this experience." },
  { initials:"SR", name:"Sofia R.", flag:"🇧🇷", detail:"Learning German · 3 months", text:"The streak feature is addictive in the best way. I haven't missed a day in 3 months and my German has improved more than years of school." },
  { initials:"ML", name:"Marc L.", flag:"🇫🇷", detail:"Learning Korean · 4 months", text:"Finally an app that adapts to ME. Not one-size-fits-all flashcards. Fluencyo knew I was visual so it showed me more picture-based questions. Brilliant." },
  { initials:"TN", name:"Tanaka N.", flag:"🇺🇸", detail:"Learning Japanese · 1 year", text:"I travel frequently for work. Having Fluto practice conversations with me before my trips to Japan has been a game-changer for building real connections." },
  { initials:"PV", name:"Priya V.", flag:"🇮🇳", detail:"Learning Spanish · 5 months", text:"The FireBoost mode is so satisfying after finishing a section. Makes you want to immediately start the next one. Genius game design for a learning app." },
];

const row2 = [
  { initials:"KM", name:"Kim M.", flag:"🇦🇺", detail:"Learning French · 8 months", text:"Pronunciation feedback is incredibly accurate. Fluto corrected my French 'r' in a way that no YouTube video ever could. My host family in Paris was genuinely impressed." },
  { initials:"ZH", name:"Zara H.", flag:"🇬🇧", detail:"Learning Korean · 7 months", text:"I use Fluencyo during my commute. 20 minutes every day and I can now hold real conversations in Korean. The AI truly personalizes everything." },
  { initials:"RB", name:"Rahul B.", flag:"🇮🇳", detail:"Learning Mandarin · 10 months", text:"Best investment for my career. Chinese business phrases have opened doors in client meetings. The Pro plan is worth every rupee." },
  { initials:"LG", name:"Lisa G.", flag:"🇺🇸", detail:"Learning Spanish · 4 months", text:"My daughter and I use Fluencyo together to learn Spanish. The leaderboard makes us compete with each other — most fun we've had as a family in ages." },
  { initials:"DK", name:"Dev K.", flag:"🇸🇬", detail:"Learning German · 6 months", text:"The lesson path design is brilliant. Each section builds on the last and Fluto makes sure you're ready before moving on. True mastery-based learning." },
];

function Card({ t }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
      <p className="testimonial-text">"{t.text}"</p>
      <div className="testimonial-author">
        <div className="author-avatar">{t.initials}</div>
        <div>
          <div className="author-name">{t.name} <span className="flag-emoji">{t.flag}</span></div>
          <div className="author-detail">{t.detail}</div>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const doubled1 = [...row1, ...row1];
  const doubled2 = [...row2, ...row2];

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header reveal">
          <div className="section-label">Loved by Learners</div>
          <h2>Real people, <span className="gradient-text">real results</span></h2>
          <p>Thousands of learners are already on their way to fluency. Here's what they're saying.</p>
        </div>
      </div>
      <div style={{overflow:"hidden",marginBottom:"0"}}>
        <div className="testimonials-track">
          {doubled1.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
      <div style={{overflow:"hidden",marginTop:"24px"}}>
        <div className="testimonials-track-2">
          {doubled2.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
