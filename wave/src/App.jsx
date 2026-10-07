import React, { useRef, useEffect } from 'react';
import { folder, useControls } from 'leva';

function App() {
  const canvasRef = useRef(null);
  const hueRef = useRef(200);

  const {
    y,
    wavelen,
    amp,
    freq,
    trail,
    hueCycle,
    baseHue,
    strokeSaturation,
    strokeLightness,
    horizontalShiftIntensity,

  } = useControls('Wave', {
    transform: folder({
      y: { value: window.innerHeight / 2, min: 0, max: window.innerHeight },
      wavelen: { value: 2, min: 0.1, max: 10 },
      amp: { value: 300, min: 0, max: 2000 },
      freq: { value: 0.01, min: 0.001, max: 0.1 },
    }),

    material: folder({
      trail: { value: 0.05, min: 0, max: 1 },
      hueCycle: { value: true },
      baseHue: { value: 200, min: 0, max: 360 },
      strokeSaturation: { value: 50, min: 0, max: 100 },
      strokeLightness: { value: 50, min: 0, max: 100 },
      horizontalShiftIntensity: { value: 2, min: 0, max: 3 },
    }),
  });

  // Set up canvas resize and scale properly
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    addEventListener('resize', handleResize);
    handleResize();
    return () => removeEventListener('resize', handleResize);
  }, []);

  // Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if(!ctx) return;
    let increment = 0;
    let horizontalOffset = 0;

    function animate() {
      requestAnimationFrame(animate);

      ctx.fillStyle = `rgba(0, 0, 0, ${trail})`; // small alpha to fade trail
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      if (hueCycle) hueRef.current += 0.5;
      const strokeHue = hueCycle ? hueRef.current % 360 : baseHue;

      //1st wave
      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let i = 0; i < canvas.clientWidth; i++) {
        const sine = amp * Math.sin((i + horizontalOffset) / wavelen * 0.01 + increment) * Math.sin(increment);
        ctx.lineTo(i, y + sine);
      }

      ctx.strokeStyle = `hsl(${strokeHue}, ${strokeSaturation}%, ${strokeLightness}%)`;
      ctx.stroke();

      //2nd wave
      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let i = 0; i < canvas.clientWidth; i++) {
        const sine = 2*amp * Math.sin((i + horizontalOffset) / wavelen * 0.007 + 1/increment - increment) * Math.cos(increment);
        ctx.lineTo(i, y + sine);
      }

      ctx.strokeStyle = `hsl(${(strokeHue - 100) % 360}, ${strokeSaturation}%, ${strokeLightness}%)`;
      ctx.stroke();

      // 3rd wave
      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let i = 0; i < canvas.clientWidth; i++) {
        const sine = 0.5*amp * Math.sin((i + horizontalOffset) / wavelen * 0.015 + 1/increment + increment) * (Math.sin(increment) + Math.cos(increment));
        ctx.lineTo(i, y + sine);
      }
      ctx.strokeStyle = `hsl(${(strokeHue + 100) % 360}, ${strokeSaturation}%, ${strokeLightness}%)`;
      ctx.stroke();

      increment += freq * (2 + Math.sin(increment));
      horizontalOffset += (Math.random() - 0.5) * horizontalShiftIntensity; // max ±2.5px/frame shift
    }

    animate()
  }, [y, wavelen, amp, freq, trail, hueCycle, baseHue, strokeSaturation, strokeLightness, horizontalShiftIntensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block' }}
    />
  );
}

export default App;
