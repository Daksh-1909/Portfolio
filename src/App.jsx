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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
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
      {/* Target Cursor Effect */}
      <TargetCursor hideDefaultCursor={true} color="#B2945B" targetSelector="button, a, [data-target='true'], .cursor-target, .project-card, .cert-card" />

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

