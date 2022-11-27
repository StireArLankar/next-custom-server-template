import { memo, useEffect } from 'react';

export const VHProvider = memo(function VHProvider() {
  useEffect(() => {
    const handler = () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return null;
});
