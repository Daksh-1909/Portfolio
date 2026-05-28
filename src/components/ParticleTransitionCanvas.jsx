import React, { useEffect, useRef } from 'react';

export const ParticleTransitionCanvas = ({
  screenshotCanvas,
  direction,
  onThemeToggle,
  onComplete,
}) => {
  const canvasRef = useRef(null);
  
  // Store callbacks in refs to break React re-render dependency loop
  const onThemeToggleRef = useRef(onThemeToggle);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onThemeToggleRef.current = onThemeToggle;
    onCompleteRef.current = onComplete;
  }, [onThemeToggle, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !screenshotCanvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // 1. Pixel Downsampling Setup
    const screenWidth = screenshotCanvas.width;
    const screenHeight = screenshotCanvas.height;
    
    // Scale canvas capture to match internal CSS layout sizes
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    const offscreenCtx = offscreenCanvas.getContext('2d');
    
    if (offscreenCtx) {
      offscreenCtx.drawImage(screenshotCanvas, 0, 0, screenWidth, screenHeight, 0, 0, width, height);
    }
    
    const screenshotData = offscreenCtx 
      ? offscreenCtx.getImageData(0, 0, width, height) 
      : { data: new Uint8ClampedArray(), width: 0, height: 0 };

    const area = width * height;
    // Adaptively target ~12,000 active particles for 60fps performance across devices
    const step = Math.max(6, Math.round(Math.sqrt(area / 12000)));

    const particles = [];
    const pixelData = screenshotData.data;

    // Target colors for cosmic morphing
    // To Dark: Cosmic Violet, Cyan Glow, and brand Gold
    const darkMorphColors = [
      { r: 184, g: 0, b: 255 },  // Violet
      { r: 0, g: 243, b: 255 },  // Cyan
      { r: 178, g: 148, b: 91 }, // Gold
    ];

    // To Light: Airy White, Warm Cream, and brand Gold
    const lightMorphColors = [
      { r: 255, g: 255, b: 255 }, // White
      { r: 255, g: 250, b: 240 }, // Cream
      { r: 178, g: 148, b: 91 },  // Gold
    ];

    const morphPalette = direction === 'to-dark' ? darkMorphColors : lightMorphColors;
    const originalSize = step * 1.15; // Slightly larger than step to prevent grid lines when solid

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const r = pixelData[index];
        const g = pixelData[index + 1];
        const b = pixelData[index + 2];
        const a = pixelData[index + 3];

        // Skip fully transparent pixels
        if (a < 10) continue;

        // Add small random noise to spacing to break up uniform grid shapes
        const jitterX = (Math.random() - 0.5) * 1.5;
        const jitterY = (Math.random() - 0.5) * 1.5;

        // Assign a random target morph color from the palette
        const targetColor = morphPalette[Math.floor(Math.random() * morphPalette.length)];

        particles.push({
          x: x + jitterX,
          y: y + jitterY,
          originX: x + jitterX,
          originY: y + jitterY,
          vx: 0,
          vy: 0,
          // Original captured colors
          origR: r,
          origG: g,
          origB: b,
          origA: a / 255,
          // Current animated colors
          r,
          g,
          b,
          a: a / 255,
          // Target morph colors
          targetR: targetColor.r,
          targetG: targetColor.g,
          targetB: targetColor.b,
          size: originalSize,
          speed: Math.random() * 1.2 + 0.8,
          noiseOffset: Math.random() * 100,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }

    // 2. Cosmic Ambient Parallax Stars (Background Layer)
    const ambientStars = [];
    const ambientStarCount = 80;
    for (let i = 0; i < ambientStarCount; i++) {
      const color = morphPalette[Math.floor(Math.random() * morphPalette.length)];
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        color: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.random() * 0.3 + 0.1})`,
      });
    }

    // 3. Animation Control Timeline Variables
    let startTime = null;
    let hasToggledTheme = false;
    let animationFrameId = null;

    const durationJitter = 300;     // Phase 0: Jitter/Vibrate
    const durationDisperse = 450;   // Phase 1: Cosmic Dissolve / Dispersion
    const toggleTime = 750;         // Peak: Toggle underlying theme
    const durationRegroup = 550;    // Phase 2: Magnetic spring pull-back
    const durationReveal = 300;     // Phase 3: Smooth canvas clearing fade
    const totalDuration = toggleTime + durationRegroup + durationReveal; // 1600ms total

    // Physics constants for premium, elastic flow
    const springStrength = 0.055;
    const friction = 0.84;

    // Main animation loop
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Ensure canvas clears perfectly per frame
      ctx.clearRect(0, 0, width, height);

      // A. Draw Ambient Parallax Stars (Background Cosmic Dust)
      for (const star of ambientStars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // B. Trigger Under-the-Hood Theme Swap at peak dispersion (750ms)
      if (elapsed >= toggleTime && !hasToggledTheme) {
        hasToggledTheme = true;
        if (onThemeToggleRef.current) {
          onThemeToggleRef.current();
        }
      }

      // C. Render and Simulate Core Viewport Particles
      for (const p of particles) {
        // Phase Calculations
        if (elapsed < durationJitter) {
          // PHASE 0: Organic Sine Jitter/Vibration
          const progress = elapsed / durationJitter;
          const jitterMax = progress * 3.5;
          
          p.x = p.originX + Math.sin(timestamp * 0.06 + p.noiseOffset) * jitterMax;
          p.y = p.originY + Math.cos(timestamp * 0.06 + p.noiseOffset) * jitterMax;

          // Gentle pulse in particle opacity
          p.a = p.origA * (1 - progress * 0.1);
        } 
        else if (elapsed < toggleTime) {
          // PHASE 1: Dispersion / Dissolve (Shrink to glowing stardust and drift)
          const progress = (elapsed - durationJitter) / durationDisperse;
          
          // Organic sine/cosine noise wind
          p.angle += Math.sin(p.noiseOffset + elapsed * 0.005) * 0.05;
          const driftSpeed = p.speed * (1.2 - progress * 0.4);
          
          p.vx += Math.cos(p.angle) * driftSpeed * 0.12;
          p.vy += Math.sin(p.angle) * driftSpeed * 0.12;
          
          // Accelerate outward slightly from center to increase dispersion depth
          const dxFromCenter = p.originX - width / 2;
          const dyFromCenter = p.originY - height / 2;
          const dist = Math.sqrt(dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter) || 1;
          p.vx += (dxFromCenter / dist) * 0.07;
          p.vy += (dyFromCenter / dist) * 0.07;

          p.x += p.vx;
          p.y += p.vy;

          p.vx *= 0.94;
          p.vy *= 0.94;

          // Morph colors and shrink sizes into tiny glowing stardust
          p.r = p.r + (p.targetR - p.r) * progress * 0.15;
          p.g = p.g + (p.targetG - p.g) * progress * 0.15;
          p.b = p.b + (p.targetB - p.b) * progress * 0.15;
          
          const targetMinSize = Math.max(1.8, originalSize * 0.25);
          p.size = p.size + (targetMinSize - p.size) * progress * 0.15;
          
          // Smooth cosmic fade
          p.a = p.origA * (0.85 - progress * 0.5);
        } 
        else if (elapsed < toggleTime + durationRegroup) {
          // PHASE 2: Magnetic Regrouping (Grow back to solid cell blocks)
          const progress = (elapsed - toggleTime) / durationRegroup;

          // Spring-mass physics pull back to origins
          const dx = p.originX - p.x;
          const dy = p.originY - p.y;
          
          p.vx += dx * springStrength;
          p.vy += dy * springStrength;
          
          p.vx *= friction;
          p.vy *= friction;
          
          p.x += p.vx;
          p.y += p.vy;

          // Gradually morph color, size, and opacity back towards standard solid pixel block states
          p.r = p.r + (p.origR - p.r) * progress * 0.22;
          p.g = p.g + (p.origG - p.g) * progress * 0.22;
          p.b = p.b + (p.origB - p.b) * progress * 0.22;
          
          p.size = p.size + (originalSize - p.size) * progress * 0.25;
          p.a = p.a + (p.origA - p.a) * progress * 0.25;
        } 
        else {
          // PHASE 3: Reveal Smooth Canvas Fade
          const progress = (elapsed - (toggleTime + durationRegroup)) / durationReveal;
          
          // Let particles settle exactly at their home slots
          p.x = p.originX;
          p.y = p.originY;
          p.size = originalSize;
          
          // Clean fade-out of particle alphas to blend canvas perfectly with underlying DOM
          p.a = p.origA * (1 - progress);
        }

        // Draw individual particle
        ctx.fillStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${p.a})`;
        
        // Fast optimized block draws
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Timeline completed successfully
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [screenshotCanvas, direction]);

  return (
    <div className="particle-transition-overlay">
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};
