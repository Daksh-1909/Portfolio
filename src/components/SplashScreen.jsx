import React, { useEffect, useState } from 'react';

export const SplashScreen = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Disable body scroll when splash screen is active
    document.body.style.overflow = 'hidden';

    // Start fade-out animation after 2.0 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Call onComplete when the screen is fully faded out (at 2.6 seconds)
    const completeTimer = setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <h1 className="splash-text">
          <span className="splash-word splash-daksh">Daksh</span>
          <span className="splash-word splash-patel">Patel</span>
        </h1>
        <div className="splash-glow-bar"></div>
      </div>
    </div>
  );
};
