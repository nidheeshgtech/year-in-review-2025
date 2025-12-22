import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import frame01 from '../images/frame01.webp';
import frame02 from '../images/frame02.webp';
import frame03 from '../images/frame03.webp';
import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionThree = () => {
  const sectionRef = useRef(null);
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const titleRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image1 = image1Ref.current;
    const image2 = image2Ref.current;
    const image3 = image3Ref.current;
    const title = titleRef.current;

    if (!section || !image1 || !image2 || !image3 || !title) return;

    // Get image cards (the elements with clip-path)
    const image1Card = image1.closest('.image-card');
    const image2Card = image2.closest('.image-card');
    const image3Card = image3.closest('.image-card');

    // Set initial states for images - only for first set with refs
    // Image 1: Start from top with blur and scale
    // gsap.set(image1, {
    //   scale: 1,
    //   opacity: 1,
    //   filter: 'blur(0px)'
    // });
    // gsap.set(image1Card, {
    //   clipPath: 'inset(0% 0% 0% 0%)' // Already visible
    // });

    // // Image 2: Start visible
    // gsap.set(image2, {
    //   scale: 1,
    //   opacity: 1,
    //   rotation: 0,
    //   filter: 'blur(0px)'
    // });
    // gsap.set(image2Card, {
    //   clipPath: 'inset(0% 0% 0% 0%)' // Already visible
    // });

    // // Image 3: Start visible
    // gsap.set(image3, {
    //   scale: 1,
    //   opacity: 1,
    //   filter: 'blur(0px)',
    //   x: 0,
    //   y: 0
    // });
    // gsap.set(image3Card, {
    //   clipPath: 'inset(0% 0% 0% 0%)' // Already visible
    // });

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

  // Ensure swiper starts immediately when ready
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      // Start autoplay immediately
      if (!swiper.autoplay.running) {
        swiper.autoplay.start();
      }
    }
  }, []);

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
        <Swiper
          ref={swiperRef}
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView="auto"
          loop={true}
          loopAdditionalSlides={3}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
            reverseDirection: false,
            stopOnLastSlide: false,
          }}
          speed={2500}
          freeMode={false}
          allowTouchMove={false}
          watchSlidesProgress={true}
          className="image-swiper"
        >
          {/* All items in one continuous set */}
          <SwiperSlide className="swiper-slide-image image-card-large">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image1Ref}
                  src={frame01} 
                  alt="Team collaboration"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-medium">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image2Ref}
                  src={frame02} 
                  alt="Creative workspace"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-small">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image3Ref}
                  src={frame03} 
                  alt="Urban landscape"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-small">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame01} 
                  alt="Team collaboration"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-large">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame02} 
                  alt="Creative workspace"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-medium">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame03} 
                  alt="Urban landscape"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-medium">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame01} 
                  alt="Team collaboration"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-small">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame02} 
                  alt="Creative workspace"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-large">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame03} 
                  alt="Urban landscape"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          {/* Duplicate first few slides for seamless loop */}
          <SwiperSlide className="swiper-slide-image image-card-large">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame01} 
                  alt="Team collaboration"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-medium">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame02} 
                  alt="Creative workspace"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-small">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  src={frame03} 
                  alt="Urban landscape"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
};

export default SectionThree;
