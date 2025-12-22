import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import recapVideo from '../images/recap-video.mp4';

import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionSeven = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

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
        <video
          ref={videoRef}
          className="recap-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={recapVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default SectionSeven;
