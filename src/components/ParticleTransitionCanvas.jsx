import React, { useEffect, useRef } from 'react';

export const ParticleTransitionCanvas = ({
  screenshotCanvas,
  direction,
  onThemeToggle,
  onComplete,
}) => {
  const canvasRef = useRef(null);

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
          size: Math.random() * 1.5 + 1.2,
          speed: Math.random() * 1.2 + 0.8,
          noiseOffset: Math.random() * 100,
          angle: Math.random() * Math.PI * 2,
        });
      }
    }

    // 2. Cosmic Ambient Parallax Stars (Background Layer)
    const ambientStars = [];
    const ambientStarCount = 100;
    for (let i = 0; i < ambientStarCount; i++) {
      const color = morphPalette[Math.floor(Math.random() * morphPalette.length)];
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.random() * 0.4 + 0.15})`,
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

    // Physics constants
    const springStrength = 0.08;
    const friction = 0.82;

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
        onThemeToggle();
      }

      // C. Render and Simulate Core Viewport Particles
      for (const p of particles) {
        // Phase Calculations
        if (elapsed < durationJitter) {
          // PHASE 0: Vibration / Jitter
          const progress = elapsed / durationJitter;
          const jitterMax = progress * 4; // increasing vibration
          p.x = p.originX + (Math.random() - 0.5) * jitterMax;
          p.y = p.originY + (Math.random() - 0.5) * jitterMax;

          // Gentle fade in particle alpha to simulate glowing state
          p.a = p.origA * (1 - progress * 0.15);
        } 
        else if (elapsed < toggleTime) {
          // PHASE 1: Dispersion / Dissolve
          const progress = (elapsed - durationJitter) / durationDisperse;
          
          // Organic sine/cosine noise wind
          p.angle += Math.sin(p.noiseOffset + elapsed * 0.005) * 0.05;
          const driftSpeed = p.speed * (1.2 - progress * 0.5);
          
          p.vx += Math.cos(p.angle) * driftSpeed * 0.15;
          p.vy += Math.sin(p.angle) * driftSpeed * 0.15;
          
          // Accelerate outward slightly from center to increase dispersion depth
          const dxFromCenter = p.originX - width / 2;
          const dyFromCenter = p.originY - height / 2;
          const dist = Math.sqrt(dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter) || 1;
          p.vx += (dxFromCenter / dist) * 0.08;
          p.vy += (dyFromCenter / dist) * 0.08;

          p.x += p.vx;
          p.y += p.vy;

          // Drag/Friction to avoid infinite velocity
          p.vx *= 0.95;
          p.vy *= 0.95;

          // Morph colors and transparency into target cosmic dust styles
          p.r = p.r + (p.targetR - p.r) * progress * 0.15;
          p.g = p.g + (p.targetG - p.g) * progress * 0.15;
          p.b = p.b + (p.targetB - p.b) * progress * 0.15;
          
          // Smooth cosmic fade
          p.a = p.origA * (0.85 - progress * 0.55);
        } 
        else if (elapsed < toggleTime + durationRegroup) {
          // PHASE 2: Magnetic Regrouping
          const progress = (elapsed - toggleTime) / durationRegroup;

          // Spring-mass physics pull back to origins
          const dx = p.originX - p.x;
          const dy = p.originY - p.y;
          
          p.vx += dx * springStrength;
          p.vy += dy * springStrength;
          
          // Dampen speeds using friction to stabilize regrouping
          p.vx *= friction;
          p.vy *= friction;
          
          p.x += p.vx;
          p.y += p.vy;

          // Gradually morph color and opacity back towards standard pixel colors
          p.r = p.r + (p.origR - p.r) * progress * 0.2;
          p.g = p.g + (p.origG - p.g) * progress * 0.2;
          p.b = p.b + (p.origB - p.b) * progress * 0.2;
          
          // Fade back up to full visibility
          p.a = p.a + (p.origA - p.a) * progress * 0.25;
        } 
        else {
          // PHASE 3: Reveal Smooth Canvas Fade
          const progress = (elapsed - (toggleTime + durationRegroup)) / durationReveal;
          
          // Let particles settle exactly at their home slots
          p.x = p.originX;
          p.y = p.originY;
          
          // Clean fade-out of particle alphas to blend canvas perfectly with underlying DOM
          p.a = p.origA * (1 - progress);
        }

        // Draw individual particle
        ctx.fillStyle = `rgba(${Math.round(p.r)}, ${Math.round(p.g)}, ${Math.round(p.b)}, ${p.a})`;
        
        // Optimize rendering using fast fillRect blocks instead of heavy circle arcs
        if (p.size > 2) {
          // Render larger particles as squares to keep fill operations rapid
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          // Simple fast pixel-level render
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Timeline completed successfully
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [screenshotCanvas, direction, onThemeToggle, onComplete]);

  return (
    <div className="particle-transition-overlay">
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};
