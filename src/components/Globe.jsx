import { useEffect, useRef } from "react";

function Globe() {
  const canvasRef = useRef(null);

  const SIZE = 380;
  const CANVAS_SIZE = 760;
  const CX = CANVAS_SIZE / 2;
  const CY = CANVAS_SIZE / 2;
  const R = CANVAS_SIZE / 2 - 6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const draw = (rot) => {
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
    };

    draw(0);
  }, [CANVAS_SIZE, CX, CY, R]);

  return (
    <div className="globe-left">
      <div className="globe-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{ width: SIZE, height: SIZE }}
        />
      </div>
    </div>
  );
}

export default Globe;