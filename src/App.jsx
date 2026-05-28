import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { SplashScreen } from './components/SplashScreen';
import { TargetCursor } from './components/TargetCursor';
import { ParticleTransitionCanvas } from './components/ParticleTransitionCanvas';

function App() {
  const [toasts, setToasts] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [themeTransition, setThemeTransition] = useState({
    active: false,
    screenshotCanvas: null,
    direction: 'to-dark',
  });

  const toggleDarkMode = () => {
    if (themeTransition.active) return;

    // Lock scrolling immediately to prevent layout calculations during capture
    document.body.classList.add('scroll-locked');
    const targetDirection = darkMode ? 'to-light' : 'to-dark';

    // Capture the exact visible viewport
    html2canvas(document.body, {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      x: window.scrollX,
      y: window.scrollY,
      useCORS: true,
      logging: false,
      backgroundColor: darkMode ? '#1A1A1B' : '#FFFFFF',
    })
      .then((canvas) => {
        setThemeTransition({
          active: true,
          screenshotCanvas: canvas,
          direction: targetDirection,
        });
      })
      .catch((err) => {
        console.error('Theme transition capture failed:', err);
        // Fallback: toggle theme instantly if capture fails
        setDarkMode((prev) => !prev);
        document.body.classList.remove('scroll-locked');
      });
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {/* Cinematic Particle Morph Theme Transition Canvas Overlay */}
      {themeTransition.active && themeTransition.screenshotCanvas && (
        <ParticleTransitionCanvas
          screenshotCanvas={themeTransition.screenshotCanvas}
          direction={themeTransition.direction}
          onThemeToggle={() => setDarkMode((prev) => !prev)}
          onComplete={() => {
            setThemeTransition({
              active: false,
              screenshotCanvas: null,
              direction: 'to-dark',
            });
            document.body.classList.remove('scroll-locked');
          }}
        />
      )}

      {/* Target Cursor Effect (Hidden during particle transition) */}
      {!themeTransition.active && (
        <TargetCursor hideDefaultCursor={true} color="#B2945B" targetSelector="button, a, [data-target='true'], .cursor-target" />
      )}

      {/* Intro Starting Animation Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Premium Cyber Grid Backdrop */}
      <div className="cyber-bg"></div>

      {/* Global Background Glow Orbs */}
      <div className="glow-orb glow-orb-cyan"></div>
      <div className="glow-orb glow-orb-violet"></div>

      {/* Components Stack */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Contact addToast={addToast} />
      </main>
      <Footer />

      {/* Dynamic Toast Feedback Overlay */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;

