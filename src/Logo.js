// Logo.js
import React, { useState, useEffect } from 'react';

function Logo() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopStyle = {
    maxWidth: '200px',
    width: '200px',
    height: 'auto',
    position: 'absolute',
    top: '30px',
    right: '30px'
  };

  const mobileStyle = {
    maxWidth: '200px',
    width: '200px',
    height: 'auto',
    position: 'absolute',
    top: '40px'
  };

  const desktopSrc = '/full-black-transparent-bg.png';
  const mobileSrc = '/full-white-transparent-bg.png';

  return (
    <img
      src={isMobile ? mobileSrc : desktopSrc}
      alt="Logo"
      style={isMobile ? mobileStyle : desktopStyle}
    />
  );
}

export default Logo;
