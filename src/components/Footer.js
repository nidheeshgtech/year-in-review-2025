import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gtechLogo from '../images/gtech-logo.svg';
import './Footer.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const ctaLinksRef = useRef(null);
  const cardRef = useRef(null);
  const cardHeartRef = useRef(null);
  const cardMessageRef = useRef(null);
  const cardSubtextRef = useRef(null);
  const socialBlocksRef = useRef(null);
  const bottomSectionRef = useRef(null);

  // ============================================
  // REVEAL HEADER TITLE ANIMATION WITH SPLITTING
  // ============================================
  useEffect(() => {
    const footer = footerRef.current;
    const ctaSection = ctaSectionRef.current;

    if (!footer || !ctaSection) return;

    const ctaHeader = ctaSection.querySelector('.footer-cta-header');
    const ctaHeaderText = ctaHeader?.querySelector('.footer-cta-header-text');

    if (!ctaHeader || !ctaHeaderText) return;

    // Split header text into words (preserve dots)
    const headerHTML = ctaHeader.innerHTML;
    const headerTemp = document.createElement('div');
    headerTemp.innerHTML = headerHTML;
    const headerWords = [];
    
    const processHeaderNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const words = node.textContent.trim().split(/\s+/);
        words.forEach(word => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          headerWords.push(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('footer-cta-header-dot')) {
          const wrapper = document.createElement('span');
          wrapper.className = 'reveal-word';
          wrapper.innerHTML = node.outerHTML;
          headerWords.push(wrapper);
        } else if (node.classList.contains('footer-cta-header-text')) {
          const text = node.textContent || node.innerText;
          const words = text.split(/\s+/).filter(w => w.trim() !== '');
          words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'reveal-word';
            span.textContent = word;
            headerWords.push(span);
          });
        } else {
          Array.from(node.childNodes).forEach(child => processHeaderNode(child));
        }
      }
    };
    
    Array.from(headerTemp.childNodes).forEach(child => processHeaderNode(child));
    ctaHeader.innerHTML = '';
    headerWords.forEach((word, index) => {
      ctaHeader.appendChild(word);
      if (index < headerWords.length - 1 && !word.classList.contains('footer-cta-header-dot')) {
        ctaHeader.appendChild(document.createTextNode(' '));
      }
    });
    const headerWordSpans = ctaHeader.querySelectorAll('.reveal-word');

    // Set initial state for all words
    gsap.set(headerWordSpans, {
      opacity: 0,
      y: 80,
      rotationX: -90
    });

    // Animation function
    let hasAnimated = false;
    const animateHeader = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      
      gsap.to(headerWordSpans, {
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

    // Create ScrollTrigger for header reveal with splitting (same style as team-subtitle)
    // Start when section is 30% from bottom (70% from top)
    const revealTrigger = ScrollTrigger.create({
      trigger: footer,
      start: 'top 70%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateHeader();
      },
      onEnterBack: () => {
        animateHeader();
      }
    });

    // Fail-safe: IntersectionObserver
    // Trigger when section is 30% from bottom (70% from top)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          // Check if section is 30% from bottom (top is at 70% of viewport)
          if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
            animateHeader();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '0px'
    });

    observer.observe(footer);

    // Fail-safe: Periodic check
    // Trigger when section is 30% from bottom (70% from top)
    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Check if section is 30% from bottom (top is at 70% of viewport)
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        animateHeader();
        clearInterval(checkInterval);
      }
    }, 100);

    // Check if already in viewport on mount
    // Trigger when section is 30% from bottom (70% from top)
    setTimeout(() => {
      const rect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Check if section is 30% from bottom (top is at 70% of viewport)
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        animateHeader();
      }
    }, 100);

    // Refresh ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      if (revealTrigger) {
        revealTrigger.kill();
      }
    };
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    const socialBlocks = socialBlocksRef.current?.querySelectorAll('.footer-social-block');
    const bottomSection = bottomSectionRef.current;
    const ctaSection = ctaSectionRef.current;
    const headline = headlineRef.current;
    const description = descriptionRef.current;
    const ctaLinks = ctaLinksRef.current?.querySelectorAll('.footer-cta-link');
    const card = cardRef.current;
    
    if (!footer) return;

    // Set initial states for all elements
    gsap.set(footer, {
      opacity: 1 // Keep footer visible
    });

    if (headline) {
      gsap.set(headline, {
        opacity: 0,
        y: 40
      });
    }

    if (description) {
      gsap.set(description, {
        opacity: 0,
        y: 30
      });
    }

    if (ctaLinks && ctaLinks.length > 0) {
      gsap.set(ctaLinks, {
        opacity: 0,
        x: -20
      });
    }

    if (card) {
      gsap.set(card, {
        opacity: 0,
        y: 30,
        scale: 0.95
      });
    }

    if (socialBlocks && socialBlocks.length > 0) {
      gsap.set(socialBlocks, {
        opacity: 0,
        y: 30
      });
    }

    if (bottomSection) {
      gsap.set(bottomSection, {
        opacity: 0,
        y: 20
      });
    }

    // Check if footer is already past trigger point (for fast scrolling scenarios)
    const checkAndShowIfNeeded = () => {
      const triggerEl = ctaSection || footer;
      const rect = triggerEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If footer is already well past viewport (fast scrolling), show immediately
      if (rect.top < -150 && rect.bottom > 0) {
        if (headline) {
          gsap.set(headline, {
            opacity: 1,
            y: 0
          });
        }
        if (description) {
          gsap.set(description, {
            opacity: 1,
            y: 0
          });
        }
        if (ctaLinks && ctaLinks.length > 0) {
          gsap.set(ctaLinks, {
            opacity: 1,
            x: 0
          });
        }
        if (card) {
          gsap.set(card, {
            opacity: 1,
            y: 0,
            scale: 1
          });
        }
        if (socialBlocks && socialBlocks.length > 0) {
          gsap.set(socialBlocks, {
            opacity: 1,
            y: 0
          });
        }
        if (bottomSection) {
          gsap.set(bottomSection, {
            opacity: 1,
            y: 0
          });
        }
        return true; // Already visible, skip animation
      }
      return false; // Not yet visible, let animation play
    };

    // Create timeline with ScrollTrigger - start when footer enters viewport
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaSection || footer,
        start: 'top bottom', // Start when top of footer reaches bottom of viewport (enters viewport)
        end: 'bottom top', // End when bottom of footer reaches top of viewport (leaves viewport)
        toggleActions: 'play none none none',
        onEnter: (self) => {
          // Check if fast scrolling - if footer is already well past viewport
          const triggerEl = ctaSection || footer;
          const rect = triggerEl.getBoundingClientRect();
          
          // Only show immediately if we've scrolled past quickly (more than 150px past viewport)
          if (rect.top < -150) {
            // Fast scrolling detected - show immediately
            if (headline) {
              gsap.set(headline, {
                opacity: 1,
                y: 0
              });
            }
            if (description) {
              gsap.set(description, {
                opacity: 1,
                y: 0
              });
            }
            if (ctaLinks && ctaLinks.length > 0) {
              gsap.set(ctaLinks, {
                opacity: 1,
                x: 0
              });
            }
            if (card) {
              gsap.set(card, {
                opacity: 1,
                y: 0,
                scale: 1
              });
            }
            if (socialBlocks && socialBlocks.length > 0) {
              gsap.set(socialBlocks, {
                opacity: 1,
                y: 0
              });
            }
            if (bottomSection) {
              gsap.set(bottomSection, {
                opacity: 1,
                y: 0
              });
            }
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
      if (headline) {
        gsap.set(headline, { opacity: 1, y: 0 });
      }
      if (description) {
        gsap.set(description, { opacity: 1, y: 0 });
      }
      if (ctaLinks && ctaLinks.length > 0) {
        gsap.set(ctaLinks, { opacity: 1, x: 0 });
      }
      if (card) {
        gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      }
      if (socialBlocks && socialBlocks.length > 0) {
        gsap.set(socialBlocks, { opacity: 1, y: 0 });
      }
      if (bottomSection) {
        gsap.set(bottomSection, { opacity: 1, y: 0 });
      }
      if (tl && !tl.isActive()) {
        tl.progress(1);
      }
    };

    const triggerEl = ctaSection || footer;
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

    observer.observe(triggerEl);

    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = triggerEl.getBoundingClientRect();
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
          if (trigger.vars.trigger === footer) {
            trigger.kill();
          }
        });
      };
    }

    // Animate CTA section elements
    if (headline) {
      tl.to(headline, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          hasAnimated = true;
        }
      }, 0);
    }

    if (description) {
      tl.to(description, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          hasAnimated = true;
        }
      }, 0.2);
    }

    if (ctaLinks && ctaLinks.length > 0) {
      tl.to(ctaLinks, {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          hasAnimated = true;
        }
      }, 0.4);
    }

    if (card) {
      tl.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          hasAnimated = true;
        }
      }, 0.6);
    }

    // Animate social blocks
    if (socialBlocks && socialBlocks.length > 0) {
      tl.to(socialBlocks, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        onComplete: () => {
          hasAnimated = true;
        }
      }, 0.8);
    }

    // Animate bottom section
    if (bottomSection) {
      tl.to(bottomSection, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          hasAnimated = true;
        }
      }, 1.1);
    }

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === footer) {
          trigger.kill();
        }
      });
    };
  }, []);

  // ============================================
  // REVEAL ANIMATION FOR CARD ELEMENTS WITH WORD SPLITTING
  // ============================================
  useEffect(() => {
    const footer = footerRef.current;
    const card = cardRef.current;
    const cardHeart = cardHeartRef.current;
    const cardMessage = cardMessageRef.current;
    const cardSubtext = cardSubtextRef.current;

    if (!footer || !card || !cardHeart || !cardMessage || !cardSubtext) return;

    // Split cardMessage text into words
    const messageText = cardMessage.textContent || cardMessage.innerText;
    const messageWords = messageText.split(/\s+/).filter(w => w.trim() !== '');
    cardMessage.innerHTML = messageWords.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    const messageWordSpans = cardMessage.querySelectorAll('.reveal-word');

    // Split cardSubtext text into words
    const subtextText = cardSubtext.textContent || cardSubtext.innerText;
    const subtextWords = subtextText.split(/\s+/).filter(w => w.trim() !== '');
    cardSubtext.innerHTML = subtextWords.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    const subtextWordSpans = cardSubtext.querySelectorAll('.reveal-word');

    // Set initial state for cardHeart (single element)
    gsap.set(cardHeart, {
      opacity: 0,
      y: 80,
      rotationX: -90,
      display: 'inline-block',
      transformStyle: 'preserve-3d'
    });
    
    // Set initial state for all word spans
    gsap.set([...messageWordSpans, ...subtextWordSpans], {
      opacity: 0,
      y: 80,
      rotationX: -90,
      display: 'inline-block',
      transformStyle: 'preserve-3d'
    });

    // Animation function
    let hasAnimated = false;
    const animateCardElements = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      // Animate cardHeart first
      gsap.to(cardHeart, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Animate message words with stagger
      gsap.to(messageWordSpans, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.4,
          from: 'start'
        },
        delay: 0.2
      });

      // Animate subtext words with stagger (after message)
      gsap.to(subtextWordSpans, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.3,
          from: 'start'
        },
        delay: 0.6
      });
    };

    // Create ScrollTrigger for card elements reveal
    const revealTrigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 80%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateCardElements();
      },
      onEnterBack: () => {
        animateCardElements();
      }
    });

    // Fail-safe: IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          // Check if card is 20% from bottom (80% from top)
          if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
            animateCardElements();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '0px'
    });

    observer.observe(card);

    // Fail-safe: Periodic check
    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateCardElements();
        clearInterval(checkInterval);
      }
    }, 100);

    // Check if already in viewport on mount
    setTimeout(() => {
      const rect = card.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateCardElements();
      }
    }, 100);

    // Refresh ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      if (revealTrigger) {
        revealTrigger.kill();
      }
    };
  }, []);

  // ============================================
  // REVEAL ANIMATION FOR HEADLINE AND DESCRIPTION (SPLIT REVEAL)
  // ============================================
  useEffect(() => {
    const headline = headlineRef.current;
    const description = descriptionRef.current;

    if (!headline || !description) return;

    const headlineElement = headline.querySelector('.footer-cta-headline');
    const descriptionElements = description.querySelectorAll('.footer-cta-description');

    if (!headlineElement || !descriptionElements.length) return;

    const animationTriggers = [];

    // Split headline into words (preserve <br> tags)
    const headlineHTML = headlineElement.innerHTML;
    const headlineTemp = document.createElement('div');
    headlineTemp.innerHTML = headlineHTML;
    const headlineWords = [];
    
    const processHeadlineNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const words = node.textContent.trim().split(/\s+/);
        words.forEach(word => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          headlineWords.push(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'BR') {
          headlineWords.push(node.cloneNode(true));
        } else if (node.tagName === 'SPAN' && (node.classList.contains('footer-cta-headline-year') || node.classList.contains('instrument') || node.className)) {
          // Preserve spans with specific classes - wrap their content with reveal-word spans
          const preservedSpan = node.cloneNode(false); // Clone without children
          const textContent = node.textContent.trim();
          if (textContent) {
            const words = textContent.split(/\s+/);
            words.forEach((word, wordIndex) => {
              const revealSpan = document.createElement('span');
              revealSpan.className = 'reveal-word';
              revealSpan.textContent = word;
              preservedSpan.appendChild(revealSpan);
              // Add space between words inside the preserved span
              if (wordIndex < words.length - 1) {
                preservedSpan.appendChild(document.createTextNode(' '));
              }
            });
          }
          headlineWords.push(preservedSpan);
        } else {
          // For other elements, process their children
          Array.from(node.childNodes).forEach(child => processHeadlineNode(child));
        }
      }
    };
    
    Array.from(headlineTemp.childNodes).forEach(child => processHeadlineNode(child));
    headlineElement.innerHTML = '';
    headlineWords.forEach((word, index) => {
      headlineElement.appendChild(word);
      // Add space between word spans, but not before BR tags
      if (index < headlineWords.length - 1) {
        const nextWord = headlineWords[index + 1];
        const isCurrentWordSpan = word.classList && word.classList.contains('reveal-word');
        const isNextWordSpan = nextWord.classList && nextWord.classList.contains('reveal-word');
        const isNextBR = nextWord.tagName === 'BR';
        
        if (isCurrentWordSpan && isNextWordSpan && !isNextBR) {
          headlineElement.appendChild(document.createTextNode(' '));
        }
      }
    });
    const headlineWordSpans = headlineElement.querySelectorAll('.reveal-word');

    // Split description paragraphs into words
    const descriptionWordSpans = [];
    descriptionElements.forEach((el) => {
      const text = el.textContent || el.innerText;
      const words = text.split(/\s+/).filter(w => w.trim() !== '');
      el.innerHTML = words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
      const wordSpans = el.querySelectorAll('.reveal-word');
      descriptionWordSpans.push(...Array.from(wordSpans));
    });

    // Set initial state for all words
    gsap.set([...headlineWordSpans, ...descriptionWordSpans], {
      opacity: 0,
      y: 80,
      rotationX: -90
    });

    // Animation function for headline
    let headlineAnimated = false;
    const animateHeadline = () => {
      if (headlineAnimated) return;
      headlineAnimated = true;
      
      gsap.to(headlineWordSpans, {
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

    // Animation function for descriptions
    let descriptionAnimated = false;
    const animateDescriptions = () => {
      if (descriptionAnimated) return;
      descriptionAnimated = true;
      
      gsap.to(descriptionWordSpans, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.3,
          from: 'start'
        }
      });
    };

    // Create ScrollTrigger for headline
    const headlineTrigger = ScrollTrigger.create({
      trigger: headline,
      start: 'top 80%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateHeadline();
      },
      onEnterBack: () => {
        animateHeadline();
      }
    });
    animationTriggers.push(headlineTrigger);

    // Create ScrollTrigger for description
    const descriptionTrigger = ScrollTrigger.create({
      trigger: description,
      start: 'top 85%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateDescriptions();
      },
      onEnterBack: () => {
        animateDescriptions();
      }
    });
    animationTriggers.push(descriptionTrigger);

    // Refresh ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    // Cleanup
    return () => {
      animationTriggers.forEach(trigger => {
        if (trigger) trigger.kill();
      });
    };
  }, []);

  return (
    <footer className="footer" ref={footerRef}>
      {/* CTA Section */}
      <div className="footer-cta-section" ref={ctaSectionRef}>
        <div className="footer-cta-container">
          {/* Header */}
          <div className="footer-cta-header">
            <span className="footer-cta-header-dot">•</span>
            <span className="footer-cta-header-text">TECHNOLOGICAL ADVANCEMENT & OPERATIONS</span>
            <span className="footer-cta-header-dot">•</span>
          </div>

          {/* Main Content */}
          <div className="footer-cta-content">
            {/* Left - Headline */}
            <div className="footer-cta-left" ref={headlineRef}>
              <h2 className="footer-cta-headline">
                ONWARD TO <span className="footer-cta-headline-year instrument ms-3">2026</span>
                <br />
                GROUNDBREAKING
                <br />
                SUCCESS   AHEAD
              </h2>
            </div>

            {/* Right - Description */}
            <div className="footer-cta-right" ref={descriptionRef}>
              <p className="footer-cta-description">
                We continued our commitment to industry connections by sponsoring and participating in multiple local and international events, fostering important connections within the community.
              </p>
              <p className="footer-cta-description">
                Anticipate more groundbreaking projects, continued innovation, and a deeper commitment to being the go-to choice for digital services for businesses.
              </p>
            </div>
          </div>

          {/* CTA Links */}
          <div className="footer-cta-links" ref={ctaLinksRef}>
            <a href="mailto:gtech@jobs.workable.com" className="footer-cta-link">
              Join the Team <span className="footer-cta-arrow instrument">(→)</span>
            </a>
            <a href="https://www.gtechme.com/contact/" target="_blank" className="footer-cta-link">
              Get in Touch <span className="footer-cta-arrow instrument">(→)</span>
            </a>
          </div>

          {/* Motivational Card */}
          <div className="footer-motivational-card" ref={cardRef}>
            <div className="footer-card-heart instrument" ref={cardHeartRef}>(♡)</div>
            <p className="footer-card-message" ref={cardMessageRef}>
              As we conclude 2025, we are eager for the possibilities that 2026 holds.
            </p>
            <p className="footer-card-subtext instrument" ref={cardSubtextRef}>(GTECH Future Outlook)</p>
          </div>
        </div>
      </div>

      {/* Upper Footer - Social Blocks */}
      <div className="footer-social-section">
        <div className="footer-social-grid" ref={socialBlocksRef}>
          <a 
            href="https://www.instagram.com/gtechdigital/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-social-block"
          >
            <div className="footer-social-icon">
              <span className="footer-icon-symbol instrument">[◉]</span>
            </div>
            <span className="footer-social-label">INSTAGRAM</span>
          </a>

          <a 
            href="https://www.linkedin.com/company/gtech-information-technology/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-social-block"
          >
            <div className="footer-social-icon">
              <span className="footer-icon-symbol instrument">[in]</span>
            </div>
            <span className="footer-social-label">LINKEDIN</span>
          </a>

          <a 
            href="mailto:hello@gtechme.com" 
            className="footer-social-block"
          >
            <div className="footer-social-icon">
              <span className="footer-icon-symbol instrument">( @️) </span>
            </div>
            <span className="footer-social-label">EMAIL</span>
          </a>

          <a 
            href="https://www.gtechme.com/contact/" target='_blank' 
            className="footer-social-block"
          >
            <div className="footer-social-icon">
              <span className="footer-icon-symbol instrument">( →)</span>
            </div>
            <span className="footer-social-label">CONTACT</span>
          </a>
        </div>
      </div>

      {/* Lower Footer - Gradient Strip */}
      <div className="footer-bottom-section" ref={bottomSectionRef}>
        <div className="footer-bottom-content">
          <div className="footer-contact-info">
            <a href="mailto:hello@gtechme.com" className="footer-contact-link">
              hello@gtechme.com
            </a>
            <a href="tel:+97143285071" className="footer-contact-link">
              +971 4 328 5071
            </a>
          </div>

          <div className="footer-logo">
            <img src={gtechLogo} alt="GTECH Logo" className="footer-logo-image" />
          </div>

          <div className="footer-links">
            <a href="https://www.gtechme.com/terms-of-use/" target="_blank" className="footer-link">Terms of Use</a>
            <span className="footer-link-separator">/</span>
            <a href="https://www.gtechme.com/privacy-policy/" target="_blank" className="footer-link">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
