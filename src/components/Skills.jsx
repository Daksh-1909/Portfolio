import React, { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Skills = () => {
  const revealRef = useScrollReveal();
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', label: 'All Tech' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend & Mobile' },
    { id: 'cloud', label: 'Cloud & Fundamentals' }
  ];

  const skillsData = [
    { name: 'HTML5', category: 'frontend', icon: 'fab fa-html5', color: '#e34f26' },
    { name: 'CSS3', category: 'frontend', icon: 'fab fa-css3-alt', color: '#1572b6' },
    { name: 'JavaScript', category: 'frontend', icon: 'fab fa-js', color: '#f7df1e' },
    { name: 'React (Learning)', category: 'frontend', icon: 'fab fa-react', color: '#61dafb' },
    { name: 'PHP', category: 'backend', icon: 'fab fa-php', color: '#777bb4' },
    { name: 'App Dev', category: 'backend', icon: 'fas fa-mobile-alt', color: '#a855f7' },
    { name: 'AWS Cloud', category: 'cloud', icon: 'fab fa-aws', color: '#ff9900' },
    { name: 'Computer Networks', category: 'cloud', icon: 'fas fa-network-wired', color: '#3b82f6' }
  ];

  const filteredSkills = activeTab === 'all' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === activeTab);

  return (
    <section id="skills" className="section" ref={revealRef}>
      {/* Background decoration */}
      <div className="glow-orb glow-orb-violet" style={{ right: 'unset', left: '-10%', bottom: '5%' }}></div>
      
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Proficiencies, tooling, and core competencies I specialize in</p>
        </div>

        {/* Tab Filters */}
        <div className="skills-tabs-container">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`skills-tab-btn ${activeTab === category.id ? 'active' : ''}`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {filteredSkills.map((skill, index) => (
            <div 
              key={skill.name} 
              className="skill-card glass-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="skill-icon-wrapper">
                <i className={skill.icon} style={{ color: skill.color }}></i>
              </div>
              <h3>{skill.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
