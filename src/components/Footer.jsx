import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="container footer-content">
        <a href="#home" onClick={handleScrollToTop} className="footer-logo">
          Daksh.
        </a>
        <p className="footer-copy">
          &copy; {currentYear} Daksh Patel. Engineered with passion and modern React technology.
        </p>
      </div>
    </footer>
  );
};
