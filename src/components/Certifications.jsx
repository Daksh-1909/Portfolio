import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Certifications = () => {
  const revealRef = useScrollReveal();
  const [selectedCert, setSelectedCert] = useState(null);

  const certData = [
    {
      id: 'aws-academy',
      title: 'AWS Academy Graduate',
      issuer: 'Amazon Web Services',
      description: 'Cloud Foundations Training - Completed AWS Academy certification program.',
      date: '2025',
      score: null,
      badge: '/assets/certificates/aws-academy-graduate-cloud-foundations-training-bad.png',
      image: '/assets/certificates/daksh_patel_20260121_025451 (1) conv 1.png',
      icon: 'fab fa-aws',
      placeholderClass: 'placeholder-aws'
    },
    {
      id: 'aws-scd',
      title: 'AWS Student Community Day',
      issuer: 'Amazon Web Services',
      description: 'Participant in AWS Student Community Day - Engaged with cloud computing community.',
      date: '2025',
      score: null,
      badge: '/assets/certificates/aws-student-community-day-participant.png',
      image: '/assets/certificates/PATEL DAKSH PIYUSHBHAI AWS SCD Certificate conv 1.png',
      icon: 'fab fa-aws',
      placeholderClass: 'placeholder-aws'
    },
    {
      id: 'nptel',
      title: 'Computer Networks & IP',
      issuer: 'IIT Kharagpur - NPTEL',
      description: 'Elite certification with 75% score - Top 2% performer.',
      date: 'Jan-Apr 2025',
      score: '75% (Top 2%)',
      badge: null,
      image: '/assets/certificates/NPTEL CN certificate conv 1.png',
      icon: 'fas fa-network-wired',
      placeholderClass: 'placeholder-nptel',
      isGold: true
    },
    {
      id: 'html',
      title: 'HTML Full Course',
      issuer: 'Simplilearn',
      description: 'Build a Website Tutorial - Complete HTML course certification.',
      date: '2025',
      score: null,
      badge: null,
      image: '/assets/certificates/simplilearn - HTML conv 1.png',
      icon: 'fab fa-html5',
      placeholderClass: 'placeholder-simplilearn'
    },
    {
      id: 'fcc-js',
      title: 'JavaScript Programming',
      issuer: 'freeCodeCamp',
      description: 'Complete JavaScript programming course certification.',
      date: '2025',
      score: null,
      badge: null,
      image: '/assets/certificates/free_codecamp - JS conv 1.png',
      icon: 'fab fa-js',
      placeholderClass: 'placeholder-fcc'
    },
    {
      id: 'edureka-js',
      title: 'JavaScript Course',
      issuer: 'Edureka',
      description: 'JavaScript programming fundamentals and advanced concepts.',
      date: '2025',
      score: null,
      badge: null,
      image: '/assets/certificates/edureka - JS conv 1.png',
      icon: 'fab fa-js',
      placeholderClass: 'placeholder-fcc'
    },
    {
      id: 'opensource',
      title: 'What is Open Source?',
      issuer: 'IBM SkillsBuild',
      description: 'Understanding open source software development and collaboration.',
      date: '2025',
      score: null,
      badge: null,
      image: '/assets/certificates/open source conv 1.png',
      icon: 'fas fa-code-branch',
      placeholderClass: 'placeholder-ibm'
    },
    {
      id: 'aws-value',
      title: 'AWS Value Added Course',
      issuer: 'Parul University',
      description: 'Participation certificate for AWS cloud computing value-added course.',
      date: '2025',
      score: null,
      badge: null,
      image: null,
      icon: 'fab fa-aws',
      placeholderClass: 'placeholder-aws'
    }
  ];

  const handleCardClick = (cert) => {
    if (cert.image) {
      setSelectedCert(cert);
    }
  };

  return (
    <section id="certifications" className="section" ref={revealRef}>
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Certifications & Achievements</h2>
          <p className="section-subtitle">Credentials, academic benchmarks, and specialized professional training</p>
        </div>

        <div className="certs-grid">
          {certData.map((cert) => (
            <div 
              key={cert.id} 
              className="cert-card glass-card"
              onClick={() => handleCardClick(cert)}
            >
              <div className="cert-image-wrapper">
                {cert.badge ? (
                  <img src={cert.badge} alt={`${cert.title} Badge`} className="cert-thumb" />
                ) : (
                  <div className={`cert-placeholder ${cert.placeholderClass}`}>
                    <i className={cert.icon}></i>
                    <span>{cert.issuer.split(' - ')[0]}</span>
                  </div>
                )}
                
                {cert.image && (
                  <div className="cert-overlay">
                    <div className="cert-overlay-icon">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                )}
              </div>

              <div className="cert-content">
                <div className={`cert-icon-badge ${cert.isGold ? 'badge-gold' : ''}`}>
                  <i className={cert.isGold ? 'fas fa-medal' : 'fas fa-award'}></i>
                </div>
                <h3>{cert.title}</h3>
                <div className="cert-issuer">
                  <i className="fas fa-building"></i> {cert.issuer}
                </div>
                <p className="cert-desc">{cert.description}</p>
                
                <div className="cert-footer">
                  <span className="cert-date">
                    <i className="far fa-calendar"></i> {cert.date}
                  </span>
                  {cert.score && (
                    <span className="cert-score">
                      <i className="fas fa-chart-line"></i> {cert.score}
                    </span>
                  )}
                  {cert.image && (
                    <button className="cert-view-btn">
                      <i className="fas fa-eye"></i> View
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immersive Lightbox Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedCert(null)}>
              &times;
            </button>
            <img 
              src={selectedCert.image} 
              alt={selectedCert.title} 
              className="modal-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div className="modal-caption">{selectedCert.title} - {selectedCert.issuer}</div>
          </div>
        </div>
      )}
    </section>
  );
};
