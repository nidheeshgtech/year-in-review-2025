import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
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
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);
  const image3Ref = useRef(null);
  const image4Ref = useRef(null);
  const image5Ref = useRef(null);
  const image6Ref = useRef(null);
  const image7Ref = useRef(null);
  const image8Ref = useRef(null);
  const image9Ref = useRef(null);
  const titleRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image1 = image1Ref.current;
    const image2 = image2Ref.current;
    const image3 = image3Ref.current;
    const image4 = image4Ref.current;
    const image5 = image5Ref.current;
    const image6 = image6Ref.current;
    const image7 = image7Ref.current;
    const image8 = image8Ref.current;
    const image9 = image9Ref.current;
    const title = titleRef.current;

    if (!section || !title) return;

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
                  src={gtech01} 
                  alt="GTECH image 1"
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
                  src={gtech02} 
                  alt="GTECH image 2"
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
                  src={gtech03} 
                  alt="GTECH image 3"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-small">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image4Ref}
                  src={gtech04} 
                  alt="GTECH image 4"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-large">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image5Ref}
                  src={gtech05} 
                  alt="GTECH image 5"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-medium">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image6Ref}
                  src={gtech06} 
                  alt="GTECH image 6"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-medium">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image7Ref}
                  src={gtech07} 
                  alt="GTECH image 7"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-small">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image8Ref}
                  src={gtech08} 
                  alt="GTECH image 8"
                  className="reveal-image"
                />
              </div>
            </div>
          </SwiperSlide>
          
          <SwiperSlide className="swiper-slide-image image-card-large">
            <div className="image-card">
              <div className="image-wrapper">
                <img 
                  ref={image9Ref}
                  src={gtech09} 
                  alt="GTECH image 9"
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
