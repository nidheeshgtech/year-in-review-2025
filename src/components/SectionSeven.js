import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import recapVideo from '../images/recap-video_.mp4';
import videoPoster from '../images/video-poster.webp';

import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionSeven = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const buttonRef = useRef(null);

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

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      
      // Smooth animation for button
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 0.9,
          duration: 0.1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(buttonRef.current, {
              scale: 1,
              duration: 0.2,
              ease: 'power2.out'
            });
          }
        });
      }
    }
  };

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
          loop
          poster={videoPoster}
          playsInline
        >
          <source src={recapVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button
          ref={buttonRef}
          className={`recap-play-toggle ${isPlaying ? 'playing' : 'paused'}`}
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
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
              // Pause icon
              <>
                <path 
                  d="M6 4H10V20H6V4Z" 
                  fill="currentColor"
                />
                <path 
                  d="M14 4H18V20H14V4Z" 
                  fill="currentColor"
                />
              </>
            ) : (
              // Play icon
              <path 
                d="M8 5V19L19 12L8 5Z" 
                fill="currentColor"
              />
            )}
          </svg>
        </button>
      </div>
    </section>
  );
};

export default SectionSeven;
