import React, { useState, useEffect } from 'react';
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

  const [themeTransition, setThemeTransition] = useState({ active: false, direction: 'to-dark' });

  const toggleDarkMode = () => {
    // If darkMode is currently true, we are going to the light theme, otherwise dark
    const targetDirection = darkMode ? 'to-light' : 'to-dark';
    setThemeTransition({ active: true, direction: targetDirection });
    
    // Toggle the theme state exactly at the midpoint of the horizontal laser sweep (430ms)
    setTimeout(() => {
      setDarkMode((prev) => !prev);
    }, 430);
    
    // Deactivate the overlay container after animation completion
    setTimeout(() => {
      setThemeTransition({ active: false, direction: 'to-dark' });
    }, 950);
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
      {/* Premium Horizontal Laser Sweep Theme Transition Overlay */}
      {themeTransition.active && (
        <div className="sweep-transition-container active">
          <div className={`sweep-panel ${themeTransition.direction}`} />
        </div>
      )}

      {/* Target Cursor Effect */}
      <TargetCursor hideDefaultCursor={true} color="#B2945B" targetSelector="button, a, [data-target='true'], .cursor-target" />

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

