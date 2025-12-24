import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SectionSeven = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const iframeRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  /* -----------------------------------
     1. SECTION FADE-IN ON SCROLL
  ----------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(section, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  /* -----------------------------------
     2. PERFORMANCE-OPTIMIZED MOUSE FOLLOWER
  ----------------------------------- */
  useEffect(() => {
    const container = containerRef.current;
    const button = buttonRef.current;
    if (!container || !button) return;

    // quickTo is optimized for high-frequency updates like mousemove
    const xTo = gsap.quickTo(button, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.6, ease: "power3" });

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      
      // Calculate relative position within the container
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      // Center the button on the cursor
      xTo(relX - button.offsetWidth / 2);
      yTo(relY - button.offsetHeight / 2);
    };

    const handleMouseLeave = () => {
      const rect = container.getBoundingClientRect();
      // Snap back to center of the container
      xTo(rect.width / 2 - button.offsetWidth / 2);
      yTo(rect.height / 2 - button.offsetHeight / 2);
    };

    // Initialize position at center
    const initCenter = () => {
      const rect = container.getBoundingClientRect();
      gsap.set(button, {
        x: rect.width / 2 - button.offsetWidth / 2,
        y: rect.height / 2 - button.offsetHeight / 2
      });
    };

    initCenter();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', initCenter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', initCenter);
    };
  }, []);

  /* -----------------------------------
     3. PLAY / PAUSE HANDLER (Vimeo API)
  ----------------------------------- */
  const togglePlay = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Vimeo uses "play" and "pause" methods via postMessage
    const method = isPlaying ? 'pause' : 'play';
    
    iframe.contentWindow?.postMessage(
      JSON.stringify({ method: method }),
      '*'
    );

    setIsPlaying(!isPlaying);
  };

  return (
    <section id="section7" className="recap-section" ref={sectionRef}>
      <div className="recap-video-container" ref={containerRef}>
        {/* Note: added ?api=1 to the URL to enable postMessage control */}
        <iframe
          ref={iframeRef}
          className="recap-video"
          src="https://player.vimeo.com/video/1148749117?api=1&autoplay=0&loop=1&muted=0&controls=0"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="2025 Year End Review"
        />

        {/* The overlay div captures mouse moves so the iframe doesn't steal focus */}
        <div className="video-overlay" onClick={togglePlay} />

        <button
          ref={buttonRef}
          className={`recap-play-toggle ${isPlaying ? 'playing' : 'paused'}`}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            {isPlaying ? (
              <g>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </g>
            ) : (
              <path d="M8,5 L19,12 L8,19 Z" />
            )}
          </svg>
        </button>
      </div>
    </section>
  );
};

export default SectionSeven;