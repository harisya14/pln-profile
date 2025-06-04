// src/hooks/useScrollReveal.js
import { useEffect, useRef } from 'react';

const useScrollReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Hanya animasi sekali
          }
        });
      },
      { threshold: 0.2 }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return ref;
};

export default useScrollReveal;