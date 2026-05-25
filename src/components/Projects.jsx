import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Projects = () => {
  const revealRef = useScrollReveal();

  const projectsData = [
    {
      title: 'Portfolio Website',
      description: 'A personal developer portfolio built with modern dark aesthetics, responsive layouts, glassmorphism card surfaces, and dynamic transitions.',
      tags: ['React', 'Vite', 'Vanilla CSS', 'ES6+'],
      github: 'https://github.com/Daksh-1909',
      demo: '#',
      icon: 'fas fa-laptop-code'
    },
    {
      title: 'E-Commerce Concept',
      description: 'A fully functional concepts-driven online store showcase featuring structured dynamic product listings, a interactive shopping cart, and a responsive checkout validation flow.',
      tags: ['PHP', 'MySQL', 'Bootstrap', 'Relational DB'],
      github: 'https://github.com/Daksh-1909',
      demo: null,
      icon: 'fas fa-shopping-cart'
    },
    {
      title: 'Task Management App',
      description: 'A productivity application utilizing local browser structures to help users systematically organize tasks, track daily checklist items, and maintain persistent workflows.',
      tags: ['JavaScript', 'HTML5', 'CSS3', 'Local Storage'],
      github: 'https://github.com/Daksh-1909',
      demo: null,
      icon: 'fas fa-tasks'
    }
  ];

  return (
    <section id="projects" className="section section-alt" ref={revealRef}>
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Real-world applications and digital tools I have designed and engineered</p>
        </div>

        <div className="projects-grid">
          {projectsData.map((project) => (
            <div key={project.title} className="project-card glass-card">
              <div className="project-card-body">
                <div className="project-icon">
                  <i className={project.icon}></i>
                </div>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>

                <div className="project-links">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link"
                    title="View Source Code"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  {project.demo && (
                    <a 
                      href={project.demo} 
                      className="project-link"
                      title="View Live Demo"
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
