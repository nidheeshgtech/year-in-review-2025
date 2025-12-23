import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionSeven = () => {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Set initial state for section
    gsap.set(section, {
      opacity: 0,
      y: 0
    });

    // Check if section is already past trigger point (for fast scrolling scenarios)
    const checkAndShowIfNeeded = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If section is already well past viewport (fast scrolling), show immediately
      if (rect.top < -150 && rect.bottom > 0) {
        gsap.set(section, {
          opacity: 1,
          y: 0
        });
        return true; // Already visible, skip animation
      }
      return false; // Not yet visible, let animation play
    };

    // Create ScrollTrigger animation for section - start when section enters viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom', // Start when top of section reaches bottom of viewport (enters viewport)
        end: 'bottom top', // End when bottom of section reaches top of viewport (leaves viewport)
        toggleActions: 'play none none reverse',
        onEnter: (self) => {
          // Check if fast scrolling - if section is already well past viewport
          const rect = section.getBoundingClientRect();
          
          // Only show immediately if we've scrolled past quickly (more than 150px past viewport)
          if (rect.top < -150) {
            // Fast scrolling detected - show immediately
            gsap.set(section, {
              opacity: 1,
              y: 0
            });
            // Pause timeline since we've already shown content
            tl.pause();
          }
          // Otherwise, let the timeline play normally for smooth animation
        }
      }
    });

    // Fail-safe: IntersectionObserver to ensure content becomes visible even if ScrollTrigger fails
    let hasAnimated = false;
    const showContent = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      gsap.set(section, {
        opacity: 1,
        y: 0
      });
      if (tl && !tl.isActive()) {
        tl.progress(1);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
            showContent();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.5],
      rootMargin: '100px'
    });

    observer.observe(section);

    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.9 && rect.bottom > 0 && rect.top > -rect.height) {
        showContent();
        clearInterval(checkInterval);
      }
    }, 200);

    // Check on mount if already past trigger point
    if (checkAndShowIfNeeded()) {
      hasAnimated = true;
      return () => {
        observer.disconnect();
        clearInterval(checkInterval);
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.vars.trigger === section) {
            trigger.kill();
          }
        });
      };
    }

    tl.to(section, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section 
      id="section7" 
      className="recap-section"
      ref={sectionRef}
    >
      <div className="recap-video-container">
        <iframe
          ref={iframeRef}
          className="recap-video"
          src="https://player.vimeo.com/video/1148749117?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&loop=1&muted=0&controls=0&dnt=1"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="2025-Year-End-Review"
          allowFullScreen
        />
        <button
          className={`recap-play-toggle ${isPlaying ? 'playing' : 'paused'}`}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          onClick={() => {
            const iframe = iframeRef.current;
            if (!iframe) return;
            const action = isPlaying ? 'pause' : 'play';
            iframe.contentWindow?.postMessage(JSON.stringify({ method: action }), '*');
            setIsPlaying(!isPlaying);
          }}
        >
          <svg 
            className="play-icon" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isPlaying ? (
              <>
                <path d="M6 4H10V20H6V4Z" fill="currentColor" />
                <path d="M14 4H18V20H14V4Z" fill="currentColor" />
              </>
            ) : (
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
            )}
          </svg>
        </button>
      </div>
    </section>
  );
};

export default SectionSeven;
