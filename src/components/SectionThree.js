import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gtech01 from '../images/gtech_01.webp';
import gtech02 from '../images/gtech_02.webp';
import gtech03 from '../images/gtech_03.webp';
import gtech04 from '../images/gtech_04.webp';
import gtech05 from '../images/gtech_05.GIF';
import gtech06 from '../images/gtech_06.webp';
import gtech07 from '../images/gtech_07.webp';
import gtech08 from '../images/gtech_08.webp';
import gtech09 from '../images/gtech_09.webp';
import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionThree = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const marqueeRef = useRef(null);
  const trackRef = useRef(null);

  const images = [
    { src: gtech01, alt: 'GTECH image 1', size: 'large' },
    { src: gtech02, alt: 'GTECH image 2', size: 'medium' },
    { src: gtech03, alt: 'GTECH image 3', size: 'small' },
    { src: gtech04, alt: 'GTECH image 4', size: 'small' },
    { src: gtech05, alt: 'GTECH image 5', size: 'large' },
    { src: gtech06, alt: 'GTECH image 6', size: 'medium' },
    { src: gtech07, alt: 'GTECH image 7', size: 'medium' },
    { src: gtech08, alt: 'GTECH image 8', size: 'small' },
    { src: gtech09, alt: 'GTECH image 9', size: 'large' },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const track = trackRef.current;

    if (!section || !title || !track) return;

    gsap.set(title, {
      opacity: 0,
      y: 40
    });

    // Check if section is already past trigger point (for fast scrolling scenarios)
    const checkAndShowIfNeeded = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.6; // 60% from top
      
      // If section top is already well past the trigger point (fast scrolling), show immediately
      if (rect.top < triggerPoint - 150 && rect.bottom > 0) {
        gsap.set(title, {
          opacity: 1,
          y: 0
        });
        return true; // Already visible, skip animation
      }
      return false; // Not yet visible, let animation play
    };

    // Create ScrollTrigger timeline - start when section enters viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        // markers: true,
        start: 'top 60%', // Start when top of section reaches bottom of viewport (enters viewport)
        end: 'bottom top', // End when bottom of section reaches top of viewport (leaves viewport)
        toggleActions: 'play none none reverse',
        onEnter: (self) => {
          // Check if fast scrolling - if section is already well past trigger point
          const rect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const triggerPoint = viewportHeight * 0.6;
          
          // Only show immediately if we've scrolled past quickly (more than 150px past trigger)
          if (rect.top < triggerPoint - 150) {
            // Fast scrolling detected - show immediately
            gsap.set(title, {
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
      gsap.set(title, {
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

    // Animate title only - images are already visible for infinite scroll
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.9,
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

  // Infinite marquee scroll for images
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2; // because we duplicate the set

    gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -totalWidth,
        duration: 25,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % -totalWidth)
        }
      }
    );

    return () => gsap.killTweensOf(track);
  }, [images.length]);

  return (
    <section 
      id="section3" 
      className="section-three"
      ref={sectionRef}
    >
      {/* <h2 className="section-three-title font-bebas" ref={titleRef}>
        OUR STORY IN IMAGES
      </h2> */}
      
      <div className="image-grid-container">
        <div className="image-marquee" ref={marqueeRef}>
          <div className="image-track" ref={trackRef}>
            {[...images, ...images].map((image, idx) => (
              <div
                key={`${image.alt}-${idx}`}
                className={`marquee-item image-card-${image.size}`}
              >
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                      src={image.src}
                      alt={image.alt}
                  className="reveal-image"
                />
              </div>
            </div>
              </div>
            ))}
              </div>
            </div>
      </div>
    </section>
  );
};

export default SectionThree;
