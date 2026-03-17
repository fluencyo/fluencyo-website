import { useEffect, useRef, useState, useCallback } from "react";
import countries from "../data/countries";

// Helper: flag image URL using flagcdn.com
export const flagUrl = (code) =>
  `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

function Globe({ languages, selectedLang, onSelectLang }) {
  const canvasRef = useRef(null);
  const globeRotRef = useRef(0);
  const autoRAFRef = useRef(null);
  const animRAFRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const autoSpinRef = useRef(true);

  const [pinPos, setPinPos] = useState(null);
  const [bubblePos, setBubblePos] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showSpinRing, setShowSpinRing] = useState(false);
  const [activeLang, setActiveLang] = useState(null);

  const SIZE = 380;
  const CANVAS_SIZE = 760; // retina 2x
  const CX = CANVAS_SIZE / 2;
  const CY = CANVAS_SIZE / 2;
  const R = CANVAS_SIZE / 2 - 6;

  const project = useCallback((lon, lat, rotDeg) => {
    const lonRad = ((lon + rotDeg) * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;
    const x = CX + R * Math.cos(latRad) * Math.sin(lonRad);
    const y = CY - R * Math.sin(latRad);
    const z = Math.cos(latRad) * Math.cos(lonRad);
    return z > 0 ? { x, y, z } : null;
  }, [CX, CY, R]);

  const drawGlobe = useCallback((rot) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Ocean
    const ocean = ctx.createRadialGradient(CX - 80, CY - 100, 0, CX, CY, R);
    ocean.addColorStop(0, "#1A4FCC");
    ocean.addColorStop(0.4, "#0E2B8F");
    ocean.addColorStop(0.8, "#060F52");
    ocean.addColorStop(1, "#030828");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();

    // Grid lines
    ctx.strokeStyle = "rgba(100,150,255,0.12)";
    ctx.lineWidth = 1.2;
    for (let lat = -80; lat <= 80; lat += 20) {
      ctx.beginPath();
      let first = true;
      for (let ln = -180; ln <= 180; ln += 3) {
        const p = project(ln, lat, rot);
        if (p) { first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); first = false; }
        else first = true;
      }
      ctx.stroke();
    }
    for (let ln = 0; ln < 360; ln += 20) {
      ctx.beginPath();
      let first = true;
      for (let lat = -88; lat <= 88; lat += 3) {
        const p = project(ln, lat, rot);
        if (p) { first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); first = false; }
        else first = true;
      }
      ctx.stroke();
    }

    // Countries sorted far to near
    const toRender = countries
      .map((c) => {
        const pts = c.pts.map(([lo, la]) => project(lo, la, rot)).filter(Boolean);
        const avgZ = pts.length ? pts.reduce((s, p) => s + p.z, 0) / pts.length : -1;
        return { ...c, pts, avgZ };
      })
      .filter((c) => c.pts.length >= 3)
      .sort((a, b) => a.avgZ - b.avgZ);

    toRender.forEach((c) => {
      const light = 0.7 + c.avgZ * 0.35;
      ctx.beginPath();
      ctx.moveTo(c.pts[0].x, c.pts[0].y);
      c.pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.closePath();

      const grd = ctx.createRadialGradient(
        c.pts[0].x - 8, c.pts[0].y - 8, 2,
        c.pts[0].x + 15, c.pts[0].y + 15, 80
      );
      if (c.name === "Antarctica") {
        grd.addColorStop(0, `rgba(240,252,255,${light})`);
        grd.addColorStop(1, `rgba(140,200,220,${light})`);
      } else {
        grd.addColorStop(0, `rgba(112,230,100,${light})`);
        grd.addColorStop(1, `rgba(38,148,30,${light})`);
      }
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${0.28 * light})`;
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      ctx.stroke();
    });

    // Atmosphere
    const atm = ctx.createRadialGradient(CX, CY, R * 0.78, CX, CY, R);
    atm.addColorStop(0, "rgba(50,10,180,0)");
    atm.addColorStop(1, "rgba(70,20,200,0.5)");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = atm;
    ctx.fill();

    // Shine
    const shine = ctx.createRadialGradient(CX - 130, CY - 140, 0, CX - 70, CY - 90, R * 0.48);
    shine.addColorStop(0, "rgba(255,255,255,0.42)");
    shine.addColorStop(0.5, "rgba(255,255,255,0.1)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();

    // Shadow
    const shad = ctx.createRadialGradient(CX + 100, CY + 120, 0, CX + 60, CY + 80, R * 0.5);
    shad.addColorStop(0, "rgba(5,1,50,0.5)");
    shad.addColorStop(1, "rgba(5,1,50,0)");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = shad;
    ctx.fill();
  }, [project, CANVAS_SIZE, CX, CY, R]);

  const startAuto = useCallback(() => {
    autoSpinRef.current = true;
    const loop = () => {
      if (!autoSpinRef.current) return;
      globeRotRef.current = (globeRotRef.current + 0.15) % 360;
      drawGlobe(globeRotRef.current);
      autoRAFRef.current = requestAnimationFrame(loop);
    };
    autoRAFRef.current = requestAnimationFrame(loop);
  }, [drawGlobe]);

  const placePin = useCallback((lang) => {
    const p = project(lang.lon, lang.lat, globeRotRef.current);
    if (!p) { startAuto(); return; }
    const scale = SIZE / CANVAS_SIZE;
    const sx = p.x * scale;
    const sy = p.y * scale;
    setPinPos({ x: sx, y: sy });
    setBubblePos({
      x: Math.max(4, Math.min(sx - 12, SIZE - 220)),
      y: Math.max(4, sy - 110),
    });
    setShowPin(true);
    setShowBubble(true);
    setActiveLang(lang);
  }, [project, SIZE, CANVAS_SIZE, startAuto]);

  const selectLang = useCallback((lang) => {
    autoSpinRef.current = false;
    if (autoRAFRef.current) cancelAnimationFrame(autoRAFRef.current);
    if (animRAFRef.current) cancelAnimationFrame(animRAFRef.current);
    setShowPin(false);
    setShowBubble(false);
    setShowSpinRing(true);

    const target = -lang.lon;
    let diff = ((target - globeRotRef.current) % 360 + 360) % 360;
    if (diff > 180) diff -= 360;
    const startR = globeRotRef.current;
    const endR = startR + diff + 360;
    const dur = 1600;
    const t0 = performance.now();

    const animate = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      globeRotRef.current = startR + (endR - startR) * ease;
      drawGlobe(globeRotRef.current);
      if (t < 1) {
        animRAFRef.current = requestAnimationFrame(animate);
      } else {
        setShowSpinRing(false);
        placePin(lang);
      }
    };
    animRAFRef.current = requestAnimationFrame(animate);
    onSelectLang(lang);
  }, [drawGlobe, placePin, onSelectLang]);

  // Mouse drag to spin
  const onMouseDown = (e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
    autoSpinRef.current = false;
    if (autoRAFRef.current) cancelAnimationFrame(autoRAFRef.current);
  };
  const onMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastXRef.current;
    globeRotRef.current += dx * 0.4;
    drawGlobe(globeRotRef.current);
    lastXRef.current = e.clientX;
  };
  const onMouseUp = () => { isDraggingRef.current = false; };

  // Touch drag
  const onTouchStart = (e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.touches[0].clientX;
    autoSpinRef.current = false;
    if (autoRAFRef.current) cancelAnimationFrame(autoRAFRef.current);
  };
  const onTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.touches[0].clientX - lastXRef.current;
    globeRotRef.current += dx * 0.4;
    drawGlobe(globeRotRef.current);
    lastXRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => { isDraggingRef.current = false; };

  useEffect(() => {
    drawGlobe(0);
    startAuto();
    return () => {
      if (autoRAFRef.current) cancelAnimationFrame(autoRAFRef.current);
      if (animRAFRef.current) cancelAnimationFrame(animRAFRef.current);
    };
  }, [drawGlobe, startAuto]);

  return (
    <div className="globe-left">
      <div className="globe-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ width: SIZE, height: SIZE }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
        <div className="globe-rim" />
        <div className={`spin-ring${showSpinRing ? " show" : ""}`} />

        {showPin && pinPos && (
          <div className="loc-pin show" style={{ left: pinPos.x, top: pinPos.y }}>
            <div className="pin-head"><div className="pin-inner" /></div>
            <div className="pin-stem" />
            <div className="pin-base" />
          </div>
        )}

        {showPin && pinPos && (
          <div className="pulse-ring" style={{ left: pinPos.x, top: pinPos.y }} />
        )}

        {showBubble && bubblePos && activeLang && (
          <div className="info-bubble show" style={{ left: bubblePos.x, top: bubblePos.y }}>
            <div className="b-lang">
              <img
                src={flagUrl(activeLang.flagCode)}
                alt={activeLang.name}
                style={{ width: 20, height: 15, borderRadius: 2, objectFit: "cover", marginRight: 6, verticalAlign: "middle" }}
              />
              {activeLang.name}
            </div>
            <div className="b-stat">{activeLang.speakers}</div>
            <div className="b-fun">{activeLang.fun}</div>
          </div>
        )}
      </div>
      <div className="globe-floor" />
    </div>
  );
}

export default Globe;
