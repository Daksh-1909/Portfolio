import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Hero = () => {
  const revealRef = useScrollReveal();

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section" ref={revealRef}>
      {/* Decorative Orbs */}
      <div className="glow-orb glow-orb-cyan"></div>
      
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge">Welcome to my space</div>
          <h1 className="hero-title">
            <span>Hello, I'm</span>
            <span className="gradient-text">Daksh Patel</span>
          </h1>
          <h2 className="hero-subtitle">B.Tech Student & Developer</h2>
          <p className="hero-description">
            Building digital experiences with code. A passionate 3rd-year CS student engineering high-performance web applications and sleek mobile solutions.
          </p>
          <div className="hero-actions">
            <a 
              href="#projects" 
              onClick={(e) => handleScrollTo(e, 'projects')} 
              className="btn btn-primary"
            >
              View My Work <i className="fas fa-arrow-right"></i>
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleScrollTo(e, 'contact')} 
              className="btn btn-outline"
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-image-showcase">
          {/* Tech Orbit Orbs */}
          <div className="tech-orbits">
            <div className="orbit-node orbit-node-1" title="HTML5">
              <i className="fab fa-html5"></i>
            </div>
            <div className="orbit-node orbit-node-2" title="React">
              <i className="fab fa-react"></i>
            </div>
            <div className="orbit-node orbit-node-3" title="JavaScript">
              <i className="fab fa-js"></i>
            </div>
          </div>
          
          <div className="profile-img-container">
            <img 
              src="/assets/profile.jpg" 
              alt="Daksh Patel" 
              className="profile-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/400x400/0b1329/f8fafc?text=DP";
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
