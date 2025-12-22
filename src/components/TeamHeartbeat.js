import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../general.scss';
import './TeamHeartbeat.scss';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const TeamHeartbeat = () => {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);
  const staggerTimeoutsRef = useRef([]);

  // ============================================
  // REVEAL HEADER TITLE ANIMATION WITH SPLITTING
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const titleContainer = section.querySelector('.team-heartbeat-title-container');
    const subtitle = titleContainer?.querySelector('.team-subtitle');
    const title = titleContainer?.querySelector('.team-title');

    if (!titleContainer || !subtitle || !title) return;

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
        if (node.classList.contains('team-bullet')) {
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
      if (index < subtitleWords.length - 1 && !word.classList.contains('team-bullet')) {
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
      
      // Animate subtitle words with translateY
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
      
      // Animate title words with delay and translateY
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

    // Create ScrollTrigger for header reveal with splitting
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
    if (!sceneRef.current) return;

    const { Engine, Render, Events, MouseConstraint, Mouse, World, Bodies, Runner } = Matter;

    // Create an engine with adjusted gravity for faster falling
    const engine = Engine.create();
    engine.world.gravity.y = 0.8; // Increased gravity for faster fall (was 0.3)
    engineRef.current = engine;
    const world = engine.world;

    // Calculate canvas width with max-width constraint
    const MAX_WIDTH = 1440;
    const getCanvasWidth = () => Math.min(window.innerWidth, MAX_WIDTH);
    const getCanvasHeight = () => {
      // Mobile: 500px, Desktop: window.innerHeight
      const isMobile = window.innerWidth < 768;
      return isMobile ? 600 : 1200;
    };

    // Create a renderer with higher quality settings
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: getCanvasWidth(),
        height: getCanvasHeight(),
        pixelRatio: Math.min(window.devicePixelRatio || 2, 3), // Higher pixel ratio for smoother edges (max 3 for performance)
        background: '#000000',
        wireframes: false,
        showAngleIndicator: false,
        showVelocity: false,
        // Disable stroke rendering globally
        hasBounds: false,
      }
    });
    
    // Override default render styles to remove strokes and improve quality
    if (render.options.render) {
      render.options.render.strokeStyle = 'transparent';
      render.options.render.lineWidth = 0;
      // Enable anti-aliasing in Matter.js renderer
      render.options.render.antialias = true;
    }
    renderRef.current = render;

    // Enable better anti-aliasing on canvas with highest quality
    const canvas = render.canvas;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Remove any borders or outlines from canvas - aggressive removal
    canvas.style.border = 'none';
    canvas.style.borderRight = 'none';
    canvas.style.borderLeft = 'none';
    canvas.style.borderTop = 'none';
    canvas.style.borderBottom = 'none';
    canvas.style.outline = 'none';
    canvas.style.boxShadow = 'none';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    
    // Allow vertical scrolling on mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      canvas.style.touchAction = 'pan-y';
      canvas.style.pointerEvents = 'auto';
    }
    
    canvas.setAttribute('style', canvas.getAttribute('style') + '; border: none !important; border-right: none !important;');

    // Get current canvas dimensions
    const canvasWidth = getCanvasWidth();
    const canvasHeight = getCanvasHeight();

    // Create bounds based on canvas width
    const ground = Bodies.rectangle(
      (canvasWidth / 2) + 160,
      canvasHeight + 80,
      canvasWidth + 320,
      160,
      { 
        render: { 
          fillStyle: '#000000',
          strokeStyle: 'transparent',
          lineWidth: 0,
          visible: false
        }, 
        isStatic: true 
      }
    );

    const wallLeft = Bodies.rectangle(
      -80,
      canvasHeight / 2,
      160,
      canvasHeight,
      { 
        isStatic: true,
        render: { 
          fillStyle: '#000000',
          strokeStyle: 'transparent',
          lineWidth: 0,
          visible: false
        }
      }
    );

    const wallRight = Bodies.rectangle(
      canvasWidth + 80,
      canvasHeight / 2,
      160,
      canvasHeight,
      { 
        isStatic: true,
        render: { 
          fillStyle: '#000000',
          strokeStyle: 'transparent',
          lineWidth: 0,
          visible: false
        }
      }
    );

    const roof = Bodies.rectangle(
      (canvasWidth / 2) + 160,
      -80,
      canvasWidth + 320,
      160,
      { 
        isStatic: true,
        render: { 
          fillStyle: '#000000',
          strokeStyle: 'transparent',
          lineWidth: 0,
          visible: false
        }
      }
    );

    // Variables
    // Note: Chamfer radius should be <= half the height (25) for best rendering
    // Using 25 for perfect capsule shape without rendering artifacts
    // Increased chamfer radius slightly for smoother edges
    const radius = isMobile ? 30 : 50; // Adjust based on mobile/desktop height
    const capsuleHeight = 50; // Height of capsules
    const whiteColor = '#FFFFFF';
    const darkBlueColor = '#2D328C';

    // Calculate center positions for centering capsules on screen (based on canvas width)
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Physics properties for faster falling
    const physicsProperties = {
      frictionAir: 0.05, // Reduced air resistance for faster movement (was 0.15)
      friction: 0.1, // Surface friction
      restitution: 0.4, // Slightly more bounce
      density: 0.002, // Higher density for faster acceleration (was 0.001)
      chamfer: { radius: radius },
      render: { 
        fillStyle: whiteColor,
        strokeStyle: 'transparent',
        lineWidth: 0,
        opacity: 0 // Start invisible; fade in smoothly
      }
    };

    // Create capsule-shaped bodies with text labels - centered around screen center
    // Increased widths to add more left/right padding
   

    const projectManagers = Bodies.rectangle(
      centerX - 200, 
      centerY - 100, 
      isMobile ? 250 : 300,  // width: 200px mobile, 300px desktop
      isMobile ? 60 : 100,   // height: 60px mobile, 100px desktop
      {
        ...physicsProperties,
        label: 'PROJECT MANAGERS'
      }
    );

    const adminNinjas = Bodies.rectangle(centerX, 
      centerY + 100, 
      isMobile ? 180 : 220, 
      isMobile ? 60 : 100, 
      {
      ...physicsProperties,
      label: 'ADMIN NINJAS'
    });

    const seoGurus = Bodies.rectangle(centerX - 350, centerY - 200, isMobile ? 160 : 200, isMobile ? 60 : 100, {
      ...physicsProperties,
      label: 'SEO GURUS'
    });

    const dearClients = Bodies.rectangle(centerX + 100, centerY - 150, isMobile ? 180 : 240, isMobile ? 60 : 100, {
      ...physicsProperties,
      label: 'DEAR CLIENTS'
    });

    const devs = Bodies.rectangle(centerX - 20, centerY, isMobile ? 120 : 140, isMobile ? 60 : 100, {
      ...physicsProperties,
      label: 'DEVS'
    });

    const designers = Bodies.rectangle(centerX + 200, centerY - 100, isMobile ? 170 : 220, isMobile ? 60 : 100, {
      ...physicsProperties,
      label: 'DESIGNERS'
    });

    const marketers = Bodies.rectangle(centerX + 250, centerY + 100, isMobile ? 170 : 230, isMobile ? 60 : 100, {
      ...physicsProperties,
      label: 'MARKETERS'
    });

    // Create dark blue circular body with arrow - centered
    const arrowCircleRadius = isMobile ? 60 : 70; // Increased from 50
    const arrowCircle = Bodies.circle(centerX + 50, centerY, arrowCircleRadius, {
      frictionAir: 0.05, // Reduced air resistance for faster movement
      friction: 0.1,
      restitution: 0.4,
      density: 0.002,
      render: { 
        fillStyle: darkBlueColor,
        strokeStyle: 'transparent',
        lineWidth: 0
      },
      label: 'ARROW'
    });

    // Store all capsule bodies for reset functionality
    const capsuleBodies = [
      projectManagers,
      adminNinjas,
      seoGurus,
      dearClients,
      devs,
      designers,
      marketers,
      arrowCircle
    ];

    // Store target positions (where capsules should end up)
    const targetPositions = capsuleBodies.map(body => ({
      x: body.position.x,
      y: body.position.y,
      angle: body.angle
    }));

    // Initially position capsules above the viewport (will be repositioned when animation starts)
    capsuleBodies.forEach((body) => {
      Matter.Body.setPosition(body, {
        x: body.position.x,
        y: -200 // Start above viewport
      });
    });

    bodiesRef.current = { capsuleBodies, targetPositions };

    // Add all bodies to the world
    World.add(engine.world, [
      ground,
      wallLeft,
      wallRight,
      roof,
      ...capsuleBodies
    ]);

    // Custom rendering for text and arrow using Matter.js events
    Events.on(render, 'afterRender', () => {
      const ctx = render.canvas.getContext('2d');
      
      // Ensure high-quality anti-aliasing for smooth edges
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Enable sub-pixel rendering for smoother text
      ctx.textRenderingOptimization = 'optimizeQuality';
      
      const bodies = engine.world.bodies;

      bodies.forEach(body => {
        if (body.label && body.label !== 'ARROW' && body.label !== 'ground' && body.label !== 'wallLeft' && body.label !== 'wallRight' && body.label !== 'roof') {
          // Draw text on capsule bodies
          ctx.save();
          // Apply body opacity if set
          const opacity = body.render && typeof body.render.opacity === 'number' ? body.render.opacity : 1;
          ctx.globalAlpha = opacity;
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold ' + (isMobile ? '16px' : '22px') + ' Arial, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(body.label, 0, 0);
          ctx.restore();
        } else if (body.label === 'ARROW') {
          // Draw SVG arrow icon on circle
          ctx.save();
          ctx.translate(body.position.x, body.position.y);
          ctx.rotate(body.angle);
          
          // Scale the arrow to fit nicely in the circle (radius 50)
          const scale = isMobile ? 0.9 : 1.2; // Scale factor to fit arrow in circle
          const svgWidth = 40; // Increased from 29
          const svgHeight = 38; // Increased from 28
          const centerX = 20; // Adjusted center X
          const centerY = 19; // Adjusted center Y
          
          ctx.scale(scale, scale);
          ctx.translate(-centerX, -centerY);
          
          // Set stroke properties
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2.5 / scale; // Adjust line width for scale
          ctx.lineCap = 'square';
          ctx.lineJoin = 'round';
          
          // Draw the arrow path - scaled up coordinates
          ctx.beginPath();
          // Vertical line
          ctx.moveTo(20, 2);
          ctx.lineTo(20, 36);
          // Right side of arrow
          ctx.moveTo(20, 36);
          ctx.lineTo(37, 19);
          // Left side of arrow
          ctx.moveTo(20, 36);
          ctx.lineTo(3, 19);
          ctx.stroke();
          
          ctx.restore();
        }
      });
    });

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    World.add(world, mouseConstraint);
    render.mouse = mouse;

    // Allow page scrolling in matter.js window
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // Create a runner with normal timing for faster animation
    const runner = Runner.create({
      delta: 1000 / 60, // 60 FPS
      isFixed: true,
      enabled: true
    });
    
    // Speed up the engine timing for faster motion
    engine.timing.timeScale = 1.2; // Faster time scale (1.2 = 120% speed, making it faster)
    runnerRef.current = runner;
    
    // Start the renderer immediately (needed for canvas rendering)
    Render.run(render);
    
    // Don't start the runner yet - it will be controlled by ScrollTrigger

    // Handle resize
    const handleResize = () => {
      const newWidth = getCanvasWidth();
      const newHeight = getCanvasHeight();
      const dpr = Math.min(window.devicePixelRatio || 2, 3);
      
      render.options.width = newWidth;
      render.options.height = newHeight;
      Render.setPixelRatio(render, dpr);
      
      // Re-apply anti-aliasing after resize
      const ctx = render.canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Re-apply touch-action for mobile scrolling
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        render.canvas.style.touchAction = 'pan-y';
        render.canvas.style.pointerEvents = 'auto';
      } else {
        render.canvas.style.touchAction = 'auto';
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
      Render.stop(render);
      Engine.clear(engine);
      if (render.canvas && render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
      render.textures = {};
    };
  }, []);

    // Start physics animation only when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !bodiesRef.current || !runnerRef.current || !renderRef.current) return;

    const { Runner: MatterRunner } = Matter;
    const { capsuleBodies, targetPositions } = bodiesRef.current;
    const runner = runnerRef.current;
    const engine = engineRef.current;
    const render = renderRef.current;

    // Function to calculate title start position
    const getTitleStartY = () => {
      const titleContainer = section.querySelector('.team-heartbeat-title-container');
      if (!titleContainer) return -1; // Fallback
      
      const titleRect = titleContainer.getBoundingClientRect();
      const canvasRect = render.canvas.getBoundingClientRect();
      
      // Calculate Y position relative to canvas (start above the title)
      const titleYRelativeToCanvas = titleRect.bottom - canvasRect.top;
      return titleYRelativeToCanvas - 30; // Start 30px above title bottom
    };

    // Function to reset body positions and start animation
    const startAnimation = () => {
      if (!capsuleBodies || !targetPositions || !engine || !runner) return;

      // Clear any existing stagger timeouts before starting a new sequence
      if (staggerTimeoutsRef.current.length) {
        staggerTimeoutsRef.current.forEach((id) => clearTimeout(id));
        staggerTimeoutsRef.current = [];
      }

      // Start with low gravity for smooth beginning, then accelerate NIDH
      const gravityObj = { value: 0.2 };
      engine.world.gravity.y = 0.2;
      gsap.to(gravityObj, {
        value: 2,
        duration: 0.5,
        ease: 'power3.in',
        onUpdate: function() {
          engine.world.gravity.y = gravityObj.value;
        }
      });

      // Get title position to start capsules from above it
      const titleStartY = getTitleStartY();

      // Position all capsules just above the title, invisible, and make them static first
      capsuleBodies.forEach((body, index) => {
        if (body && targetPositions[index]) {
          Matter.Body.setPosition(body, {
            x: targetPositions[index].x,
            y: titleStartY - 40 // All start from the same Y position
          });
          Matter.Body.setAngle(body, 0);
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(body, 0);
          body.isStatic = true;
          if (!body.render) body.render = {};
          body.render.opacity = 0; // fully transparent at start

          // Staggered drop for each capsule
          const delay = index * 300; // 300ms between each capsule
          const timeoutId = setTimeout(() => {
            // Fade in opacity very smoothly with longer duration
            gsap.fromTo(body.render, 
              { opacity: 0,
                delay: 0.2,
               },
              {
                opacity: 1,
                duration: 1.1,
                ease: 'power4.out' // Softer easing for smoother appearance
              }
            );
            // Release body after fade-in starts, so visibility and movement sync
            setTimeout(() => {
              body.isStatic = false;
              // Start with zero velocity - gravity will gradually increase via GSAP animation above
              Matter.Body.setVelocity(body, { x: 0, y: 0 });
            }, 200);
          }, delay);

          staggerTimeoutsRef.current.push(timeoutId);
        }
      });

      // Start the runner (physics engine) after setup to avoid initial jump
      MatterRunner.run(runner, engine);
    };

    // Function to stop animation when leaving viewport
    const stopAnimation = () => {
      if (runner) {
        MatterRunner.stop(runner);
      }

      // Clear any remaining timeouts when stopping animation
      if (staggerTimeoutsRef.current.length) {
        staggerTimeoutsRef.current.forEach((id) => clearTimeout(id));
        staggerTimeoutsRef.current = [];
      }

      // Reset opacity and freeze capsules to avoid half-visible states
      if (capsuleBodies) {
        capsuleBodies.forEach((body) => {
          if (!body) return;
          if (!body.render) body.render = {};
          body.render.opacity = 0;
          body.isStatic = true;
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(body, 0);
        });
      }
    };

    // Create ScrollTrigger to control animation based on viewport visibility
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 60%', // Start when top of section reaches 80% down viewport
      end: 'bottom 30%', // End when bottom of section reaches 20% up viewport
      onEnter: () => {
        // Start animation when section enters viewport
        startAnimation();
      },
      onEnterBack: () => {
        // Start animation when scrolling back up and section re-enters
        startAnimation();
      },
      onLeave: () => {
        // Stop animation when section leaves viewport (scrolling down)
        stopAnimation();
      },
      onLeaveBack: () => {
        // Stop animation when section leaves viewport (scrolling up)
        stopAnimation();
      }
    });

    // Cleanup
    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="team-heartbeat-section">
      <div className="team-heartbeat-title-container">
        <div className="team-subtitle">
          <span className="team-bullet">■</span>
          OUR TEAM IS THE HEARTBEAT OF GTECH
          <span className="team-bullet">■</span>
        </div>
        
        <h2 className="team-title font-bebas">
          GROWING & THRIVING TOGETHER
        </h2>
      </div>
      <div ref={sceneRef} className="matter-scene"></div>
    </section>
  );
};

export default TeamHeartbeat;
