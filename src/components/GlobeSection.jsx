import { useEffect, useRef, useState } from "react";

export const flagUrl = (code) =>
  `https://flagcdn.com/w80/${code.toLowerCase()}.png`;

// ── Geo lookup for spinning the globe to the right spot ──
// Keyed by flagCode (same codes used by flagUrl). Add more here if you add languages.
const GEO_MAP = {
  gb: { lon: -2,  lat: 54,  speakers: "1.5B", fun: "Most spoken globally" },
  es: { lon: -3,  lat: 40,  speakers: "560M", fun: "2nd most spoken" },
  fr: { lon: 2,   lat: 47,  speakers: "300M", fun: "Language of love" },
  jp: { lon: 138, lat: 37,  speakers: "125M", fun: "Anime & culture" },
  kr: { lon: 128, lat: 36,  speakers: "80M",  fun: "K-Pop & K-Drama" },
  cn: { lon: 105, lat: 35,  speakers: "920M", fun: "Most native speakers" },
  de: { lon: 10,  lat: 51,  speakers: "100M", fun: "Language of thinkers" },
  sa: { lon: 45,  lat: 24,  speakers: "422M", fun: "Beautiful script" },
  in: { lon: 79,  lat: 22,  speakers: "600M", fun: "Bollywood & more" },
  br: { lon: -47, lat: -15, speakers: "260M", fun: "Vibrant & musical" },
  it: { lon: 12,  lat: 42,  speakers: "85M",  fun: "Language of art" },
  ru: { lon: 37,  lat: 55,  speakers: "258M", fun: "Rich literature" },
};
const DEFAULT_GEO = { lon: 0, lat: 20, speakers: "", fun: "Popular choice" };

const getGeo = (lang) => {
  if (!lang) return DEFAULT_GEO;
  const code = (lang.flagCode || "").toLowerCase();
  return GEO_MAP[code] || DEFAULT_GEO;
};

