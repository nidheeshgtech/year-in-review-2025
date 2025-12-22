import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionSix = () => {
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const decorativeContainerRef = useRef(null);
  const metricsListRef = useRef(null);

  const metrics = [
    { value: '20', symbol: '(+)', description: 'New Clients Secured' },
    { value: '650', unit: 'K', symbol: '(+)', description: 'Lines of Code' },
    { value: '6000', symbol: '(!)', description: 'Cups of coffee' },
    { value: '60', symbol: '(+)', description: 'Projects Completed' },
    { value: '120', unit: 'K', symbol: '(+)', description: 'Slack Messages' },
    { value: '850', symbol: '(+)', description: 'Design Tasks' }
  ];

  // ============================================
  // REVEAL HEADER TITLE ANIMATION WITH SPLITTING
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const subtitle = subtitleRef.current;
    const title = titleRef.current;

    if (!section || !subtitle || !title) return;

    // Split subtitle into words (preserve bullets)
    const subtitleHTML = subtitle.innerHTML;
    const subtitleTemp = document.createElement('div');
    subtitleTemp.innerHTML = subtitleHTML;
    const subtitleWords = [];
    
    const processSubtitleNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const words = node.textContent.trim().split(/\s+/);
        words.forEach(word => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          subtitleWords.push(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.classList.contains('metrics-bullet')) {
          const wrapper = document.createElement('span');
          wrapper.className = 'reveal-word';
          wrapper.innerHTML = node.outerHTML;
          subtitleWords.push(wrapper);
        } else {
          Array.from(node.childNodes).forEach(child => processSubtitleNode(child));
        }
      }
    };
    
    Array.from(subtitleTemp.childNodes).forEach(child => processSubtitleNode(child));
    subtitle.innerHTML = '';
    subtitleWords.forEach((word, index) => {
      subtitle.appendChild(word);
      if (index < subtitleWords.length - 1 && !word.classList.contains('metrics-bullet')) {
        subtitle.appendChild(document.createTextNode(' '));
      }
    });
    const subtitleWordSpans = subtitle.querySelectorAll('.reveal-word');

    // Split title into words
    const titleText = title.textContent || title.innerText;
    const titleWords = titleText.split(/\s+/).filter(w => w.trim() !== '');
    title.innerHTML = titleWords.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    const titleWordSpans = title.querySelectorAll('.reveal-word');

    // Set initial state for all words
    gsap.set([...subtitleWordSpans, ...titleWordSpans], {
      opacity: 0,
      y: 80,
      rotationX: -90
    });

    // Animation function
    let hasAnimated = false;
    const animateHeaders = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      
      // Animate subtitle words (like team-subtitle) with translateY
      gsap.to(subtitleWordSpans, {
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
      
      // Animate title words with delay (like team-title) with translateY
      gsap.to(titleWordSpans, {
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
        animateHeaders();
      },
      onEnterBack: () => {
        animateHeaders();
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
            animateHeaders();
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
        animateHeaders();
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
        animateHeaders();
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
    const section = sectionRef.current;
    const subtitle = subtitleRef.current;
    const title = titleRef.current;
    const decorativeContainer = decorativeContainerRef.current;
    const metricsList = metricsListRef.current;

    if (!section || !subtitle || !title || !decorativeContainer) return;

    // Get all decorative elements
    const decorativeElements = decorativeContainer.querySelectorAll('.metrics-decorative');

    // Set initial states for text
    gsap.set([subtitle, title], {
      opacity: 0,
      y: 30
    });

    // Set initial states for decorative elements - start from different positions and scales
    decorativeElements.forEach((el, index) => {
      const isLeft = index < 3; // First 3 are on the left
      const isTop = index === 0 || index === 3; // Top positions
      const isBottom = index === 2 || index === 5; // Bottom positions
      
      gsap.set(el, {
        opacity: 0,
        scale: 0.3,
        x: isLeft ? -100 : 100, // Slide in from left or right
        y: isTop ? -80 : isBottom ? 80 : 0, // Slide in from top or bottom
        rotation: isLeft ? -15 : 15 // Slight rotation
      });
    });

    // Check if section is already past trigger point (for fast scrolling scenarios)
    const checkAndShowIfNeeded = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // If section is already well past viewport (fast scrolling), show immediately
      if (rect.top < -150 && rect.bottom > 0) {
        gsap.set([subtitle, title], {
          opacity: 1,
          y: 0
        });
        gsap.set(decorativeElements, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0
        });
        return true; // Already visible, skip animation
      }
      return false; // Not yet visible, let animation play
    };

    // Create ScrollTrigger timeline for decorative elements, subtitle, and title - start when section enters viewport
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
            gsap.set([subtitle, title], {
              opacity: 1,
              y: 0
            });
            gsap.set(decorativeElements, {
              opacity: 1,
              scale: 1,
              x: 0,
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
      gsap.set([subtitle, title], {
        opacity: 1,
        y: 0
      });
      gsap.set(decorativeElements, {
        opacity: 1,
        scale: 1,
        x: 0,
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
          if (trigger.vars.trigger === section || trigger.vars.trigger === metricsList) {
            trigger.kill();
          }
        });
        decorativeElements.forEach(el => {
          gsap.killTweensOf(el);
        });
        if (metricsList) {
          const metricItems = metricsList.querySelectorAll('.metric-item');
          metricItems.forEach(item => {
            gsap.killTweensOf(item);
          });
        }
      };
    }

    // Animate decorative elements first - with stagger
    tl.to(decorativeElements, {
      opacity: 1, // Final semi-transparent state
      scale: 1,
      x: 0,
      y: 0,
      // rotation: 0,
      duration: 1.2,
      ease: 'back.out(1.4)',
      stagger: {
        amount: 0.6,
        from: 'random'
      },
      onComplete: () => {
        hasAnimated = true;
      }
    }, 0) // Start immediately
    // Animate subtitle
    .to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4')
    // Animate title
    .to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4');

    // Animate metrics list separately when section is visible
    if (metricsList) {
      const metricItems = metricsList.querySelectorAll('.metric-item');
      
      if (metricItems.length === 0) {
        console.warn('No metric items found');
        return;
      }
      
      // Set initial state for metrics container
      gsap.set(metricItems, {
        opacity: 0,
        y: 50,
        scale: 0.9
      });

      // Get all text elements within each metric item
      metricItems.forEach((item, index) => {
        const metricValue = item.querySelector('.metric-value');
        const metricNumber = item.querySelector('.metric-number');
        const metricUnit = item.querySelector('.metric-unit');
        const metricSymbol = item.querySelector('.metric-symbol');
        const metricDescription = item.querySelector('.metric-description');

        // Set initial states for text elements
        if (metricNumber) {
          gsap.set(metricNumber, {
            opacity: 0,
            y: 30,
            scale: 0.8
          });
        }
        if (metricUnit) {
          gsap.set(metricUnit, {
            opacity: 0,
            x: -10,
            scale: 0.8
          });
        }
        if (metricSymbol) {
          gsap.set(metricSymbol, {
            opacity: 0,
            scale: 0,
            rotation: 180
          });
        }
        if (metricDescription) {
          gsap.set(metricDescription, {
            opacity: 0,
            x: 30,
            scale: 0.8,
            rotationY: 15
          });
        }
      });

      // Use the metrics list container as trigger
      const triggerElement = metricsList;
      
      // Check if metrics are already past trigger point (for fast scrolling scenarios)
      const checkMetricsAndShowIfNeeded = () => {
        const rect = triggerElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const triggerPoint = viewportHeight * 0.8; // 80% from top
        
        // If metrics top is already well past the trigger point (fast scrolling), show immediately
        if (rect.top < triggerPoint - 150 && rect.bottom > 0) {
          gsap.set(metricItems, {
            opacity: 1,
            y: 0,
            scale: 1
          });
          // Show all text elements within metrics
          metricItems.forEach((item) => {
            const metricNumber = item.querySelector('.metric-number');
            const metricUnit = item.querySelector('.metric-unit');
            const metricSymbol = item.querySelector('.metric-symbol');
            const metricDescription = item.querySelector('.metric-description');
            
            if (metricNumber) {
              gsap.set(metricNumber, {
                opacity: 1,
                y: 0,
                scale: 1
              });
              // Set final value immediately
              const finalValue = metricNumber.textContent.trim();
              const numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) || 0;
              metricNumber.textContent = numericValue.toString();
            }
            if (metricUnit) {
              gsap.set(metricUnit, {
                opacity: 1,
                x: 0,
                scale: 1
              });
            }
            if (metricSymbol) {
              gsap.set(metricSymbol, {
                opacity: 1,
                scale: 1,
                rotation: 0
              });
            }
            if (metricDescription) {
              gsap.set(metricDescription, {
                opacity: 1,
                x: 0,
                scale: 1,
                rotationY: 0
              });
            }
          });
          return true; // Already visible, skip animation
        }
        return false; // Not yet visible, let animation play
      };
      
      // Create separate ScrollTrigger timeline for metric-items
      const metricsTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top 80%', // Trigger when metrics list top reaches 80% down viewport
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers: false, // Set to true for debugging
          immediateRender: false,
          onEnter: (self) => {
            // Check if fast scrolling - if metrics are already well past trigger point
            const rect = triggerElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const triggerPoint = viewportHeight * 0.8;
            
            // Only show immediately if we've scrolled past quickly (more than 150px past trigger)
            if (rect.top < triggerPoint - 150) {
              // Fast scrolling detected - show immediately
              gsap.set(metricItems, {
                opacity: 1,
                y: 0,
                scale: 1
              });
              // Show all text elements within metrics
              metricItems.forEach((item) => {
                const metricNumber = item.querySelector('.metric-number');
                const metricUnit = item.querySelector('.metric-unit');
                const metricSymbol = item.querySelector('.metric-symbol');
                const metricDescription = item.querySelector('.metric-description');
                
                if (metricNumber) {
                  gsap.set(metricNumber, {
                    opacity: 1,
                    y: 0,
                    scale: 1
                  });
                  // Set final value immediately
                  const finalValue = metricNumber.textContent.trim();
                  const numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) || 0;
                  metricNumber.textContent = numericValue.toString();
                }
                if (metricUnit) {
                  gsap.set(metricUnit, {
                    opacity: 1,
                    x: 0,
                    scale: 1
                  });
                }
                if (metricSymbol) {
                  gsap.set(metricSymbol, {
                    opacity: 1,
                    scale: 1,
                    rotation: 0
                  });
                }
                if (metricDescription) {
                  gsap.set(metricDescription, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    rotationY: 0
                  });
                }
              });
              // Pause timeline since we've already shown content
              metricsTl.pause();
            }
            // Otherwise, let the timeline play normally for smooth animation
          }
        }
      });
      
      // Check on mount if already past trigger point
      if (checkMetricsAndShowIfNeeded()) {
        // Fast scrolling detected, don't play animation
      }

      // Animate metrics containers with stagger - faster and starts earlier
      metricsTl.to(metricItems, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.2)',
        stagger: {
          amount: 0.25, // Reduced from 0.4 for faster stagger
          from: 'start'
        },
        onComplete: () => {
          // After containers appear, animate text elements within each
          metricItems.forEach((item, index) => {
            const metricNumber = item.querySelector('.metric-number');
            const metricUnit = item.querySelector('.metric-unit');
            const metricSymbol = item.querySelector('.metric-symbol');
            const metricDescription = item.querySelector('.metric-description');

            // Create timeline for this metric's text animation with stagger
            const textTl = gsap.timeline({
              delay: index * 0.1 // Reduced from 0.15 for faster stagger
            });

            // Animate number with counter animation
            if (metricNumber) {
              // Store the original/final value
              const finalValue = metricNumber.textContent.trim();
              // Extract numeric value (remove any non-digit characters)
              const numericValue = parseInt(finalValue.replace(/[^\d]/g, '')) || 0;
              
              // Set initial state - start at 0
              metricNumber.textContent = '0';
              
              // First animate the appearance (opacity, scale, position)
              textTl.to(metricNumber, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.25, // Reduced from 0.35
                ease: 'back.out(1.4)'
              });
              
              // Then animate the counter - faster
              const counterObj = { value: 0 };
              textTl.to(counterObj, {
                value: numericValue,
                duration: 1.0, // Reduced from 1.5 for faster counter
                ease: 'power2.out',
                onUpdate: function() {
                  const currentValue = Math.floor(counterObj.value);
                  metricNumber.textContent = currentValue.toString();
                },
                onComplete: function() {
                  // Ensure final value is exact (in case of any rounding issues)
                  metricNumber.textContent = finalValue;
                }
              }, '-=0.1'); // Start slightly before appearance animation ends
            }

            // Animate unit (if exists)
            if (metricUnit) {
              textTl.to(metricUnit, {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.25, // Reduced from 0.3
                ease: 'power2.out'
              }, '-=0.2');
            }

            // Animate symbol
            if (metricSymbol) {
              textTl.to(metricSymbol, {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.25, // Reduced from 0.3
                ease: 'back.out(1.6)'
              }, '-=0.25');
            }

            // Animate description with unique slide-in and scale effect
            if (metricDescription) {
              textTl.to(metricDescription, {
                opacity: 1,
                x: 0,
                scale: 1,
                rotationY: 0,
                duration: 0.6,
                ease: 'back.out(1.4)'
              }, '-=0.1');
            }
          });
        }
      });
    }

    // Add subtle floating animations after initial animation
    tl.call(() => {
      decorativeElements.forEach((el, index) => {
        // Create unique floating animation for each element
        const floatY = 8 + Math.random() * 6;
        const floatX = 5 + Math.random() * 4;
        const floatRot = 1 + Math.random() * 2;
        const duration = 4 + Math.random() * 2;
        
        gsap.to(el, {
          y: `+=${floatY}px`,
          x: `+=${floatX}px`,
          rotation: `+=${floatRot}deg`,
          duration: duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: index * 0.2 // Stagger the floating start
        });
      });
    }, null, 1.2); // Start floating after decorative elements have appeared

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section || trigger.vars.trigger === metricsList) {
          trigger.kill();
        }
      });
      // Kill all decorative element animations
      decorativeElements.forEach(el => {
        gsap.killTweensOf(el);
      });
      // Kill metrics list animations
      if (metricsList) {
        const metricItems = metricsList.querySelectorAll('.metric-item');
        metricItems.forEach(item => {
          gsap.killTweensOf(item);
        });
      }
    };
  }, []);

  return (
    <section 
      id="section6" 
      className="section-six metrics-section"
      ref={sectionRef}
    >

      <div className="metrics-container">
        <div className="metrics-background" ref={decorativeContainerRef}>
          {/* Decorative numbers */}
          <div className="metrics-decorative metrics-decorative-top-left instrument">(2)</div>
          <div className="metrics-decorative metrics-decorative-mid-left instrument">(0)</div>
          <div className="metrics-decorative metrics-decorative-bottom-left instrument">(+)</div>
          <div className="metrics-decorative metrics-decorative-top-right instrument">(2)</div>
          <div className="metrics-decorative metrics-decorative-mid-right instrument">(+)</div>
          <div className="metrics-decorative metrics-decorative-bottom-right instrument">(5)</div>
        </div>
        
        <div className="metrics-content">
          <div className="metrics-subtitle" ref={subtitleRef}>
            <span className="metrics-bullet">■</span>
            KEY METRICS & SUCCESS INDICATORS
            <span className="metrics-bullet">■</span>
          </div>
          
          <h2 className="metrics-title font-bebas" ref={titleRef}>
            METRICS OF SUCCESS
          </h2>
        </div>
      </div>

      <div className='metrics-content-list' ref={metricsListRef}>
        {metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <div className="metric-value">
              <span className="metric-number">{metric.value}</span>
              {metric.unit && <span className="metric-unit">{metric.unit}</span>}
              <span className="metric-symbol instrument">{metric.symbol}</span>
            </div>
            <div className="metric-description">{metric.description}</div>
          </div>
        ))}
      </div>




    </section>
  );
};

export default SectionSix;
