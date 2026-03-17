import config from "../data/siteConfig";

function Hero() {
  const { stats } = config;
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Powered by AI · Free to Start
            </div>
            <h1 className="hero-title">
              Learn Any<br/>Language with<br/>
              <span className="gradient-text">Fluto AI</span>
            </h1>
            <p className="hero-subtitle">Fluencyo turns language learning into a daily adventure. AI-powered lessons, real conversations, streak rewards — fluency isn't a dream anymore.</p>
            <div className="hero-btns">
              <a href="#download" className="store-btn store-btn-ios">
                <svg className="store-btn-icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="white"/></svg>
                <div><span className="store-btn-label">Download on the</span><span className="store-btn-name">App Store</span></div>
              </a>
              <a href="#download" className="store-btn store-btn-android">
                <svg className="store-btn-icon-svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M48 432L272 256 48 80v352z" fill="#00D2FF"/><path d="M48 80l224 176L384 144 144 16C96-8 48 16 48 80z" fill="#00F076"/><path d="M48 432c0 64 48 88 96 64l240-128-112-112L48 432z" fill="#F44336"/><path d="M384 144L272 256l112 112 80-48c48-32 48-88 0-120l-80-56z" fill="#FFCA28"/></svg>
                <div><span className="store-btn-label">Get it on</span><span className="store-btn-name">Google Play</span></div>
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">{stats.languages}</div>
                <div className="hero-stat-label">Languages</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <div className="hero-stat-num">{stats.learners}</div>
                <div className="hero-stat-label">Users</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <div className="hero-stat-num">{stats.rating} ★</div>
                <div className="hero-stat-label">App Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-ring"></div>
            <div className="hero-ring-2"></div>
            <div className="phone-wrapper">
              <div className="phone-glow"></div>
              <div className="phone-frame">
                <div className="phone-notch"></div>

                {/* SCREEN 1: Translation */}
                <div className="phone-screen ps-purple active" id="ps0">
                  <div className="screen-type-badge">Translation</div>
                  <div className="phone-header">
                    <div className="phone-flag">🇫🇷</div>
                    <div className="phone-lang">French</div>
                    <div className="phone-sublang">Beginner · Level 3</div>
                  </div>
                  <div className="phone-progress-bar"><div className="phone-progress-fill" style={{width:"45%"}}></div></div>
                  <div className="ph-card">
                    <div className="ph-lbl">Select the correct translation</div>
                    <div className="ph-main">Merci beaucoup</div>
                    <div className="ph-sub">French · tap to hear</div>
                  </div>
                  <div className="ph-choices">
                    <div className="ph-ch ph-ch-ok">Thank you very much</div>
                    <div className="ph-ch ph-ch-n">Good evening</div>
                    <div className="ph-ch ph-ch-n">See you tomorrow</div>
                  </div>
                  <div className="ph-fb">
                    <div className="ph-fb-txt"><strong>Correct!</strong> Merci = Thank you, beaucoup = very much.</div>
                  </div>
                </div>

                {/* SCREEN 2: Pronunciation */}
                <div className="phone-screen ps-teal" id="ps1">
                  <div className="screen-type-badge" style={{color:"rgba(48,216,138,.9)"}}>Pronunciation</div>
                  <div className="phone-header">
                    <div className="phone-flag">🇩🇪</div>
                    <div className="phone-lang">German</div>
                    <div className="phone-sublang">Intermediate · Level 8</div>
                  </div>
                  <div className="phone-progress-bar"><div className="phone-progress-fill" style={{width:"72%",background:"linear-gradient(90deg,var(--green),#20B070)"}}></div></div>
                  <div className="ph-card" style={{background:"rgba(48,216,138,.08)",borderColor:"rgba(48,216,138,.2)"}}>
                    <div className="ph-lbl" style={{color:"rgba(48,216,138,.7)"}}>Say this out loud</div>
                    <div className="ph-main" style={{fontSize:"18px"}}>Guten Morgen</div>
                    <div className="ph-sub">/ˈɡuːtən ˈmɔrɡən/ · Good morning</div>
                  </div>
                  <div className="ph-mic-ring">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#30D88A"/><path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#30D88A" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="23" stroke="#30D88A" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="23" x2="16" y2="23" stroke="#30D88A" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:"9px",color:"rgba(48,216,138,.7)",fontWeight:"700"}}>Accuracy Score</div>
                    <div style={{fontSize:"22px",fontWeight:"900",color:"var(--green)"}}>94%</div>
                  </div>
                  <div className="ph-score-bar"><div className="ph-score-fill" style={{width:"94%"}}></div></div>
                  <div className="ph-fb">
                    <div className="ph-fb-txt"><strong style={{color:"var(--green)"}}>Great pronunciation!</strong> Your 'r' sound is almost native.</div>
                  </div>
                </div>

                {/* SCREEN 3: Fluto AI Conversation */}
                <div className="phone-screen ps-dark" id="ps2">
                  <div className="screen-type-badge" style={{color:"rgba(61,191,255,.85)"}}>Fluto AI</div>
                  <div style={{display:"flex",alignItems:"center",gap:"9px",padding:"2px 0 10px",borderBottom:"1px solid rgba(255,255,255,.07)",marginBottom:"9px"}}>
                    <div className="fluto-avatar" style={{width:"32px",height:"32px",fontSize:"13px"}}>🤖</div>
                    <div>
                      <div style={{fontWeight:"900",fontSize:"12px",color:"#fff"}}>Fluto AI</div>
                      <div style={{fontSize:"9px",color:"rgba(48,216,138,.8)",fontWeight:"700"}}>Spanish · Listening</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
                    <div className="ph-them">Hola! Como te llamas?<span style={{fontSize:"8.5px",opacity:".55",display:"block",marginTop:"2px"}}>Hello! What's your name?</span></div>
                    <div className="ph-user">Me llamo Ana. Y tu?</div>
                    <div className="ph-them">Mucho gusto, Ana! De donde eres?</div>
                    <div className="ph-note"><span className="ph-note-tag">Fluto Feedback</span>Your intonation was perfect — rising naturally like a native speaker!</div>
                  </div>
                  <div className="ph-wave-row" style={{marginTop:"8px"}}>
                    <div className="pwb"></div><div className="pwb"></div><div className="pwb"></div>
                    <div className="pwb"></div><div className="pwb"></div>
                    <span style={{fontSize:"9px",color:"rgba(61,191,255,.7)",fontWeight:"700",marginLeft:"5px"}}>Fluto responding...</span>
                  </div>
                </div>

                {/* SCREEN 4: Word Bank */}
                <div className="phone-screen ps-indigo" id="ps3">
                  <div className="screen-type-badge">Word Bank</div>
                  <div className="phone-header">
                    <div className="phone-flag">🇪🇸</div>
                    <div className="phone-lang">Spanish</div>
                    <div className="phone-sublang">Intermediate · Level 6</div>
                  </div>
                  <div className="phone-progress-bar"><div className="phone-progress-fill" style={{width:"58%",background:"linear-gradient(90deg,var(--pink),#CC40DD)"}}></div></div>
                  <div className="ph-card">
                    <div className="ph-lbl">Translate this sentence</div>
                    <div className="ph-main">I eat an apple every day</div>
                  </div>
                  <div className="ph-answer">Yo como una manzana...</div>
                  <div className="ph-wbank" style={{marginTop:"8px"}}>
                    <span className="ph-wchip used">Yo</span>
                    <span className="ph-wchip used">como</span>
                    <span className="ph-wchip used">una</span>
                    <span className="ph-wchip used">manzana</span>
                    <span className="ph-wchip">cada</span>
                    <span className="ph-wchip">dia</span>
                    <span className="ph-wchip">bebo</span>
                    <span className="ph-wchip">naranja</span>
                  </div>
                  <div className="ph-orby-row" style={{marginTop:"8px"}}>
                    <div className="ph-orby-av">🤖</div>
                    <div className="ph-orby-txt"><b>Fluto tip:</b> "Cada dia" = every day — add it to complete!</div>
                  </div>
                </div>

                {/* SCREEN 5: Listening */}
                <div className="phone-screen ps-navy" id="ps4">
                  <div className="screen-type-badge" style={{color:"rgba(61,191,255,.85)"}}>Listening</div>
                  <div className="phone-header">
                    <div className="phone-flag">🇯🇵</div>
                    <div className="phone-lang">Japanese</div>
                    <div className="phone-sublang">Beginner · Level 4</div>
                  </div>
                  <div className="phone-progress-bar"><div className="phone-progress-fill" style={{width:"38%",background:"linear-gradient(90deg,var(--cyan),#0088CC)"}}></div></div>
                  <div className="ph-card" style={{background:"rgba(61,191,255,.07)",borderColor:"rgba(61,191,255,.2)"}}>
                    <div className="ph-lbl" style={{color:"rgba(61,191,255,.7)"}}>Listen carefully</div>
                    <div style={{fontSize:"22px",fontWeight:"900",color:"#fff",marginTop:"6px"}}>おはよう</div>
                    <div style={{fontSize:"9px",color:"rgba(255,255,255,.5)"}}>Ohayou — tap to replay</div>
                  </div>
                  <div className="ph-choices" style={{marginTop:"8px"}}>
                    <div className="ph-ch ph-ch-ok">Good morning</div>
                    <div className="ph-ch ph-ch-n">Good night</div>
                    <div className="ph-ch ph-ch-n">Thank you</div>
                  </div>
                </div>

                {/* Screen dots */}
                <div className="screen-dot-row">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className={`screen-dot${i===0?" active":""}`} id={`sd${i}`}></div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="phone-badge badge-1">
                <span style={{fontSize:20}}>🏆</span>
                <div><div className="badge-value">Top Learner</div><div className="badge-desc">This week</div></div>
              </div>
              <div className="phone-badge badge-2">
                <span style={{fontSize:20}}>⚡</span>
                <div><div className="badge-value">+50 XP</div><div className="badge-desc">Just earned</div></div>
              </div>
              <div className="phone-badge badge-3">
                <span style={{fontSize:20}}>🌍</span>
                <div><div className="badge-value">{stats.countries}</div><div className="badge-desc">Countries</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
