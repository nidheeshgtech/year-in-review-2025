import React, { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import Loader from './components/Loader'; // Disabled for now
import Menu from './components/Menu';
// import SectionOne from './components/SectionOne'; // Commented out - replaced with Hero
import Hero from './components/Hero';
import SectionTwo from './components/SectionTwo';
import SectionThree from './components/SectionThree';
import SectionFour from './components/SectionFour';
import CorporateSection from './components/CorporateSection';
import SectionFive from './components/SectionFive';
import SectionSix from './components/SectionSix';
import SectionSeven from './components/SectionSeven';
import TeamHeartbeat from './components/TeamHeartbeat';
import GtechTechnologies from './components/GtechTechnologies';
import Footer from './components/Footer';
import './App.scss';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll with slower, smoother settings
    const lenis = new Lenis({
      duration: 0.75, // Increased for slower scroll
      // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1, // Lower value = slower scroll (was 0.5)
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.08, // Slightly higher for better responsiveness while still smooth
      syncTouch: false,
      touchInertiaMultiplier: 30,
      wheelInertiaMultiplier: 30,
    });

    // Store the raf function reference for proper cleanup
    let rafId;

    // Create an optimized animation frame function
    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      rafId = requestAnimationFrame(raf);
    };

    // Start the animation loop
    rafId = requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger - update on every scroll event
    lenis.on('scroll', ScrollTrigger.update);

    // Handle resize events
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize, { passive: true });

    // Refresh ScrollTrigger after Lenis is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // Cleanup function
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ============================================
  // GLOBAL REVEAL ANIMATION FOR .reveal-global CLASS
  // ============================================
  useEffect(() => {
    // Function to initialize reveal animations for all .reveal-global elements
    const initRevealGlobal = () => {
      const revealElements = document.querySelectorAll('.reveal-global');
      if (revealElements.length === 0) return;

      revealElements.forEach((element) => {
        // Skip if already animated
        if (element.dataset.revealAnimated === 'true') return;

        // Set initial state - hidden and moved down
        gsap.set(element, {
          opacity: 0,
          y: 60,
          force3D: true
        });

        // Mark as initialized
        element.dataset.revealAnimated = 'true';

        // Animation function
        let hasAnimated = false;
        const animateElement = () => {
          if (hasAnimated) return;
          hasAnimated = true;

          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            force3D: true
          });
        };

        // Create ScrollTrigger for this element
        const revealTrigger = ScrollTrigger.create({
          trigger: element,
          start: 'top 80%', // Start when element top reaches 80% from top
          end: 'bottom top',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            animateElement();
          },
          onEnterBack: () => {
            animateElement();
          }
        });

        // Fail-safe: IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
              const rect = entry.boundingClientRect;
              const viewportHeight = window.innerHeight;
              // Trigger when element top is at 80% of viewport
              if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
                animateElement();
              }
            }
          });
        }, {
          threshold: [0, 0.1, 0.3],
          rootMargin: '0px'
        });

        observer.observe(element);

        // Fail-safe: Check if already in viewport on mount
        setTimeout(() => {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > 0) {
            animateElement();
          }
        }, 100);

        // Final fail-safe: Force animation after 1 second if not triggered
        setTimeout(() => {
          if (!hasAnimated) {
            animateElement();
          }
        }, 1000);

        // Store cleanup references on element
        element._revealCleanup = () => {
          observer.disconnect();
          if (revealTrigger) {
            revealTrigger.kill();
          }
        };
      });
    };

    // Initialize on mount
    setTimeout(() => {
      initRevealGlobal();
    }, 200);

    // Watch for new elements added dynamically (MutationObserver)
    const observer = new MutationObserver(() => {
      initRevealGlobal();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Refresh ScrollTrigger
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Cleanup
    return () => {
      observer.disconnect();
      // Cleanup all reveal elements
      const revealElements = document.querySelectorAll('.reveal-global');
      revealElements.forEach((element) => {
        if (element._revealCleanup) {
          element._revealCleanup();
        }
      });
    };
  }, []);

  return (
    <div className="App font-archivo">
      {/* <Loader /> */}
      <Menu />
      {/* <SectionOne /> */}
      <Hero />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <CorporateSection />
      <TeamHeartbeat />
      <SectionFive />
      <SectionSix />
      <SectionSeven />
      <GtechTechnologies />
      <Footer />
    </div>
  );
}

export default App;

