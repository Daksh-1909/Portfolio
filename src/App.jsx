import React, { useState } from 'react';
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

function App() {
  const [toasts, setToasts] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <>
      {/* Intro Starting Animation Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Premium Cyber Grid Backdrop */}
      <div className="cyber-bg"></div>

      {/* Global Background Glow Orbs */}
      <div className="glow-orb glow-orb-cyan"></div>
      <div className="glow-orb glow-orb-violet"></div>

      {/* Components Stack */}
      <Navbar />
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
