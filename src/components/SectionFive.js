import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../general.scss';

gsap.registerPlugin(ScrollTrigger);

const SectionFive = () => {
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const teamItemsRef = useRef(null);
  const statsBlockRef = useRef(null);

  const teamItems = [
    'PROJECT MANAGERS',
    'SEO GURUS',
    'DEAR CLIENTS',
    'DEVS',
    'ADMIN NINJAS',
    'DESIGNERS',
    'MARKETERS',
    
  ];

  const arrowRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const statsBlock = statsBlockRef.current;

    if (!section || !statsBlock) return;

    const statTitles = statsBlock.querySelectorAll('.team-stat-title');

    if (statTitles.length === 0) return;

    const titleWordSpans = [];
    statTitles.forEach((title) => {
      const titleText = title.textContent || title.innerText;
      const words = titleText.split(/\s+/).filter(w => w.trim() !== '');
      title.innerHTML = words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
      const spans = title.querySelectorAll('.reveal-word');
      titleWordSpans.push(...Array.from(spans));
    });

    gsap.set(titleWordSpans, {
      opacity: 0,
      y: 80,
      rotationX: -90
    });

    let hasAnimated = false;
    const animateTitles = () => {
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
      start: 'top 70%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateTitles();
      },
      onEnterBack: () => {
        animateTitles();
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
            animateTitles();
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
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        animateTitles();
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.7 && rect.bottom > viewportHeight * 0.3) {
        animateTitles();
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
    const statsBlock = statsBlockRef.current;

    if (!section || !statsBlock) return;

    const revealMeElements = statsBlock.querySelectorAll('.reveal-me');

    if (revealMeElements.length === 0) return;

    const allWordSpans = [];
    revealMeElements.forEach((element) => {
      const elementText = element.textContent || element.innerText;
      const words = elementText.split(/\s+/).filter(w => w.trim() !== '');
      element.innerHTML = words.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
      const wordSpans = element.querySelectorAll('.reveal-word');
      allWordSpans.push(...Array.from(wordSpans));
    });

    gsap.set(allWordSpans, {
      opacity: 0,
      y: 150,
      display: 'inline-block',
      transformStyle: 'preserve-3d'
    });

    let hasAnimated = false;
    const animateRevealMe = () => {
      if (hasAnimated) return;
      hasAnimated = true;

      gsap.to(allWordSpans, {
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
      trigger: statsBlock,
      start: 'top 80%',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animateRevealMe();
      },
      onEnterBack: () => {
        animateRevealMe();
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
            animateRevealMe();
          }
        }
      });
    }, {
      threshold: [0, 0.1, 0.3, 0.5],
      rootMargin: '0px'
    });

    observer.observe(statsBlock);

    const checkInterval = setInterval(() => {
      if (hasAnimated) {
        clearInterval(checkInterval);
        return;
      }
      const rect = statsBlock.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateRevealMe();
        clearInterval(checkInterval);
      }
    }, 100);

    setTimeout(() => {
      const rect = statsBlock.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
        animateRevealMe();
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
    const subtitle = subtitleRef.current;
    const title = titleRef.current;
    const teamItemsContainer = teamItemsRef.current;
    const arrow = arrowRef.current;
    const statsBlock = statsBlockRef.current;

    if (!section || !subtitle || !title || !teamItemsContainer) return;

    const teamItemElements = teamItemsContainer.querySelectorAll('.team-item:not(.team-arrow)');

    const calculatePositions = () => {
      const containerRect = teamItemsContainer.getBoundingClientRect();
      const containerWidth = containerRect.width || 1400;
      const containerHeight = containerRect.height || 500;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      const firstItem = teamItemElements[0];
      const itemWidth = firstItem ? firstItem.offsetWidth : 200;
      const itemHeight = firstItem ? firstItem.offsetHeight : 60;
      
      let arrowWidth = 120;
      let arrowHeight = 120;
      if (window.innerWidth <= 480) {
        arrowWidth = 70;
        arrowHeight = 70;
      } else if (window.innerWidth <= 768) {
        arrowWidth = 80;
        arrowHeight = 80;
      } else if (window.innerWidth <= 1024) {
        arrowWidth = 100;
        arrowHeight = 100;
      }

      const finalPositions = [
        { x: centerX - 300 - itemWidth/2, y: centerY - 30, rotation: -20, zIndex: 1 },
        { x: centerX - 50 - itemWidth/2, y: centerY - 160 - itemHeight/2, rotation: -20, zIndex: 3 },
        { x: centerX - 50 - itemWidth/2, y: centerY - 90 - itemHeight/2, rotation: -20, zIndex: 2 },
        { x: centerX - itemWidth/2, y: centerY - 20 - itemHeight/2, rotation: -20, zIndex: 4 },
        { x: centerX - 80 - itemWidth/2, y: centerY + 30, rotation: 0, zIndex: 1 },
        { x: centerX + 100 - itemWidth/2, y: centerY - 75 - itemHeight/2, rotation: -22, zIndex: 2 },
        { x: centerX + 270 - itemWidth/2, y: centerY + 15 - itemHeight/2, rotation: 32, zIndex: 3 }
      ];

      const arrowPosition = {
        x: centerX - arrowWidth/2 + 80,
        y: centerY - arrowHeight/2 + 20,
        rotation: 0,
        zIndex: 10,
        scale: 1
      };
      
      return { finalPositions, arrowPosition, centerX, centerY, itemWidth, itemHeight, arrowWidth, arrowHeight };
    };

    const { finalPositions, arrowPosition, centerX, centerY, itemWidth, itemHeight, arrowWidth, arrowHeight } = calculatePositions();

    gsap.set([subtitle, title], {
      opacity: 0,
      y: 40
    });

    teamItemElements.forEach((item, index) => {
      const finalPos = finalPositions[index];
      gsap.set(item, {
        opacity: 0,
        x: centerX - itemWidth/2,
        y: -400,
        rotation: 0,
        scale: 0.85,
        zIndex: finalPos.zIndex,
        transformOrigin: 'center center'
      });
    });

    if (arrow) {
      gsap.set(arrow, {
        opacity: 0,
        x: centerX - arrowWidth/2,
        y: -200,
        rotation: 0,
        scale: 0.7,
        zIndex: arrowPosition.zIndex,
        transformOrigin: 'center center'
      });
    }

    const floatingAnimations = [];

    const checkAndShowIfNeeded = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.4;
      
      if (rect.top < triggerPoint - 150 && rect.bottom > 0) {
        gsap.set([subtitle, title], {
          opacity: 1,
          y: 0
        });
        teamItemElements.forEach((item, index) => {
          const finalPos = finalPositions[index];
          gsap.set(item, {
            opacity: 1,
            x: finalPos.x,
            y: finalPos.y,
            rotation: finalPos.rotation,
            scale: 1,
            zIndex: finalPos.zIndex
          });
        });
        if (arrow) {
          gsap.set(arrow, {
            opacity: 1,
            x: arrowPosition.x,
            y: arrowPosition.y,
            rotation: arrowPosition.rotation,
            scale: arrowPosition.scale,
            zIndex: arrowPosition.zIndex
          });
        }
        if (statsBlock) {
          const statColumns = statsBlock.querySelectorAll('.team-stat-column');
          gsap.set(statColumns, {
            opacity: 1,
            y: 0
          });
        }
        return true;
      }
      return false;
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 40%',
        end: 'bottom top',
        toggleActions: 'play none none reverse',
        onEnter: (self) => {
          const rect = section.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const triggerPoint = viewportHeight * 0.4;
          
          if (rect.top < triggerPoint - 150) {
            gsap.set([subtitle, title], {
              opacity: 1,
              y: 0
            });
            teamItemElements.forEach((item, index) => {
              const finalPos = finalPositions[index];
              gsap.set(item, {
                opacity: 1,
                x: finalPos.x,
                y: finalPos.y,
                rotation: finalPos.rotation,
                scale: 1,
                zIndex: finalPos.zIndex
              });
            });
            if (arrow) {
              gsap.set(arrow, {
                opacity: 1,
                x: arrowPosition.x,
                y: arrowPosition.y,
                rotation: arrowPosition.rotation,
                scale: arrowPosition.scale,
                zIndex: arrowPosition.zIndex
              });
            }
            if (statsBlock) {
              const statColumns = statsBlock.querySelectorAll('.team-stat-column');
              gsap.set(statColumns, {
                opacity: 1,
                y: 0
              });
            }
            tl.pause();
          }
        }
      }
    });

    let hasAnimated = false;
    const showContent = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      gsap.set([subtitle, title], {
        opacity: 1,
        y: 0
      });
      teamItemElements.forEach((item, index) => {
        const finalPos = finalPositions[index];
        gsap.set(item, {
          opacity: 1,
          x: finalPos.x,
          y: finalPos.y,
          rotation: finalPos.rotation,
          scale: 1,
          zIndex: finalPos.zIndex
        });
      });
      if (arrow) {
        gsap.set(arrow, {
          opacity: 1,
          x: arrowPosition.x,
          y: arrowPosition.y,
          rotation: arrowPosition.rotation,
          scale: arrowPosition.scale,
          zIndex: arrowPosition.zIndex
        });
      }
      if (statsBlock) {
        const statColumns = statsBlock.querySelectorAll('.team-stat-column');
        gsap.set(statColumns, {
          opacity: 1,
          y: 0
        });
      }
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
        floatingAnimations.forEach(anim => {
          if (anim) anim.kill();
        });
        teamItemElements.forEach(item => {
          gsap.killTweensOf(item);
        });
        if (arrow) {
          gsap.killTweensOf(arrow);
        }
        if (statsBlock) {
          gsap.killTweensOf(statsBlock.querySelectorAll('.team-stat-column'));
        }
      };
    }

    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    })
    .to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4');

    teamItemElements.forEach((item, index) => {
      const finalPos = finalPositions[index];
      
      tl.to(item, {
        opacity: 1,
        x: finalPos.x,
        y: finalPos.y,
        rotation: finalPos.rotation,
        scale: 1,
        zIndex: finalPos.zIndex,
        duration: 1,
        ease: 'back.out(1.1)'
      }, 0.5 + (index * 0.1));
    });

    if (arrow) {
      tl.to(arrow, {
        opacity: 1,
        x: arrowPosition.x,
        y: arrowPosition.y,
        rotation: arrowPosition.rotation,
        scale: arrowPosition.scale,
        zIndex: arrowPosition.zIndex,
        duration: 1.2,
        ease: 'back.out(1.2)'
      }, 0.5 + (3 * 0.1));
    }
    
    const lastCardDelay = 0.5 + ((teamItemElements.length - 1) * 0.1);
    const lastCardDuration = 0.9;
    
    tl.call(() => {
      teamItemElements.forEach((item, index) => {
        const floatY = 12 + Math.random() * 8;
        const floatX = 4 + Math.random() * 6;
        const floatRot = 1.5 + Math.random() * 2.5;
        const duration = 3.5 + Math.random() * 2;
        
        const floatAnim = gsap.to(item, {
          y: `+=${floatY}px`,
          x: `+=${floatX}px`,
          rotation: `+=${floatRot}deg`,
          duration: duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
        
        floatingAnimations.push(floatAnim);
      });

      if (arrow) {
        const arrowFloat = gsap.to(arrow, {
          y: `+=8px`,
          x: `+=3px`,
          rotation: `+=1deg`,
          duration: 4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
        floatingAnimations.push(arrowFloat);
      }
    }, null, lastCardDelay + lastCardDuration + 0.2);

    if (statsBlock) {
      const statColumns = statsBlock.querySelectorAll('.team-stat-column');
      
      gsap.set(statColumns, {
        opacity: 0,
        y: 50
      });

      tl.to(statColumns, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      }, lastCardDelay + lastCardDuration + 0.5);
    }

    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
      floatingAnimations.forEach(anim => {
        if (anim) anim.kill();
      });
      teamItemElements.forEach(item => {
        gsap.killTweensOf(item);
      });
      if (arrow) {
        gsap.killTweensOf(arrow);
      }
      if (statsBlock) {
        gsap.killTweensOf(statsBlock.querySelectorAll('.team-stat-column'));
      }
    };
  }, []);

  return (
    <section 
      id="section5" 
      className="section-five team-section"
      ref={sectionRef}
    >
      {/* <div className="team-subtitle" ref={subtitleRef}>
        <span className="team-bullet">■</span>
        OUR TEAM IS THE HEARTBEAT OF GTECH
        <span className="team-bullet">■</span>
      </div>
      
      <h2 className="team-title font-bebas" ref={titleRef}>
        GROWING & THRIVING TOGETHER
      </h2>
      
      <div className="team-items-container" ref={teamItemsRef}>
        {teamItems.map((item, index) => (
          <div key={index} className="team-item">
            {item}
          </div>
        ))}
        <div className="team-item team-arrow" ref={arrowRef}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div> */}

      <div className="team-stats-block" ref={statsBlockRef}>

        <div className="team-stat-column">
          <h3 className="team-stat-title instrument">Team Growth</h3>
          <p className="team-stat-description reveal-me">
            We surpassed 2024's 25% Team Growth, welcoming a higher percentage of amazing minds into the family.
          </p>
        </div>
        
        <div className="team-stat-column">
          <h3 className="team-stat-title instrument">New Faces</h3>
          <p className="team-stat-description reveal-me">
            We continued to attract a talented team of developers and designers, including roles such as Senior UI/UX Designer, Senior Full Stack Developer, and Project Manager, continuing the tradition of introducing new talents like:
          </p>
          <div className="team-new-faces">
            <div className="team-new-faces-wrapper">
              <div className="team-new-face">(→) Clarel</div>
              <div className="team-new-face">(→) Santhosh</div>
              <div className="team-new-face">(→) Klaudia</div>
              <div className="team-new-face">(→) Clarel</div>
              <div className="team-new-face">(→) Kundan</div>
              <div className="team-new-face">(→) Percy</div>
              <div className="team-new-face">(→) Clarel</div>
            </div>
          </div>
        </div>
        
        <div className="team-stat-column column-spotlight">
          <h3 className="team-stat-title instrument ">Diversity Spotlight</h3>
          <p className="team-stat-description reveal-me">
            Our culture remains a melting pot of cultures, ideas, and creativity. Our secret ingredient for continuous innovation.
          </p>
        </div>
        
      </div>
    </section>
  );
};

export default SectionFive;
