import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const About = () => {
  const revealRef = useScrollReveal();

  return (
    <section id="about" className="section section-alt" ref={revealRef}>
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">My journey, academic background, and development focus</p>
        </div>

        <div className="about-grid">
          <div className="about-info">
            <h3>Who I Am</h3>
            <div className="about-text">
              <p>
                I am a 3rd-year B.Tech student in <strong>Computer Science and Engineering</strong> at <strong>Parul University</strong> (Class of 2027).
              </p>
              <p>
                My drive for technology originates from an insatiable curiosity about how modern digital platforms operate. I love creating software solutions that combine elegant code architectures with stunning, user-centric interfaces.
              </p>
              <p>
                Currently, I specialize in full-stack web architectures and I am actively expanding my capabilities into mobile app development frameworks to build multi-platform digital tools.
              </p>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-card glass-card">
              <div className="stat-number">3rd</div>
              <div className="stat-label">Year Student</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-number">10+</div>
              <div className="stat-label">Projects Built</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-number">8+</div>
              <div className="stat-label">Certifications</div>
            </div>
            <div className="stat-card glass-card">
              <div className="stat-number">9.0+</div>
              <div className="stat-label">Tech Drive</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
