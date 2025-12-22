import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import recapBg from '../images/recap-bg.webp';
import cardDot from '../images/card-dot.svg';
import Odometer from 'odometer';
import 'odometer/themes/odometer-theme-default.css';
import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionOne = () => {
  // Refs - these let us access HTML elements in JavaScript
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);
  const odometerRef = useRef(null);
  const odometerInstanceRef = useRef(null);
  const titleRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const sectionRef = useRef(null);
  const hoverMouseMoveHandlerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const cardContent1Ref = useRef(null);
  const cardContent2Ref = useRef(null);


  // ============================================
  // CARD 3D HOVER EFFECT
  // ============================================
  useEffect(() => {
    const card = cardRef.current;
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    const glowElement = card?.querySelector('.glow');
    
    if (!card || !wrapper || !section) return;

    let cardBounds = null; // Will store card position and size

    // Check if section has "active-card" class
    const isActiveCard = () => {
      return section.classList.contains('active-card');
    };

    // This function runs when mouse moves over the card
    const handleMouseMove = (event) => {
      // Disable hover effect if "active-card" class is present or if scrolling is active
      if (isActiveCard() || isScrollingRef.current) {
        return;
      }

      if (!cardBounds) return;

      // Get mouse position relative to card
      const mouseX = event.clientX - cardBounds.left;
      const mouseY = event.clientY - cardBounds.top;
      
      // Calculate center point
      const centerX = mouseX - cardBounds.width / 2;
      const centerY = mouseY - cardBounds.height / 2;
      
      // Calculate distance from center
      const distance = Math.sqrt(centerX * centerX + centerY * centerY);

      // Calculate rotation based on mouse position
      const maxRotation = 25;
      const rotateX = (centerY / cardBounds.height) * maxRotation * 2;
      const rotateY = (-centerX / cardBounds.width) * maxRotation * 2;
      const rotateZ = (centerX / cardBounds.width) * 8;

      // Add depth effect
      const translateZ = Math.min(distance / 8, 40);
      const scale = 1 + (distance / cardBounds.width) * 0.15;

      // Apply 3D transform to card
      card.style.transform = `
        translateZ(${translateZ}px)
        scale3d(${scale}, ${scale}, 1)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
      `;

      // Update glow effect position
      if (glowElement) {
        const glowX = centerX * 2 + cardBounds.width / 2;
        const glowY = centerY * 2 + cardBounds.height / 2;
        glowElement.style.backgroundImage = `
          radial-gradient(
            circle at ${glowX}px ${glowY}px,
            #ffffff66,
            #0000000f
          )
        `;
      }
    };

    // When mouse enters card area
    const handleMouseEnter = () => {
      // Don't enable hover effect if "active-card" class is present or if scrolling is active
      if (isActiveCard() || isScrollingRef.current) {
        return;
      }
      cardBounds = card.getBoundingClientRect();
      // Store reference for cleanup
      hoverMouseMoveHandlerRef.current = handleMouseMove;
      document.addEventListener('mousemove', handleMouseMove);
    };

    // When mouse leaves card area
    const handleMouseLeave = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Smoothly reset card to normal
      card.style.transition = 'transform 0.3s ease-out';
      card.style.transform = '';
      if (glowElement) {
        glowElement.style.backgroundImage = '';
      }
      // Remove transition after reset
      setTimeout(() => {
        card.style.transition = '';
      }, 300);
    };

    // Add event listeners
    wrapper.addEventListener('mouseenter', handleMouseEnter);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup when component unmounts
    return () => {
      wrapper.removeEventListener('mouseenter', handleMouseEnter);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // ============================================
  // REVEAL HEADER TITLE ANIMATION WITH SPLITTING (focus-title)
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const titleDiv = titleRef.current;

    if (!section || !titleDiv) return;

    const h1Element = titleDiv.querySelector('h1');
    const h2Element = titleDiv.querySelector('h2');

    if (!h1Element || !h2Element) return;

    // Hide title immediately to prevent flash of content
    gsap.set(titleDiv, {
      opacity: 0,
      visibility: 'hidden'
    });

    // Split h1 into words
    const h1Text = h1Element.textContent || h1Element.innerText;
    const h1Words = h1Text.split(/\s+/).filter(w => w.trim() !== '');
    h1Element.innerHTML = h1Words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    const h1WordSpans = h1Element.querySelectorAll('.reveal-word');

    // Split h2 into words
    const h2Text = h2Element.textContent || h2Element.innerText;
    const h2Words = h2Text.split(/\s+/).filter(w => w.trim() !== '');
    h2Element.innerHTML = h2Words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    const h2WordSpans = h2Element.querySelectorAll('.reveal-word');

    // Make title visible, but keep words hidden
    gsap.set(titleDiv, {
      opacity: 1,
      visibility: 'visible'
    });
    
    // Set initial state for all words
    gsap.set([...h1WordSpans, ...h2WordSpans], {
      opacity: 0,
      y: 80,
      rotationX: -90
    });

    // Animation function
    let hasAnimated = false;
    const animateTitle = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      
      // Ensure title is visible
      gsap.set(titleDiv, {
        opacity: 1,
        visibility: 'visible'
      });
      
      // Animate h1 words (like team-subtitle) with translateY
      gsap.to(h1WordSpans, {
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
      
      // Animate h2 words with delay (like team-title) with translateY
      gsap.to(h2WordSpans, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: {
          amount: 0.4,
          from: 'start'
        },
        delay: 0.3
      });
    };

    // Create ScrollTrigger for header reveal with splitting (same style as team-subtitle)
    // Start when section is 30% from bottom (70% from top)
    const revealTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateTitle();
      },
      onEnterBack: () => {
        animateTitle();
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
            animateTitle();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '0px'
    });

    observer.observe(section);

    // Fail-safe: Periodic check
    // Trigger when section is 30% from bottom (70% from top)
    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Check if section is 30% from bottom (top is at 70% of viewport)
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        animateTitle();
        clearInterval(checkInterval);
      }
    }, 100);

    // Check if already in viewport on mount
    // Trigger when section is 30% from bottom (70% from top)
    setTimeout(() => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Check if section is 30% from bottom (top is at 70% of viewport)
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        animateTitle();
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
  // TITLE TEXT ANIMATION (Character-by-character - disabled if reveal-word exists)
  // ============================================
  useEffect(() => {
    const animateTitle = () => {
      const titleElement = titleRef.current;
      if (!titleElement) return;

      const h1Element = titleElement.querySelector('h1');
      const h2Element = titleElement.querySelector('h2');
      
      // Check if reveal-word spans already exist (from reveal animation)
      // If they do, skip the character animation to avoid conflicts
      if (h1Element && h1Element.querySelector('.reveal-word')) {
        return; // Reveal-word animation is handling this
      }
      if (h2Element && h2Element.querySelector('.reveal-word')) {
        return; // Reveal-word animation is handling this
      }
      
      // Function to animate a text element
      const animateTextElement = (element, delay = 0) => {
        if (!element) return;

      // Get the text and split by line breaks
        const text = element.textContent || element.innerText;
      const lines = text.split('\n').filter(line => line.trim() !== '');

      // Wrap each character in a span for animation
      let html = '';
      lines.forEach((line) => {
        const characters = line.split('').map((char) => {
          if (char === ' ') {
            return '<span class="char char-space" style="display: inline-block; width: 0.3em;">&nbsp;</span>';
          }
          return `<span class="char" style="display: inline-block;">${char}</span>`;
        }).join('');
        html += characters + '<br />';
      });

        element.innerHTML = html;

        // Get all character elements (skip spaces) for this element
        const chars = element.querySelectorAll('.char:not(.char-space)');
      if (chars.length === 0) return;

      // Set starting state (hidden, below, small)
      gsap.set(chars, {
        y: 80,
        scale: 0.3,
        opacity: 0
      });

      // Animate each letter sliding up
        const timeline = gsap.timeline({ delay: delay });
      timeline.to(chars, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'back.out(1.4)',
        stagger: {
          amount: 1.0, // Total time for all letters
          from: 'start'
        }
      });
      };

      // Animate h1 first
      if (h1Element) {
        animateTextElement(h1Element, 0.4);
      }

      // Animate h2 after h1 (with delay to start after h1 finishes)
      if (h2Element) {
        animateTextElement(h2Element, 1.4); // Start after h1 animation (0.4 + 1.0)
      }
    };

    // Trigger animation - wait for page to load or loaderComplete event
    const triggerAnimation = () => {
      if (document.readyState === 'complete') {
        setTimeout(animateTitle, 100);
      } else {
        window.addEventListener('load', () => {
          setTimeout(animateTitle, 100);
        }, { once: true });
      }
    };

    // Try to trigger immediately
    triggerAnimation();

    // Also listen for loaderComplete event (in case loader is enabled)
    window.addEventListener('loaderComplete', animateTitle, { once: true });

    // Fallback timeout to ensure animation runs even without loader
    const fallbackTimeout = setTimeout(() => {
      animateTitle();
    }, 500);

    return () => {
      window.removeEventListener('loaderComplete', animateTitle);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // ============================================
  // ODOMETER ANIMATION
  // ============================================
  useEffect(() => {
    const startOdometer = () => {
      if (!odometerRef.current) return;

      // Create odometer starting at 2007
      odometerInstanceRef.current = new Odometer({
        el: odometerRef.current,
        value: 2007,
        format: '',
        theme: 'default',
        duration: 3000
      });

      // After 0.8 seconds, animate to 2025
      setTimeout(() => {
        if (odometerInstanceRef.current) {
          odometerInstanceRef.current.update(2025);
        }
      }, 800);
    };

    // Trigger animation - wait for page to load or loaderComplete event
    const triggerAnimation = () => {
      if (document.readyState === 'complete') {
        setTimeout(startOdometer, 100);
      } else {
        window.addEventListener('load', () => {
          setTimeout(startOdometer, 100);
        }, { once: true });
      }
    };

    // Try to trigger immediately
    triggerAnimation();

    // Also listen for loaderComplete event (in case loader is enabled)
    window.addEventListener('loaderComplete', startOdometer, { once: true });

    // Fallback timeout to ensure animation runs even without loader
    const fallbackTimeout = setTimeout(() => {
      startOdometer();
    }, 500);

    return () => {
      window.removeEventListener('loaderComplete', startOdometer);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // ============================================
  // SCROLLTRIGGER PIN WITH CARD WIDTH ANIMATION
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const leftText = leftTextRef.current;
    const rightText = rightTextRef.current;
    if (!section || !card) return;
    
    // Function to check if screen is above 991px
    const isDesktop = () => {
      return window.innerWidth > 991;
    };

    // Function to get card content elements
    const getCardContent1 = () => {
      return cardContent1Ref.current || card.querySelector('.card-content_1');
    };
    
    const getCardContent2 = () => {
      return cardContent2Ref.current || card.querySelector('.card-content_2');
    };

    // Setup mobile state (no animation)
    const setupMobileState = () => {
      // Ensure card is at natural size
      gsap.set(card, {
        width: 'auto',
        height: 'auto',
        clearProps: 'all'
      });

      // Make text elements visible
      if (leftText && rightText) {
        gsap.set([leftText, rightText], {
          x: 0,
          opacity: 1,
          force3D: true
        });
      }

      // Make card content visible
      const cardContent1 = getCardContent1();
      const cardContent2 = getCardContent2();
      
      if (cardContent1) {
        gsap.set(cardContent1, {
          opacity: 1,
          y: 0,
          display: 'block',
          visibility: 'visible'
        });
      }
      
      if (cardContent2) {
        gsap.set(cardContent2, {
          opacity: 1,
          y: 0,
          display: 'block',
          visibility: 'visible'
        });
      }
    };

    // Get initial card dimensions
    const initialWidth = card.offsetWidth;
    const initialHeight = card.offsetHeight;
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;
    // Reduce by 50px from each side (100px total reduction)
    const targetWidth = sectionWidth - 80; // 50px padding on each side
    const targetHeight = sectionHeight - 150; // 50px padding on each side

    // Smooth easing function (easeInOutCubic)
    const easeInOutCubic = (t) => {
      return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Use GSAP timeline for smoother interpolation
    let sizeTween = null;
    let lastProgress = 0;
    let content1Hidden = false;
    let content2Shown = false;
    let scrollTrigger = null;

    // If mobile, setup mobile state and skip ScrollTrigger
    if (!isDesktop()) {
      setupMobileState();
    }

    // Create ScrollTrigger with pin and width/height animation (desktop only)
    if (isDesktop()) {
      scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=150%', // Increased scroll distance for much slower animation
      pin: true,
      markers:false,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 10, // Increased scrub for smoother, slower feel (2 second lag)
      onUpdate: (self) => {
        // Calculate progress (0 to 1)
        const progress = self.progress;
        
        // Step 1: Stop hover effect immediately when scrolling starts (at 0% or very early)
        if (progress > 0 && !isScrollingRef.current) {
          isScrollingRef.current = true;
          
          // Remove any active hover transforms
    if (hoverMouseMoveHandlerRef.current) {
      document.removeEventListener('mousemove', hoverMouseMoveHandlerRef.current);
    }
    
          // Reset card transform smoothly
    gsap.to(card, {
      x: 0,
      y: 0,
      z: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
            duration: 0.6, // Increased duration for smoother reset
            ease: 'power3.out', // Smoother easing
      onComplete: () => {
        card.style.transform = '';
            }
          });
          
        // Clear glow effect
          const glowElement = card.querySelector('.glow');
        if (glowElement) {
          glowElement.style.backgroundImage = '';
          }
        }
        
        // Step 2: Track if we've already animated at 20%
        const hasAnimatedAt20 = progress >= 0.2;
        const wasBelow20 = lastProgress < 0.2;
        
        // When scroll reaches 20% for the first time, animate to target size
        if (hasAnimatedAt20 && wasBelow20) {
          // Animate to target dimensions once at 20%
          if (sizeTween) {
            sizeTween.kill();
          }
          
          sizeTween = gsap.to(card, {
            width: targetWidth,
            height: targetHeight,
            duration: 1, // Increased duration for much smoother animation
            ease: 'power5.inOut', // Smoother easing curve
            force3D: true,
            overwrite: true
          });
        }
        
        // When scroll goes back below 20%, reset to initial size
        if (progress < 0.2 && lastProgress >= 0.2) {
          // Reset to initial dimensions smoothly
          if (sizeTween) {
            sizeTween.kill();
          }
          
          sizeTween = gsap.to(card, {
            width: initialWidth,
            height: initialHeight,
            duration: 1.5, // Increased duration for smoother reset
            ease: 'power3.out', // Smoother easing curve
            force3D: true,
            overwrite: true
          });
        }
        
        // Re-enable hover effect when scroll goes back to 0% or leaves
        if (progress <= 0.01 && isScrollingRef.current) {
          isScrollingRef.current = false;
        }
        
        // Get elements each time to ensure they're available
        const cardContent1 = getCardContent1();
        const cardContent2 = getCardContent2();
        
        // Calculate current card width to check if it's reached 80% of target
        const currentCardWidth = card.offsetWidth;
        const widthProgress = (currentCardWidth - initialWidth) / (targetWidth - initialWidth);
        const hasReached80Percent = widthProgress >= 0.8;
        
        // Content animation sequence - only start after card reaches 80% width
        // Only animate if elements exist and card has reached 80% width
        if (cardContent1 && cardContent2 && hasReached80Percent) {
          // Calculate progress after 80% width is reached (0-1 range for content animation)
          // Map scroll progress to content animation range (80-100% of scroll = 0-1 for content)
          const contentScrollStart = 0.2; // Card size animation starts at 20%
          const contentAnimationRange = 0.8; // Remaining 80% of scroll for content
          const contentProgress = Math.max(0, (progress - contentScrollStart) / contentAnimationRange);
          
          // 0-25% of content animation: Show card-content_1 (fade in and translate up)
          if (contentProgress >= 0 && contentProgress < 0.25) {
            const content1Progress = contentProgress / 0.25; // Normalize to 0-1
            const opacity1 = Math.min(content1Progress * 2, 1); // Fade in quickly
            const y1 = 30 - (content1Progress * 30); // Translate from 30 to 0
            
            gsap.set(cardContent1, {
              opacity: opacity1,
              y: y1,
              force3D: true
            });
          }
          
          // 25-50% of content animation: Hide card-content_1 (fade out and translate up)
          if (contentProgress >= 0.25 && contentProgress < 0.5) {
            const content1Progress = (contentProgress - 0.25) / 0.25; // Normalize to 0-1
            const opacity1 = 1 - content1Progress; // Fade out
            const y1 = -(content1Progress * 30); // Translate up to -30
            
            gsap.set(cardContent1, {
              opacity: opacity1,
              y: y1,
              force3D: true
            });
          }
          
          // 50-75% of content animation: Show card-content_2 (fade in and translate up)
          if (contentProgress >= 0.5 && contentProgress < 0.75) {
            const content2Progress = (contentProgress - 0.5) / 0.25; // Normalize to 0-1
            const opacity2 = Math.min(content2Progress * 2, 1); // Fade in quickly
            const y2 = 30 - (content2Progress * 30); // Translate from 30 to 0
            
            gsap.set(cardContent2, {
              opacity: opacity2,
              y: y2,
              force3D: true
            });
          }
          
          // 75-100% of content animation: Keep card-content_2 visible (don't hide it)
          if (contentProgress >= 0.75) {
            // Keep card-content_2 fully visible and in position
            gsap.set(cardContent2, {
              opacity: 1,
              y: 0,
              force3D: true
            });
          }
        } else {
          // Keep contents invisible if card hasn't reached 80% width
          if (cardContent1) {
            gsap.set(cardContent1, {
              opacity: 0,
              y: 30,
              force3D: true
            });
          }
          if (cardContent2) {
            gsap.set(cardContent2, {
              opacity: 0,
              y: 30,
              force3D: true
            });
          }
        }
        
        // Reset content states when scrolling back to beginning
        if (progress < 0.2 || !hasReached80Percent) {
          // Reset card-content_1 to invisible
          if (cardContent1) {
            gsap.set(cardContent1, {
              opacity: 0,
              y: 30,
              force3D: true
            });
          }
          // Reset card-content_2 only when scrolling back to very beginning
          if (cardContent2) {
            const contentScrollStart = 0.2;
            const contentAnimationRange = 0.8;
            const contentProgress = Math.max(0, (progress - contentScrollStart) / contentAnimationRange);
            // Only reset if we're before card-content_2 should be shown (before 50% of content animation)
            if (contentProgress < 0.5) {
            gsap.set(cardContent2, {
              opacity: 0,
              y: 30,
              force3D: true
            });
            }
          }
        }
        
        // Animate hero text elements - move to sides and fade out
        if (leftText && rightText) {
          // Start animating text elements when scroll starts (0-30% progress)
          if (progress >= 0 && progress <= 0.3) {
            const textProgress = progress / 0.3; // Normalize to 0-1
            
            // Left text moves left and fades out
            const leftX = -(textProgress * 150); // Move left by 150px
            const leftOpacity = 1 - textProgress; // Fade out
            
            gsap.set(leftText, {
              x: leftX,
              opacity: leftOpacity,
              force3D: true
            });
            
            // Right text moves right and fades out
            const rightX = textProgress * 150; // Move right by 150px
            const rightOpacity = 1 - textProgress; // Fade out
            
            gsap.set(rightText, {
              x: rightX,
              opacity: rightOpacity,
              force3D: true
            });
          } else if (progress > 0.3) {
            // Keep them hidden after 30%
            gsap.set(leftText, {
              x: -150,
              opacity: 0,
              force3D: true
            });
            gsap.set(rightText, {
              x: 150,
              opacity: 0,
              force3D: true
            });
          } else if (progress === 0) {
            // Reset to original position when at start
            gsap.set([leftText, rightText], {
              x: 0,
              opacity: 1,
              force3D: true
            });
          }
        }
        
        // Keep dimensions stable - don't continuously update
        // Dimensions only change at the 20% threshold
        
        lastProgress = progress;
      },
      onEnter: () => {
        // Keep hover effect enabled initially - it will be disabled at 20% progress
        isScrollingRef.current = false;
        
        // Ensure initial dimensions are set immediately when entering (before pin)
        gsap.set(card, { 
          width: initialWidth,
          height: initialHeight,
          clearProps: 'transform' // Clear any transforms
        });
        
        // Reset hero text elements to original position
        if (leftText && rightText) {
          gsap.set([leftText, rightText], {
            x: 0,
            opacity: 1,
            force3D: true
          });
        }
        
        // Get elements each time to ensure they're available
        const cardContent1 = getCardContent1();
        const cardContent2 = getCardContent2();
        
        // Debug: Log if elements are found
        if (!cardContent1 || !cardContent2) {
          console.warn('Card content elements not found:', { 
            cardContent1: !!cardContent1, 
            cardContent2: !!cardContent2,
            cardRef: cardContent1Ref.current,
            cardQuery: card.querySelector('.card-content_1')
          });
        }
        
        // Both contents start invisible - ensure they're set up properly
        if (cardContent1) {
          // Clear any existing GSAP animations
          gsap.killTweensOf(cardContent1);
          gsap.set(cardContent1, {
      opacity: 0,
      y: 30,
            display: 'block',
            visibility: 'visible',
            pointerEvents: 'none',
            clearProps: 'all'
          });
        }
        
        if (cardContent2) {
          // Clear any existing GSAP animations
          gsap.killTweensOf(cardContent2);
      gsap.set(cardContent2, {
        opacity: 0,
            y: 30,
            display: 'block',
            visibility: 'visible',
            pointerEvents: 'none',
            clearProps: 'all'
          });
        }
        
        // Reset content animation states
        content1Hidden = false;
        content2Shown = false;
      },
      onLeave: () => {
        // Re-enable hover effect when scrolling ends
        isScrollingRef.current = false;
        
        // Smoothly animate to target dimensions when leaving
        gsap.to(card, {
          width: targetWidth,
          height: targetHeight,
          duration: 1.0, // Increased duration for smoother transition
          ease: 'power3.out' // Smoother easing
        });
      },
      onEnterBack: () => {
        // Get current card dimensions before resetting
        const currentCardWidth = card.offsetWidth;
        const currentCardHeight = card.offsetHeight;
        
        // If card is already at initial size, don't animate
        const widthDiff = Math.abs(currentCardWidth - initialWidth);
        const heightDiff = Math.abs(currentCardHeight - initialHeight);
        
        if (widthDiff > 5 || heightDiff > 5) {
          // Card is not at initial size, smoothly animate back
          if (sizeTween) {
            sizeTween.kill();
          }
          
          sizeTween = gsap.to(card, {
            width: initialWidth,
            height: initialHeight,
            duration: 1.2, // Smooth transition duration
            ease: 'power3.out',
            force3D: true,
            overwrite: true,
            onComplete: () => {
              // Ensure exact values after animation
              gsap.set(card, {
                width: initialWidth,
                height: initialHeight
              });
            }
          });
        } else {
          // Card is already at initial size, just set it
          gsap.set(card, {
            width: initialWidth,
            height: initialHeight,
            clearProps: 'transform'
          });
        }
        
        // Reset hero text elements when scrolling back
        if (leftText && rightText) {
          gsap.to([leftText, rightText], {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            force3D: true
          });
        }
        
        // Re-enable hover effect when scrolling back
        isScrollingRef.current = false;
      },
      onLeaveBack: () => {
        // Re-enable hover effect when scrolling back up
        isScrollingRef.current = false;
        
        // Smoothly reset to initial dimensions to prevent jump
        if (sizeTween) {
          sizeTween.kill();
        }
        
        sizeTween = gsap.to(card, {
          width: initialWidth,
          height: initialHeight,
          duration: 0.8,
          ease: 'power3.out',
          force3D: true,
          overwrite: true,
          onComplete: () => {
            // Ensure exact values after animation
            gsap.set(card, {
              width: initialWidth,
              height: initialHeight,
              clearProps: 'transform'
            });
          }
        });
      }
    });
    }

    // Handle window resize to enable/disable ScrollTrigger
    const handleResize = () => {
      if (!isDesktop()) {
        // Mobile - kill ScrollTrigger and setup mobile state
        if (scrollTrigger) {
          scrollTrigger.kill();
          scrollTrigger = null;
        }
        if (sizeTween) {
          sizeTween.kill();
        }
        setupMobileState();
      } else {
        // Desktop - refresh ScrollTrigger if it exists, or recreate if needed
        if (!scrollTrigger) {
          // Need to recreate ScrollTrigger - this would require re-running the effect
          // For now, just refresh
          ScrollTrigger.refresh();
        } else {
          ScrollTrigger.refresh();
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sizeTween) {
        sizeTween.kill();
      }
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, []);

  // ============================================
  // JSX (HTML Structure)
  // ============================================
  return (
    <section id="section1" className="section-one active-card--" ref={sectionRef}>

      {/* Center Card */}
      <div className="hero-card-wrapper" ref={wrapperRef}>
            <div className="hero-card p-lg-5" ref={cardRef} style={{ backgroundImage: `url(${recapBg})` }}>
              <div className="glow"></div>
              <div className="card-header">
                <span className="card-dot">
                  <img src={cardDot} alt="Card Dot" />
                </span>
                <span className="card-label">SEE RECAP</span>
                <span className="card-dot">
                  <img src={cardDot} alt="Card Dot" />
                </span>
              </div>
              <div className="card-year font-bebas odometer" ref={odometerRef}>2007</div>

              <div className='moving_text_wrapper'>

                <div className="moving_text_item card-content_1 text-center">
                  <h4>This was athe year we made good on our promise to "crush 2025".</h4>
                </div>
                <div className="moving_text_item card-content_2 text-center">
                  <h4> Fueled by the continued "hustle, heart, and high-fives", this year witnessed us scaling our ambition and achieving exponential impact across every vertical.</h4>
                </div>

              </div>

             

              <button
                className="card-button"
                type="button">
                <span>
                 <svg width="148" height="86" viewBox="0 0 148 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.3 86C22.0333 86 21.7333 85.9 21.4 85.7C19.0667 84.0333 16.6333 81.8333 14.1 79.1C11.6333 76.4333 9.33333 73.3 7.2 69.7C5.06667 66.0333 3.33333 61.9667 2 57.5C0.666667 53.0333 2.98023e-08 48.2 2.98023e-08 43C2.98023e-08 37.8 0.666667 32.9667 2 28.5C3.33333 24.0333 5.06667 20 7.2 16.4C9.33333 12.7333 11.6333 9.56668 14.1 6.90001C16.6333 4.16668 19.0667 1.96668 21.4 0.300011C21.7333 0.10001 22.0333 8.82149e-06 22.3 8.82149e-06C22.9 8.82149e-06 23.2 0.266676 23.2 0.80001C23.2 1.13334 23 1.50001 22.6 1.90001C17.1333 6.83334 13.1333 12.9 10.6 20.1C8.06667 27.2333 6.8 34.8667 6.8 43C6.8 51.1333 8.06667 58.8 10.6 66C13.1333 73.1333 17.1333 79.1667 22.6 84.1C23 84.5 23.2 84.8667 23.2 85.2C23.2 85.7333 22.9 86 22.3 86ZM91.8844 52.7C92.8844 50.5667 93.851 48.7 94.7844 47.1C95.7844 45.5 96.751 44.1667 97.6844 43.1H39.3844V38.9H97.6844C96.751 37.7667 95.7844 36.4 94.7844 34.8C93.851 33.2 92.8844 31.3667 91.8844 29.3H95.3844C99.5844 34.1667 103.984 37.7667 108.584 40.1V41.9C103.984 44.1667 99.5844 47.7667 95.3844 52.7H91.8844ZM125.684 86C125.084 86 124.784 85.7333 124.784 85.2C124.784 84.8667 124.984 84.5 125.384 84.1C130.918 79.1667 134.918 73.1333 137.384 66C139.918 58.8 141.184 51.1333 141.184 43C141.184 34.8667 139.918 27.2333 137.384 20.1C134.918 12.9 130.918 6.83334 125.384 1.90001C124.984 1.50001 124.784 1.13334 124.784 0.80001C124.784 0.266676 125.084 8.82149e-06 125.684 8.82149e-06C126.018 8.82149e-06 126.318 0.10001 126.584 0.300011C128.918 1.96668 131.318 4.16668 133.784 6.90001C136.318 9.56668 138.651 12.7333 140.784 16.4C142.918 20 144.651 24.0333 145.984 28.5C147.318 32.9667 147.984 37.8 147.984 43C147.984 48.2 147.318 53.0333 145.984 57.5C144.651 61.9667 142.918 66.0333 140.784 69.7C138.651 73.3 136.318 76.4333 133.784 79.1C131.318 81.8333 128.918 84.0333 126.584 85.7C126.318 85.9 126.018 86 125.684 86Z" fill="white"/>
                  </svg>


                </span>
              </button>
            </div>
          </div>

      
      <div className="hero-content">
        <div className="hero-main">
          {/* Left Text */}
          <div className="hero-left-text font-bebas" ref={leftTextRef}>
            <div className="title-div focus-title" ref={titleRef}>
              <h1>DEFINING THE</h1>
              <h2>FUTURE</h2>
            </div>
          </div>
          
          
          
          {/* Right Text */}
          <div className="hero-right-text instrument" ref={rightTextRef}>
            <h2>Through<br />Unprecedented<br /><span className="font-italic">Scale and Impact</span></h2>
          </div>
        </div>
      </div>

    </section>
  );
};

export default SectionOne;
