import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import Ticker from "../components/Ticker";
import BookClass from "../components/BookClass";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Languages from "../components/Languages";
import GlobeSection from "../components/GlobeSection";
import Gamification from "../components/Gamification";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";

function Home() {
  useEffect(() => {
    const container = document.getElementById("stars");
    if (!container || container.children.length > 0) return;
    for (let i = 0; i < 120; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const size = Math.random() * 2.5 + 0.5;
      s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*4}s;animation-duration:${2+Math.random()*4}s;opacity:${Math.random()*.4+.1}`;
      container.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      document.querySelectorAll(".orb").forEach((o, i) => {
        const s = (i + 1) * 0.65;
        o.style.transform = `translate(${x * s}px,${y * s}px)`;
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    const total = 5;
    let cur = 0;
    function showScreen(n) {
      for (let i = 0; i < total; i++) {
        const s = document.getElementById("ps" + i);
        const d = document.getElementById("sd" + i);
        if (s) s.classList.toggle("active", i === n);
        if (d) d.classList.toggle("active", i === n);
      }
      cur = n;
    }
    const interval = setInterval(() => showScreen((cur + 1) % total), 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Fluencyo — Live 1-on-1 Language Coaching & Certification Prep</title>
        <meta name="description" content="Learn any language with real, live 1-on-1 tutors. IELTS, JLPT, DELF certification coaching, corporate training, and spoken language classes — book a demo class today." />
      </Helmet>
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>
      <div className="stars" id="stars" />
      <main>
        <Hero />
        <BookClass />
        <Ticker />
        <div className="section-glow-divider" />
        <HowItWorks />
        <div className="section-glow-divider" />
        <Features />
        <Languages />
        <GlobeSection />
        <div className="section-glow-divider" />
        <Gamification />
        <div className="section-glow-divider" />
        <Testimonials />
        <CTA />
      </main>
    </>
  );
}
export default Home;