// ── Continent outlines — same simplified dataset used in the app ──
const COUNTRIES = [
  { n: "Canada", c: "land", p: [[-52,47],[-56,47],[-60,46],[-64,44],[-66,44],[-68,46],[-64,48],[-66,50],[-64,52],[-66,56],[-70,58],[-76,62],[-80,63],[-86,63],[-92,63],[-98,62],[-102,60],[-108,60],[-114,60],[-120,60],[-126,60],[-132,58],[-136,58],[-140,60],[-136,60],[-132,56],[-126,50],[-124,48],[-118,50],[-114,50],[-108,50],[-102,50],[-96,50],[-90,48],[-86,46],[-84,44],[-82,44],[-80,44],[-76,44],[-72,45],[-68,46],[-64,44],[-60,46],[-56,46],[-52,47]] },
  { n: "USA", c: "land", p: [[-124,48],[-120,48],[-116,48],[-112,49],[-108,49],[-104,49],[-100,49],[-96,48],[-92,48],[-88,48],[-84,46],[-82,44],[-80,44],[-78,40],[-76,38],[-76,35],[-78,34],[-80,32],[-82,30],[-84,30],[-86,30],[-88,30],[-90,30],[-92,30],[-94,30],[-96,28],[-98,26],[-100,28],[-102,28],[-104,28],[-106,32],[-108,32],[-110,32],[-112,32],[-114,32],[-116,32],[-118,32],[-120,34],[-122,36],[-124,38],[-124,42],[-124,46],[-124,48]] },
  { n: "Greenland", c: "land", p: [[-44,60],[-42,62],[-38,64],[-36,68],[-36,72],[-38,76],[-42,78],[-46,78],[-50,76],[-54,74],[-58,70],[-58,66],[-56,62],[-52,60],[-48,60],[-44,60]] },
  { n: "Brazil", c: "land", p: [[-34,-4],[-36,-6],[-36,-10],[-38,-12],[-40,-16],[-40,-20],[-42,-22],[-44,-24],[-46,-24],[-48,-26],[-50,-28],[-52,-32],[-54,-32],[-56,-30],[-58,-28],[-60,-22],[-60,-16],[-62,-12],[-64,-10],[-66,-10],[-68,-10],[-70,-8],[-72,-4],[-70,-2],[-68,0],[-66,2],[-62,2],[-58,2],[-54,4],[-52,4],[-50,2],[-48,0],[-44,-2],[-40,-2],[-38,-4],[-36,-4],[-34,-4]] },
  { n: "Argentina", c: "land", p: [[-68,-22],[-64,-22],[-60,-22],[-58,-24],[-58,-28],[-60,-32],[-62,-36],[-64,-40],[-66,-44],[-66,-48],[-68,-52],[-70,-54],[-70,-50],[-68,-46],[-66,-42],[-66,-38],[-68,-34],[-70,-30],[-70,-26],[-70,-22],[-68,-22]] },
  { n: "UK", c: "land", p: [[-6,50],[-4,50],[-2,50],[0,52],[2,52],[0,54],[-2,56],[-4,58],[-6,58],[-4,56],[-4,52],[-6,50]] },
  { n: "France", c: "land", p: [[-4,44],[-2,44],[0,44],[4,44],[6,44],[8,48],[4,50],[2,50],[-2,48],[-4,46],[-4,44]] },
  { n: "Spain", c: "land", p: [[-10,44],[-6,44],[-2,44],[2,44],[4,44],[4,42],[2,38],[0,36],[-4,36],[-6,36],[-8,38],[-10,40],[-10,44]] },
  { n: "Germany", c: "land", p: [[6,48],[8,48],[10,48],[14,50],[14,52],[12,54],[8,54],[6,52],[6,50],[6,48]] },
  { n: "Italy", c: "land", p: [[8,44],[10,44],[12,44],[14,42],[16,38],[14,38],[16,40],[18,40],[18,42],[14,46],[12,46],[10,46],[8,44]] },
  { n: "Russia", c: "land", p: [[30,58],[36,58],[42,58],[48,58],[54,56],[60,56],[66,56],[72,56],[78,56],[84,56],[90,56],[96,56],[102,56],[108,56],[114,54],[120,54],[126,52],[132,50],[138,48],[142,48],[148,50],[152,54],[156,58],[160,60],[166,62],[168,62],[168,56],[164,52],[160,48],[156,44],[152,44],[148,46],[144,46],[140,46],[136,44],[130,42],[126,44],[122,46],[118,50],[114,50],[110,52],[106,52],[100,52],[94,56],[88,54],[82,52],[76,52],[70,52],[64,52],[58,50],[52,48],[46,46],[40,46],[36,48],[32,52],[30,54],[30,58]] },
  { n: "SaudiArabia", c: "land", p: [[36,22],[40,22],[44,20],[46,18],[48,16],[50,18],[52,20],[54,22],[56,24],[56,26],[54,28],[50,30],[46,30],[42,28],[38,28],[36,26],[36,22]] },
  { n: "China", c: "land", p: [[76,40],[80,40],[84,44],[88,44],[92,40],[96,38],[98,34],[96,30],[94,28],[90,28],[86,26],[82,26],[80,28],[76,30],[74,32],[74,36],[74,40],[76,40]] },
  { n: "ChinaEast", c: "land", p: [[98,34],[102,26],[104,22],[108,20],[112,20],[116,22],[120,24],[122,28],[124,32],[126,36],[128,40],[126,44],[122,44],[116,42],[110,40],[106,38],[100,34],[98,34]] },
  { n: "India", c: "land", p: [[68,22],[70,24],[72,24],[74,26],[76,28],[78,32],[80,28],[82,26],[84,24],[86,22],[88,20],[88,18],[86,16],[82,14],[80,12],[78,10],[76,8],[72,8],[70,10],[68,14],[66,18],[68,22]] },
  { n: "Japan", c: "land", p: [[130,32],[132,34],[134,36],[136,38],[138,40],[140,42],[142,44],[142,42],[140,40],[138,36],[136,34],[134,32],[132,32],[130,32]] },
  { n: "Australia", c: "land", p: [[114,-22],[118,-20],[122,-18],[126,-16],[130,-14],[134,-12],[136,-12],[138,-14],[140,-16],[142,-18],[146,-18],[148,-20],[150,-24],[152,-26],[152,-30],[150,-34],[148,-38],[144,-38],[140,-36],[136,-34],[132,-32],[128,-32],[124,-32],[120,-34],[116,-34],[114,-30],[112,-26],[112,-22],[114,-22]] },
  { n: "Africa", c: "land", p: [[-16,16],[-12,14],[-8,10],[-4,4],[0,4],[4,4],[8,4],[12,4],[16,4],[20,4],[24,2],[28,-2],[32,-6],[36,-10],[40,-14],[42,-18],[40,-22],[36,-26],[32,-28],[28,-30],[24,-32],[20,-34],[16,-34],[12,-30],[8,-26],[4,-22],[0,-18],[-4,-14],[-8,-10],[-12,-6],[-14,-2],[-16,4],[-16,10],[-16,16]] },
  { n: "Antarctica", c: "ant", p: [[-180,-68],[0,-68],[180,-68],[180,-90],[0,-90],[-180,-90],[-180,-68]] },
];

