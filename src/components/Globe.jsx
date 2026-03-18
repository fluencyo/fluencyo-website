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
  const CANVAS_SIZE = 760;
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

    const ocean = ctx.createRadialGradient(CX - 80, CY - 100, 0, CX, CY, R);
    ocean.addColorStop(0, "#1A4FCC");
    ocean.addColorStop(0.4, "#0E2B8F");
    ocean.addColorStop(0.8, "#060F52");
    ocean.addColorStop(1, "#030828");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = ocean;
    ctx.fill();
  }, [CX, CY, R, CANVAS_SIZE]);

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
        />

        {showPin && pinPos && (
          <div className="loc-pin show" style={{ left: pinPos.x, top: pinPos.y }} />
        )}

        {showBubble && bubblePos && activeLang && (
          <div className="info-bubble show" style={{ left: bubblePos.x, top: bubblePos.y }}>
            <div className="b-lang">{activeLang.name}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Globe;