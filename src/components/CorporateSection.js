import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../general.scss';
import logo1 from '../images/Logo-1.svg';
import logo2 from '../images/Logo-2.svg';
import logo3 from '../images/Logo-3.svg';
import logo4 from '../images/Logo-4.svg';
import logo5 from '../images/Logo-5.svg';
import logo6 from '../images/Logo-6.svg';
import logo7 from '../images/Logo-7.svg';
import logo8 from '../images/Logo-8.svg';
import logo9 from '../images/Logo-9.svg';
import logo10 from '../images/Logo-10.svg';
import logo11 from '../images/Logo-11.svg';
import logo12 from '../images/Logo-12.svg';
import logo13 from '../images/Logo-13.svg';
import logo14 from '../images/Logo-14.svg';
import logo15 from '../images/Logo-15.svg';
import logo16 from '../images/Logo-16.svg';
import logo17 from '../images/Logo-17.svg';
import logo18 from '../images/Logo-18.svg';
import logo19 from '../images/Logo-19.svg';
import logo20 from '../images/Logo-20.svg';
import logo21 from '../images/Logo-21.svg';
import logo22 from '../images/Logo-22.svg';
import logo23 from '../images/Logo-23.svg';
import logo24 from '../images/Logo-24.svg';
import logo25 from '../images/Logo-25.svg';
import logo26 from '../images/Logo-26.svg';
import logo27 from '../images/Logo-27.svg';
import logo28 from '../images/Logo-28.svg';
import logo29 from '../images/Logo-29.svg';
import logo30 from '../images/Logo-30.svg';
import logo31 from '../images/Logo-31.svg';
import logo32 from '../images/Logo-32.svg';

gsap.registerPlugin(ScrollTrigger);

const CorporateSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const quoteBlockRef = useRef(null);
  const quoteTextRef = useRef(null);
  const quoteAuthorRef = useRef(null);
  const logosContainerRef = useRef(null);
  const logosWrapperRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const quoteBlock = quoteBlockRef.current;

    if (!section || !title || !quoteBlock) return;

    const animationTriggers = [];
    let timeoutId;

    timeoutId = setTimeout(() => {
      gsap.set(title, {
        opacity: 1,
        visibility: 'visible'
      });

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

    gsap.set(titleWordSpans, {
        opacity: 0,
      y: 80,
      rotationX: -90
    });

    let hasAnimated = false;
    const animateTitle = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      
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

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
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

    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
        const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
        if (rect.bottom < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
        animateTitle();
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => {
        if (hasAnimated) return;
        const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
        if (rect.bottom < viewportHeight * 0.6 && rect.bottom > viewportHeight * 0.4) {
        animateTitle();
      }
      }, 300);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      animationTriggers.push({
        trigger: revealTrigger,
        observer,
        checkInterval
      });
    }, 100);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      animationTriggers.forEach(({ trigger, observer, checkInterval }) => {
        if (trigger) trigger.kill();
      observer.disconnect();
      clearInterval(checkInterval);
      });
    };
  }, []);

  const logos = [
    { name: 'Logo 1', image: logo1 },
    { name: 'Logo 2', image: logo2 },
    { name: 'Logo 3', image: logo3 },
    { name: 'Logo 4', image: logo4 },
    { name: 'Logo 5', image: logo5 },
    { name: 'Logo 6', image: logo6 },
    { name: 'Logo 7', image: logo7 },
    { name: 'Logo 8', image: logo8 },
    { name: 'Logo 9', image: logo9 },
    { name: 'Logo 10', image: logo10 },
    { name: 'Logo 11', image: logo11 },
    { name: 'Logo 12', image: logo12 },
    { name: 'Logo 13', image: logo13 },
    { name: 'Logo 14', image: logo14 },
    { name: 'Logo 15', image: logo15 },
    { name: 'Logo 16', image: logo16 },
    { name: 'Logo 17', image: logo17 },
    { name: 'Logo 18', image: logo18 },
    { name: 'Logo 19', image: logo19 },
    { name: 'Logo 20', image: logo20 },
    { name: 'Logo 21', image: logo21 },
    { name: 'Logo 22', image: logo22 },
    { name: 'Logo 23', image: logo23 },
    { name: 'Logo 24', image: logo24 },
    { name: 'Logo 25', image: logo25 },
    { name: 'Logo 26', image: logo26 },
    { name: 'Logo 27', image: logo27 },
    { name: 'Logo 28', image: logo28 },
    { name: 'Logo 29', image: logo29 },
    { name: 'Logo 30', image: logo30 },
    { name: 'Logo 31', image: logo31 },
    { name: 'Logo 32', image: logo32 },
    { name: 'Logo 1', image: logo1 },
    { name: 'Logo 2', image: logo2 },
    { name: 'Logo 3', image: logo3 },
    { name: 'Logo 4', image: logo4 },
    { name: 'Logo 5', image: logo5 },
    { name: 'Logo 6', image: logo6 },
    { name: 'Logo 7', image: logo7 },
    { name: 'Logo 8', image: logo8 },
    { name: 'Logo 9', image: logo9 },
    { name: 'Logo 10', image: logo10 },
    { name: 'Logo 11', image: logo11 },
    { name: 'Logo 12', image: logo12 },
    { name: 'Logo 13', image: logo13 },
    { name: 'Logo 14', image: logo14 },
    { name: 'Logo 15', image: logo15 },
    { name: 'Logo 16', image: logo16 },
    { name: 'Logo 17', image: logo17 },
    { name: 'Logo 18', image: logo18 },
    { name: 'Logo 19', image: logo19 },
    { name: 'Logo 20', image: logo20 },
    { name: 'Logo 21', image: logo21 },
    { name: 'Logo 22', image: logo22 },
    { name: 'Logo 23', image: logo23 },
    { name: 'Logo 24', image: logo24 },
    { name: 'Logo 25', image: logo25 },
    { name: 'Logo 26', image: logo26 },
    { name: 'Logo 27', image: logo27 },
    { name: 'Logo 28', image: logo28 },
    { name: 'Logo 29', image: logo29 },
    { name: 'Logo 30', image: logo30 },
    { name: 'Logo 31', image: logo31 },
    { name: 'Logo 32', image: logo32 },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const quoteText = quoteTextRef.current;

    if (!section || !quoteText) return;

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
    
    gsap.set([quoteAuthor], {
      opacity: 0,
      y: 30
    });

    gsap.set(quoteBlock, {
      opacity: 1,
      scale: 0.95
    });

    let hasAnimated = false;
    const showContent = () => {
      if (hasAnimated) return;
      hasAnimated = true;
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        markers: false
          }
        });

    tl.to(quoteBlock, {
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4')
    .to(quoteAuthor, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4');

    ScrollTrigger.refresh();

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

  useEffect(() => {
    const logosContainer = logosContainerRef.current;
    const logosWrapper = logosWrapperRef.current;

    if (!logosContainer || !logosWrapper) return;

    let scrollAnimation = null;

    const initScroll = () => {
      const firstLogo = logosWrapper.querySelector('.corporate-logo-item');
      const lastLogo = logosWrapper.querySelector('.corporate-logo-item:nth-child(32)');
      
      if (!firstLogo || !lastLogo) return;

      const firstRect = firstLogo.getBoundingClientRect();
      const lastRect = lastLogo.getBoundingClientRect();
      const gap = 60;
      const moveDistance = lastRect.right - firstRect.left + gap;

      scrollAnimation = gsap.to(logosWrapper, {
        x: -moveDistance,
        duration: 50,
        ease: 'none',
        repeat: -1,
        paused: false
      });
    };

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
      <div className="corporate-title" ref={titleRef}>
        <span className="corporate-title-dot">•</span>
        WE'VE COOPERATED WITH
        <span className="corporate-title-dot">•</span>
      </div>

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