function project(lon, lat, rot, CX, CY, R) {
  const lam = ((lon + rot) * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  const x = Math.cos(phi) * Math.sin(lam);
  const y = -Math.sin(phi);
  const z = Math.cos(phi) * Math.cos(lam);
  if (z < -0.04) return null;
  return { x: CX + R * x, y: CY + R * y, z: (z + 1) / 2 };
}

function Globe({ languages, selectedLang, onSelectLang }) {
  const canvasRef = useRef(null);
  const rotRef = useRef(0);
  const rafRef = useRef(null);
  const autoSpinRef = useRef(true);
  const animRef = useRef(null); // { startR, endR, t0, dur }

  const SIZE = 380;
  const CANVAS_SIZE = 760;
  const CX = CANVAS_SIZE / 2;
  const CY = CANVAS_SIZE / 2;
  const R = CANVAS_SIZE / 2 - 6;
  const scale = SIZE / CANVAS_SIZE;

  const [spinRing, setSpinRing] = useState(false);
  const [pin, setPin] = useState({ show: false, x: 0, y: 0 });
  const [bubble, setBubble] = useState({ show: false, x: 0, y: 0, ptrTop: false, name: "", stat: "", fun: "" });

  const drawGlobe = (rot) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.clip();

    const ocean = ctx.createRadialGradient(CX - 90, CY - 100, 15, CX + 40, CY + 50, R * 1.15);
    ocean.addColorStop(0, "#88E4FF");
    ocean.addColorStop(0.2, "#42C0EE");
    ocean.addColorStop(0.55, "#1298C8");
    ocean.addColorStop(1, "#044E7A");
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 0.6;
    for (let la = -75; la <= 75; la += 15) {
      ctx.beginPath();
      let f = true;
      for (let lo = -180; lo <= 180; lo += 2) {
        const p = project(lo, la, rot, CX, CY, R);
        if (p) { f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f = false; } else f = true;
      }
      ctx.stroke();
    }
    for (let lo2 = 0; lo2 < 360; lo2 += 20) {
      ctx.beginPath();
      let f = true;
      for (let la2 = -88; la2 <= 88; la2 += 2) {
        const p = project(lo2, la2, rot, CX, CY, R);
        if (p) { f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); f = false; } else f = true;
      }
      ctx.stroke();
    }

    const toRender = COUNTRIES.map((c) => {
      const pts = c.p.map(([lo, la]) => project(lo, la, rot, CX, CY, R)).filter(Boolean);
      const avgZ = pts.length ? pts.reduce((s, p) => s + p.z, 0) / pts.length : 0;
      return { ...c, pts, avgZ };
    }).filter((c) => c.pts.length >= 3).sort((a, b) => a.avgZ - b.avgZ);

    toRender.forEach((c) => {
      const light = 0.55 + c.avgZ * 0.5;
      ctx.beginPath();
      ctx.moveTo(c.pts[0].x, c.pts[0].y);
      c.pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.closePath();
      const cx0 = c.pts[0].x, cy0 = c.pts[0].y;
      const grd = ctx.createRadialGradient(cx0 - 10, cy0 - 10, 3, cx0 + 30, cy0 + 30, 110);
      if (c.c === "ant") {
        grd.addColorStop(0, `rgba(235,252,255,${light})`);
        grd.addColorStop(1, `rgba(155,215,235,${light})`);
      } else {
        grd.addColorStop(0, `rgba(130,240,110,${light})`);
        grd.addColorStop(0.45, `rgba(78,205,62,${light})`);
        grd.addColorStop(1, `rgba(30,140,22,${light})`);
      }
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.strokeStyle = `rgba(255,255,255,${0.38 * light})`;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.stroke();
    });

    const atm = ctx.createRadialGradient(CX, CY, R * 0.82, CX, CY, R);
    atm.addColorStop(0, "rgba(40,8,160,0)");
    atm.addColorStop(1, "rgba(60,18,210,0.58)");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = atm;
    ctx.fill();

    const shine = ctx.createRadialGradient(CX - 100, CY - 110, 0, CX - 65, CY - 72, R * 0.52);
    shine.addColorStop(0, "rgba(255,255,255,0.48)");
    shine.addColorStop(0.45, "rgba(255,255,255,0.12)");
    shine.addColorStop(1, "rgba(255,255,255,0)");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = shine;
    ctx.fill();

    const shad = ctx.createRadialGradient(CX + 80, CY + 95, 0, CX + 50, CY + 60, R * 0.55);
    shad.addColorStop(0, "rgba(4,1,45,0.58)");
    shad.addColorStop(1, "rgba(4,1,45,0)");
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.fillStyle = shad;
    ctx.fill();

    ctx.restore();
  };

  // Main render loop — always running, drives auto-spin or eased travel to target
  useEffect(() => {
    const loop = (now) => {
      if (animRef.current) {
        const { startR, endR, t0, dur } = animRef.current;
        const t = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        rotRef.current = startR + (endR - startR) * ease;
        if (t >= 1) {
          animRef.current = null;
          setSpinRing(false);
          placePinAtCurrentRotation();
        }
      } else if (autoSpinRef.current) {
        rotRef.current = (rotRef.current + 0.15) % 360;
      }
      drawGlobe(rotRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placePinAtCurrentRotation = () => {
    const geo = getGeo(selectedLangRef.current);
    const p = project(geo.lon, geo.lat, rotRef.current, CX, CY, R);
    if (!p) return;
    const sx = p.x * scale;
    const sy = p.y * scale;
    setPin({ show: true, x: sx, y: sy });

    const bubW = 175, bubH = 65;
    let bx = sx - 10;
    let by = sy - bubH - 52;
    let ptrTop = false;
    if (by < 4) { by = sy + 10; ptrTop = true; }
    bx = Math.max(4, Math.min(bx, SIZE - bubW - 4));

    const lang = selectedLangRef.current;
    setBubble({
      show: true, x: bx, y: by, ptrTop,
      name: lang ? lang.name : "",
      stat: geo.speakers ? `${geo.speakers} speakers worldwide` : "",
      fun: geo.fun || "",
    });
  };

  // Keep a ref of the latest selectedLang so the rAF loop (captured once) can read it live
  const selectedLangRef = useRef(selectedLang);
  useEffect(() => { selectedLangRef.current = selectedLang; }, [selectedLang]);

  // React to selection changes — spin to target or resume auto-spin
  useEffect(() => {
    if (!selectedLang) {
      autoSpinRef.current = true;
      animRef.current = null;
      setSpinRing(false);
      setPin({ show: false, x: 0, y: 0 });
      setBubble((b) => ({ ...b, show: false }));
      return;
    }

    autoSpinRef.current = false;
    setPin({ show: false, x: 0, y: 0 });
    setBubble((b) => ({ ...b, show: false }));
    setSpinRing(true);

    const geo = getGeo(selectedLang);
    const target = -geo.lon;
    let diff = ((target - rotRef.current) % 360 + 360) % 360;
    if (diff > 180) diff -= 360;
    const startR = rotRef.current;
    const endR = startR + diff + 360;

    animRef.current = { startR, endR, t0: performance.now(), dur: 1600 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang]);

  return (
    <div className="globe-left">
      <div className="globe-wrap" style={{ position: "relative", width: SIZE, height: SIZE }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            width: SIZE,
            height: SIZE,
            borderRadius: "50%",
            display: "block",
            boxShadow:
              "inset -14px -14px 35px rgba(10,2,70,.5), inset 10px 10px 22px rgba(220,200,255,.15), 0 0 0 5px rgba(255,255,255,.06), 0 0 60px rgba(140,80,255,.4), 0 20px 50px rgba(30,5,140,.5)",
          }}
        />

        {spinRing && (
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "3px solid transparent",
              borderTopColor: "rgba(255,210,76,0.8)",
              borderRightColor: "rgba(255,210,76,0.35)",
              animation: "globeSpinRing 0.8s linear infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {pin.show && (
          <div
            style={{
              position: "absolute",
              left: pin.x, top: pin.y,
              transform: "translate(-50%, -100%)",
              display: "flex", flexDirection: "column", alignItems: "center",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,.5))",
              pointerEvents: "none",
              animation: "globePinIn 0.5s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: "50% 50% 50% 0",
              background: "linear-gradient(135deg, #FF4D8D, #CC0044)",
              transform: "rotate(-45deg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "inset -3px -3px 6px rgba(0,0,0,.3), inset 2px 2px 5px rgba(255,255,255,.35)",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,.95)", transform: "rotate(45deg)" }} />
            </div>
            <div style={{ width: 4, height: 13, background: "linear-gradient(180deg, #FF4D8D, #AA0033)", borderRadius: "0 0 4px 4px", marginTop: -2 }} />
          </div>
        )}

        {bubble.show && (
          <div
            style={{
              position: "absolute", left: bubble.x, top: bubble.y,
              background: "#fff", borderRadius: bubble.ptrTop ? "4px 16px 16px 16px" : "16px 16px 16px 4px",
              padding: "10px 14px", minWidth: 155, maxWidth: 185,
              boxShadow: "0 8px 28px rgba(40,10,140,.4)",
              pointerEvents: "none", whiteSpace: "nowrap",
              animation: "globeBubbleIn 0.4s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 900, color: "#2A0E8F" }}>{bubble.name}</div>
            {bubble.stat && <div style={{ fontSize: 11, fontWeight: 700, color: "#6B3FE8", marginTop: 3 }}>{bubble.stat}</div>}
            {bubble.fun && <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(80,40,180,.65)", marginTop: 2 }}>{bubble.fun}</div>}
          </div>
        )}
      </div>

      <style>{`
        @keyframes globeSpinRing { to { transform: rotate(360deg); } }
        @keyframes globePinIn {
          0%   { transform: translate(-50%, -100%) scale(0); opacity: 0; }
          70%  { transform: translate(-50%, -100%) scale(1.15); opacity: 1; }
          100% { transform: translate(-50%, -100%) scale(1); opacity: 1; }
        }
        @keyframes globeBubbleIn {
          0%   { opacity: 0; transform: scale(.75) translateY(4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Globe;
