import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../general.scss';
// Import logo images
import logo1 from '../images/logo_1.webp';
import logo2 from '../images/logo_2.webp';
import logo3 from '../images/logo_3.webp';
import logo4 from '../images/logo_4.webp';
import logo5 from '../images/logo_5.webp';
import logo6 from '../images/logo_6.webp';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const CorporateSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const quoteBlockRef = useRef(null);
  const quoteTextRef = useRef(null);
  const quoteAuthorRef = useRef(null);
  const logosContainerRef = useRef(null);
  const logosWrapperRef = useRef(null);

  // ============================================
  // REVEAL HEADER TITLE ANIMATION WITH SPLITTING
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const quoteBlock = quoteBlockRef.current;

    if (!section || !title || !quoteBlock) return;

    const animationTriggers = [];
    let timeoutId;

    // Wait for DOM to be ready
    timeoutId = setTimeout(() => {
      // Make sure title container is visible
      gsap.set(title, {
        opacity: 1,
        visibility: 'visible'
      });

    // Split title into words (preserve dots)
    const titleHTML = title.innerHTML;
    const titleTemp = document.createElement('div');
    titleTemp.innerHTML = titleHTML;
    const titleWords = [];
    
    const processTitleNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const words = node.textContent.trim().split(/\s+/);
        words.forEach(word => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          titleWords.push(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('corporate-title-dot')) {
          const wrapper = document.createElement('span');
          wrapper.className = 'reveal-word';
          wrapper.innerHTML = node.outerHTML;
          titleWords.push(wrapper);
        } else {
          Array.from(node.childNodes).forEach(child => processTitleNode(child));
        }
      }
    };
    
    Array.from(titleTemp.childNodes).forEach(child => processTitleNode(child));
    title.innerHTML = '';
    titleWords.forEach((word, index) => {
      title.appendChild(word);
      if (index < titleWords.length - 1 && !word.classList.contains('corporate-title-dot')) {
        title.appendChild(document.createTextNode(' '));
      }
    });
    const titleWordSpans = title.querySelectorAll('.reveal-word');

      if (titleWordSpans.length === 0) {
        console.warn('No title word spans found');
        return;
      }

      // Set initial state for all words (same as reveal-word pattern)
    gsap.set(titleWordSpans, {
        opacity: 0,
      y: 80,
      rotationX: -90
    });

    // Animation function
    let hasAnimated = false;
    const animateTitle = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      
        // Animate title words with translateY (same style as reveal-word)
      gsap.to(titleWordSpans, {
          opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.4,
          from: 'start'
        }
      });
    };

      // Create ScrollTrigger for header reveal - trigger when section is 40% from bottom (60% from top)
    const revealTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateTitle();
      },
      onEnterBack: () => {
        animateTitle();
      }
    });

      // Fail-safe: IntersectionObserver - trigger when section is 40% from bottom
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
            // Check if section bottom is at 40% from viewport bottom (bottom is at 60% of viewport height)
            if (rect.bottom < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
            animateTitle();
          }
        }
      });
    }, {
        threshold: [0, 0.1, 0.3],
        rootMargin: '0px'
    });

      observer.observe(section);

      // Fail-safe: Periodic check - trigger when section is 40% from bottom
    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
        const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
        // Check if section bottom is at 40% from viewport bottom (bottom is at 60% of viewport height)
        if (rect.bottom < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
        animateTitle();
        clearInterval(checkInterval);
      }
    }, 100);

    // Check if already in viewport on mount
    setTimeout(() => {
        if (hasAnimated) return;
        const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
        // Check if section bottom is at 40% from viewport bottom (bottom is at 60% of viewport height)
        if (rect.bottom < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
        animateTitle();
      }
      }, 300);

      // Refresh ScrollTrigger after setup
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      // Store cleanup functions
      animationTriggers.push({
        trigger: revealTrigger,
        observer,
        checkInterval
      });
    }, 100);

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      animationTriggers.forEach(({ trigger, observer, checkInterval }) => {
        if (trigger) trigger.kill();
      observer.disconnect();
      clearInterval(checkInterval);
      });
    };
  }, []);

  // Company logos data with images - duplicate for seamless loop
  const logos = [
    { name: 'ICOM Dubai 2025', image: logo1 },
    { name: 'AFRESCO', image: logo2 },
    { name: 'Steer', image: logo3 },
    { name: 'ICOM Dubai 2025', image: logo4 },
    { name: 'AFRESCO', image: logo5 },
    { name: 'Steer', image: logo6 },
    // Duplicates for seamless infinite scroll
    { name: 'ICOM Dubai 2025', image: logo1 },
    { name: 'AFRESCO', image: logo2 },
    { name: 'Steer', image: logo3 },
    { name: 'ICOM Dubai 2025', image: logo4 },
    { name: 'AFRESCO', image: logo5 },
    { name: 'Steer', image: logo6 },
  ];

  // ============================================
  // REVEAL ANIMATION FOR QUOTE TEXT (reveal-me style)
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const quoteText = quoteTextRef.current;

    if (!section || !quoteText) return;

    // Split quote text into words for word-by-word animation
    const quoteTextContent = quoteText.textContent || quoteText.innerText;
    const quoteWords = quoteTextContent.split(/\s+/).filter(w => w.trim() !== '');
    quoteText.innerHTML = quoteWords.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    
    const quoteWordSpans = quoteText.querySelectorAll('.reveal-word');
    
    if (quoteWordSpans.length === 0) return;

    gsap.set(quoteWordSpans, {
      opacity: 0,
      y: 150,
      display: 'inline-block',
      transformStyle: 'preserve-3d'
    });

    let hasAnimated = false;
    const animateQuoteText = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      gsap.to(quoteWordSpans, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.4,
          from: 'start'
        }
      });
    };

    const revealTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateQuoteText();
      },
      onEnterBack: () => {
        animateQuoteText();
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
            animateQuoteText();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '0px'
    });

    observer.observe(section);

    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateQuoteText();
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateQuoteText();
      }
    }, 100);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      if (revealTrigger) {
        revealTrigger.kill();
      }
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const quoteBlock = quoteBlockRef.current;
    const quoteText = quoteTextRef.current;
    const quoteAuthor = quoteAuthorRef.current;

    if (!section || !title || !quoteBlock || !quoteText || !quoteAuthor) return;

    const quoteWordSpans = quoteText.querySelectorAll('.reveal-word');
    
    // Note: quote text words are already split and animated by the reveal animation useEffect above
    // We only need to handle quote author here

    // Set initial states
    // Note: title is handled by the reveal animation useEffect above, don't set opacity here
    gsap.set([quoteAuthor], {
      opacity: 0,
      y: 30
    });

    // Note: quote text words are already set in the reveal animation useEffect above

    // Make quote block visible but scaled down initially
    gsap.set(quoteBlock, {
      opacity: 1,
      scale: 0.95
    });

    // Fail-safe: IntersectionObserver to ensure content becomes visible even if ScrollTrigger fails
    let hasAnimated = false;
    const showContent = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      // Note: title is handled by the reveal animation useEffect above, don't touch it here
      // Note: quote text is handled by the reveal animation useEffect above, don't touch it here
      gsap.set([quoteAuthor], {
        opacity: 1,
        y: 0
      });
        gsap.set(quoteBlock, {
          scale: 1
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

    // Create ScrollTrigger timeline - trigger when section enters viewport
    // Note: title animation is handled by the reveal animation useEffect above
    // We don't animate title here to avoid conflicts
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%', // Start when section top reaches 70% of viewport (earlier trigger)
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        markers: false // Set to true for debugging
          }
        });

    // Animate quote block scale (already visible)
    // Note: quote text words are animated by the reveal animation useEffect above
    tl.to(quoteBlock, {
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4')
    // Animate quote author
    .to(quoteAuthor, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4');

    // Refresh ScrollTrigger after setup
    ScrollTrigger.refresh();

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

  // ============================================
  // REVEAL ANIMATION FOR LOGOS CONTAINER
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const logosContainer = logosContainerRef.current;

    if (!section || !logosContainer) return;

    gsap.set(logosContainer, {
      opacity: 0,
      y: 150
    });

    let hasAnimated = false;
    const animateLogosContainer = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      gsap.to(logosContainer, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    };

    const revealTrigger = ScrollTrigger.create({
      trigger: logosContainer,
      start: 'top 80%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateLogosContainer();
      },
      onEnterBack: () => {
        animateLogosContainer();
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
            animateLogosContainer();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '0px'
    });

    observer.observe(logosContainer);

    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = logosContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateLogosContainer();
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => {
      const rect = logosContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateLogosContainer();
      }
    }, 100);

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      if (revealTrigger) {
        revealTrigger.kill();
      }
    };
  }, []);

  // Infinite scroll animation for logos using GSAP
  useEffect(() => {
    const logosContainer = logosContainerRef.current;
    const logosWrapper = logosWrapperRef.current;

    if (!logosContainer || !logosWrapper) return;

    let scrollAnimation = null;

    const initScroll = () => {
      // Calculate the width of first set of logos for seamless loop
      const firstLogo = logosWrapper.querySelector('.corporate-logo-item');
      const lastLogo = logosWrapper.querySelector('.corporate-logo-item:nth-child(6)');
      
      if (!firstLogo || !lastLogo) return;

      const firstRect = firstLogo.getBoundingClientRect();
      const lastRect = lastLogo.getBoundingClientRect();
      const gap = 60;
      const moveDistance = lastRect.right - firstRect.left + gap;

      // Create infinite scrolling animation
      scrollAnimation = gsap.to(logosWrapper, {
        x: -moveDistance,
        duration: 50,
        ease: 'none',
        repeat: -1,
        paused: false
      });
    };

    // Wait for images to load
    const images = logosWrapper?.querySelectorAll('img');
    if (images && images.length > 0) {
      let loadedCount = 0;
      const totalImages = images.length;

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', () => {
            loadedCount++;
            if (loadedCount === totalImages) {
              setTimeout(initScroll, 100);
            }
          }, { once: true });
        }
      });

      if (loadedCount === totalImages) {
        setTimeout(initScroll, 100);
      }
    } else {
      setTimeout(initScroll, 200);
    }

    return () => {
      if (scrollAnimation) {
        scrollAnimation.kill();
      }
      gsap.killTweensOf(logosWrapper);
    };
  }, []);

  return (
    <section 
      id="corporate-section" 
      className="corporate-section"
      ref={sectionRef}
    >
      {/* Title */}
      <div className="corporate-title" ref={titleRef}>
        <span className="corporate-title-dot">•</span>
        WE'VE COOPERATED WITH
        <span className="corporate-title-dot">•</span>
      </div>

      {/* Logo Carousel */}
      <div className="corporate-logos-container" ref={logosContainerRef}>
        <div className="corporate-logos-wrapper" ref={logosWrapperRef}>
          {logos.map((logo, index) => (
            <div key={index} className="corporate-logo-item">
              <img 
                src={logo.image} 
                alt={logo.name}
                className="corporate-logo-image"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Quote Block */}
      <div className="corporate-quote-block" ref={quoteBlockRef}>
        <div className="corporate-quote-content">
          <p className="corporate-quote-text" ref={quoteTextRef}>
            Alone we can do so little; together we can do so much.
          </p>
          <p className="corporate-quote-author" ref={quoteAuthorRef}>
            (Helen Keller)
          </p>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;
