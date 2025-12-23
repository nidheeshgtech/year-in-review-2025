import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import afresco from '../images/afresco.webp';
import ai71 from '../images/ai71.webp';
import gbc from '../images/gbc.webp';
import gets from '../images/gets.webp';
import icom from '../images/icom.webp';
import yde from '../images/yde.webp';
import '../general.scss';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const SectionFour = () => {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const projectsListRef = useRef(null);
  const hoverImageRef = useRef(null);

  // ============================================
  // REVEAL HEADER TITLE ANIMATION WITH SPLITTING
  // ============================================
  useEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const title = titleRef.current;

    if (!section || !label || !title) return;

    // Hide label and title immediately to prevent flash of content
    gsap.set([label, title], {
      opacity: 0,
      visibility: 'hidden'
    });

    // Split label into words
    const labelText = label.textContent || label.innerText;
    const labelWords = labelText.split(/\s+/).filter(w => w.trim() !== '');
    label.innerHTML = labelWords.map(word => `<span class="reveal-word">${word}</span>`).join(' ');
    const labelWordSpans = label.querySelectorAll('.reveal-word');

    // Split title into words (preserve HTML structure)
    const titleHTML = title.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = titleHTML;
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
        if (node.tagName === 'BR') {
          titleWords.push(document.createElement('br'));
        } else if (node.tagName === 'SPAN' && node.classList.contains('instrument')) {
          const wrapper = document.createElement('span');
          wrapper.className = 'reveal-word';
          wrapper.innerHTML = node.outerHTML;
          titleWords.push(wrapper);
        } else {
          Array.from(node.childNodes).forEach(child => processTitleNode(child));
        }
      }
    };
    
    Array.from(tempDiv.childNodes).forEach(child => processTitleNode(child));
    title.innerHTML = '';
    titleWords.forEach((word, index) => {
      if (word.tagName === 'BR') {
        title.appendChild(word);
      } else {
        title.appendChild(word);
        if (index < titleWords.length - 1 && titleWords[index + 1]?.tagName !== 'BR') {
          title.appendChild(document.createTextNode(' '));
        }
      }
    });
    const titleWordSpans = title.querySelectorAll('.reveal-word');

    // Make label and title visible, but keep words hidden
    gsap.set([label, title], {
      opacity: 1,
      visibility: 'visible'
    });
    
    // Set initial state for all words
    gsap.set([...labelWordSpans, ...titleWordSpans], {
      opacity: 0,
      y: 80,
      rotationX: -90
    });

    // Animation function
    let hasAnimated = false;
    const animateHeaders = () => {
      if (hasAnimated) return;
      hasAnimated = true;
      
      // Ensure label and title are visible
      gsap.set([label, title], {
        opacity: 1,
        visibility: 'visible'
      });
      
      // Animate label words (like team-subtitle) with translateY
      gsap.to(labelWordSpans, {
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
      
      // Animate title words with delay (same style as team-subtitle) with translateY
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

  const projects = [
    { name: 'ICOM 2025', label: 'Events', description: '', image: icom, link: 'https://dubai2025.icom.museum/' },
    { name: 'ai71', label: 'Events', description: '', image: ai71, link: 'https://ai71.ai/' },
    { name: 'Afresco', label: 'Branding', description: '', image: afresco, link: 'https://afresco.com/' },
    { name: 'Gender Balance Council UAE', label: '', image: gbc, link: 'https://pledge.gbc.gov.ae/' },
    { name: 'GETS', label: 'Events', description: '', image: gets, link:'https://gets.ae/' },
    { name: 'Yellow Door Energy', label: 'Events', description: '', image: yde, link:'https://yellowdoorenergy.com/' }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const projectsList = projectsListRef.current;

    if (!section || !label || !title || !description || !projectsList) return;

    // Note: Label and title are already split by the reveal animation useEffect above
    // We don't need to manipulate them here - they're handled exclusively by the reveal animation

    // Split description into words
    const descText = description.textContent || description.innerText;
    const descWords = descText.split(/\s+/).filter(w => w.trim() !== '');
    description.innerHTML = descWords.map(word => `<span class="word">${word}</span>`).join(' ');
    const descWordElements = description.querySelectorAll('.word');

    // Note: Project items are handled by dedicated fade-in-up animation useEffect

    // Set initial states
    // Note: Label and title are handled by reveal animation useEffect - don't set initial states here
    // Note: Project items are handled by dedicated fade-in-up animation useEffect - don't set initial states here
    // Only set initial state for description
    gsap.set([...descWordElements], {
      opacity: 0,
      y: 40,
    });

    // Check if section is already past trigger point (for fast scrolling scenarios)
    const checkAndShowIfNeeded = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.6; // 60% from top
      
      // If section top is already well past the trigger point (fast scrolling), show immediately
      if (rect.top < triggerPoint - 150 && rect.bottom > 0) {
        // Note: Label and title are handled by reveal animation useEffect - don't touch them here
        // Note: Project items are handled by dedicated fade-in-up animation useEffect - don't touch them here
        gsap.set([...descWordElements], {
          opacity: 1,
          y: 0
        });
        return true; // Already visible, skip animation
      }
      return false; // Not yet visible, let animation play
    };

    // Create ScrollTrigger timeline - start when section enters viewport
    // Note: Label and title animations are handled by the reveal animation useEffect
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        // markers:true,
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
            // Note: Label and title are handled by reveal animation useEffect - don't touch them here
            // Note: Project items are handled by dedicated fade-in-up animation useEffect - don't touch them here
            gsap.set([...descWordElements], {
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
      // Note: Label and title are handled by reveal animation useEffect - don't touch them here
      // Note: Project items are handled by dedicated fade-in-up animation useEffect - don't touch them here
      gsap.set([...descWordElements], {
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

    // Note: Label and title are animated by the reveal animation useEffect
    // Note: Project items are animated by dedicated fade-in-up animation useEffect
    // We only animate description here
    // Animate description
    tl.to(descWordElements, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: {
        amount: 0.6,
        from: 'start'
      },
      onComplete: () => {
        hasAnimated = true;
      }
    }, '-=0.4');

    // Hide hover image when scrolling past section
    ScrollTrigger.create({
      trigger: section,
      start: 'bottom bottom',
      onEnter: () => {
        // Hide hover image when section is completely scrolled past
        const hoverImage = hoverImageRef.current;
        if (hoverImage) {
          gsap.set(hoverImage, {
            opacity: 0,
            zIndex: 0
          });
          const revealInner = hoverImage.querySelector('.reveal-inner');
          const revealImage = hoverImage.querySelector('.reveal-image');
          if (revealInner && revealImage) {
            gsap.set([revealInner, revealImage], {
              y: '0%'
            });
          }
        }
      },
      onEnterBack: () => {
        // Allow hover image again when scrolling back into section
        // The image will show again on hover
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

  // ============================================
  // PROJECT HOVER IMAGE EFFECT
  // ============================================
  useEffect(() => {
    const hoverImage = hoverImageRef.current;
    const projectsList = projectsListRef.current;
    
    if (!hoverImage || !projectsList) return;

    const revealInner = hoverImage.querySelector('.reveal-inner');
    const revealImage = hoverImage.querySelector('.reveal-image');
    const closeButton = hoverImage.querySelector('.project-hover-image-close');
    
    if (!revealInner || !revealImage) return;

    const projectItems = projectsList.querySelectorAll('.project-item');
    let currentImageSrc = '';
    let lastMouseY = 0;
    let direction = { y: 0 };
    let currentTimeline = null;
    let isMobile = false;
    let activeItem = null;

    // Detect if mobile/touch device
    const checkMobile = () => {
      return window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    };

    isMobile = checkMobile();

    // Handle window resize
    const handleResize = () => {
      const wasMobile = isMobile;
      isMobile = checkMobile();
      // If switching from mobile to desktop or vice versa, hide image
      if (wasMobile !== isMobile && currentImageSrc) {
        hideImage();
      }
    };

    window.addEventListener('resize', handleResize);

    // Set initial state for hover image
    gsap.set(hoverImage, {
      opacity: 0,
      left: 0,
      top: 0,
      zIndex: 0
    });

    gsap.set([revealInner, revealImage], {
      y: '0%'
    });

    // Hide image function
    const hideImage = () => {
      currentImageSrc = '';
      direction.y = 0;
      lastMouseY = 0;
      activeItem = null;
      
      // Kill any existing animations
      gsap.killTweensOf(revealInner);
      gsap.killTweensOf(revealImage);
      if (currentTimeline) {
        currentTimeline.kill();
      }
      
      // Reset reveal elements
      gsap.set([revealInner, revealImage], {
        y: '0%'
      });
      
      // Animate image out
      gsap.to(hoverImage, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(hoverImage, { 
            zIndex: 0,
            left: 0,
            top: 0,
            transform: 'none'
          });
          gsap.set([revealInner, revealImage], { y: '0%' });
          
          // Clear image source
          if (revealImage) {
            revealImage.src = '';
          }
          
          document.removeEventListener('mousemove', handleMouseMove);
        }
      });
    };

    // Mouse move handler - track direction and position (desktop only)
    const handleMouseMove = (e) => {
      if (isMobile || !currentImageSrc) return;
      
        // Calculate direction based on mouse movement
        const deltaY = e.clientY - lastMouseY;
        direction.y = deltaY;
        lastMouseY = e.clientY;
        
        // Update image position
        gsap.to(hoverImage, {
          left: e.clientX + 20,
          top: e.clientY + 20,
        transform: 'none',
          duration: 0.4,
          ease: 'power2.out'
        });
    };

    // Show image with direction-based reveal
    const showImage = (imageSrc, posX, posY, isClick = false) => {
      // Kill any existing animations
      gsap.killTweensOf(revealInner);
      gsap.killTweensOf(revealImage);
      if (currentTimeline) {
        currentTimeline.kill();
      }
      
      // Set image source
      revealImage.src = imageSrc;
      
      // Set initial states
      hoverImage.style.opacity = '1';
      revealInner.style.opacity = '1';
      gsap.set(hoverImage, { zIndex: 1000 });
      
      // Position image
      if (isMobile && posY !== undefined) {
        // Mobile: position below the clicked item, centered
        // Ensure image doesn't go off screen
        const imageHeight = window.innerWidth <= 480 ? 220 : 250;
        const maxTop = window.innerHeight - imageHeight - 20;
        const calculatedTop = Math.min(posY + 20, maxTop);
        
        gsap.set(hoverImage, {
          top: Math.max(20, calculatedTop),
          left: '50%',
          transform: 'translateX(-50%)'
        });
      } else if (posX !== undefined && posY !== undefined) {
        // Desktop: position at mouse with offset
        gsap.set(hoverImage, {
          left: posX,
          top: posY,
          transform: 'none'
        });
      }
      
      // Create timeline for reveal animation
      currentTimeline = gsap.timeline({
        onStart: () => {
          hoverImage.style.opacity = '1';
          revealInner.style.opacity = '1';
          gsap.set(hoverImage, { zIndex: 1000 });
        }
      })
      // Animate the reveal inner wrapper
      .to(revealInner, {
        duration: 0.5,
        ease: 'power3.out',
        startAt: { y: direction.y < 0 ? '-100%' : '100%' },
        y: '0%'
      })
      // Animate the image element (opposite direction)
      .to(revealImage, {
        duration: 0.5,
        ease: 'power3.out',
        startAt: { y: direction.y < 0 ? '100%' : '-100%' },
        y: '0%'
      }, 0); // Start at same time as revealInner
    };

    // Mouse enter handler (desktop)
    const handleMouseEnter = (e, imageSrc) => {
      if (isMobile) return;
      
      const item = e.currentTarget;
      
      // If hovering the same item, don't do anything
      if (activeItem === item && currentImageSrc === imageSrc) {
        return;
      }
      
      currentImageSrc = imageSrc;
      activeItem = item;
      
      // Calculate direction based on mouse position relative to item center
      const itemRect = item.getBoundingClientRect();
      const itemCenterY = itemRect.top + itemRect.height / 2;
      const mouseYPos = e.clientY;
      
      // Determine direction
      if (lastMouseY === 0) {
        direction.y = mouseYPos < itemCenterY ? -1 : 1;
      } else {
        direction.y = mouseYPos - lastMouseY;
      }
      
      lastMouseY = mouseYPos;
      
      // Get mouse position with offset
      const mouseX = e.clientX + 20;
      const mouseY = e.clientY + 20;
      
      // Show/update image (don't hide first, just update if already visible)
      showImage(imageSrc, mouseX, mouseY);
      
      // Add mousemove listener if not already added
      document.addEventListener('mousemove', handleMouseMove);
    };

    // Mouse leave handler (desktop) - removed, we only hide when leaving the entire projects list
    // const handleMouseLeave = () => {
    //   if (isMobile) return;
    //   hideImage();
    // };

    // Click handler (mobile)
    const handleClick = (e, imageSrc) => {
      if (!isMobile) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      const item = e.currentTarget;
      
      // If clicking the same item, toggle (hide)
      if (activeItem === item && currentImageSrc === imageSrc) {
        hideImage();
        return;
      }
      
      // Show new image
      currentImageSrc = imageSrc;
      activeItem = item;
      
      // Get item position (viewport coordinates for fixed positioning)
      const itemRect = item.getBoundingClientRect();
      const itemBottom = itemRect.bottom;
      
      // Default direction for mobile (from bottom)
      direction.y = 1;
      
      // Position below the item, centered (CSS will handle horizontal centering via left: 50%)
      // Use viewport coordinates since image is position: fixed
      showImage(imageSrc, undefined, itemBottom, true);
    };

    // Close button click handler (mobile)
    const handleCloseClick = (e) => {
      if (!isMobile) return;
      e.preventDefault();
      e.stopPropagation();
      hideImage();
    };

    // Click outside handler (mobile) - hide image when clicking elsewhere
    const handleClickOutside = (e) => {
      if (!isMobile || !currentImageSrc) return;
      
      // Check if click is outside the project items and hover image
      const clickedItem = e.target.closest('.project-item');
      const clickedHoverImage = e.target.closest('.project-hover-image');
      
      if (!clickedItem && !clickedHoverImage) {
        hideImage();
      }
    };

    // Hide image when scrolling past projects-list using ScrollTrigger
    const hideImageTrigger = ScrollTrigger.create({
      trigger: projectsList,
      start: 'bottom bottom',
      onEnter: () => {
        hideImage();
      },
      onEnterBack: () => {
        // Reset state
        currentImageSrc = '';
        direction.y = 0;
        lastMouseY = 0;
        activeItem = null;
      }
    });

    // Hide image when mouse leaves projects-list container (desktop only)
    const handleProjectsListLeave = () => {
      if (isMobile) return;
      hideImage();
    };

    // Add event listeners
    projectsList.addEventListener('mouseleave', handleProjectsListLeave);
    if (isMobile) {
      document.addEventListener('click', handleClickOutside);
      if (closeButton) {
        closeButton.addEventListener('click', handleCloseClick);
      }
    }

    // Store event handlers for cleanup
    const eventHandlers = [];

    // Add event listeners to each project item
    projectItems.forEach((item, index) => {
      if (projects[index]) {
        if (isMobile) {
          // Mobile: use click
          const clickHandler = (e) => handleClick(e, projects[index].image);
          item.addEventListener('click', clickHandler);
          eventHandlers.push({
            item,
            clickHandler
          });
        } else {
          // Desktop: use hover (only mouseenter, no mouseleave on individual items)
          const enterHandler = (e) => handleMouseEnter(e, projects[index].image);
          
          item.addEventListener('mouseenter', enterHandler);
          
          eventHandlers.push({
            item,
            enterHandler
          });
        }
      }
    });

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      projectsList.removeEventListener('mouseleave', handleProjectsListLeave);
      if (closeButton) {
        closeButton.removeEventListener('click', handleCloseClick);
      }
      if (isMobile) {
        document.removeEventListener('click', handleClickOutside);
      }
      
      // Remove all event listeners
      eventHandlers.forEach(({ item, enterHandler, clickHandler }) => {
        if (clickHandler) {
          item.removeEventListener('click', clickHandler);
        } else {
          if (enterHandler) item.removeEventListener('mouseenter', enterHandler);
        }
      });
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Kill ScrollTrigger
      if (hideImageTrigger) {
        hideImageTrigger.kill();
      }
      
      // Kill any running animations
      gsap.killTweensOf(revealInner);
      gsap.killTweensOf(revealImage);
      if (currentTimeline) {
        currentTimeline.kill();
      }
    };
  }, [projects]);

  // ============================================
  // PROJECT ITEM TEXT HOVER EFFECT
  // ============================================
  useEffect(() => {
    const projectsList = projectsListRef.current;
    if (!projectsList) return;

    const projectItems = projectsList.querySelectorAll('.project-item');
    const cleanupFunctions = [];

    projectItems.forEach((item) => {
      const label = item.querySelector('.project-label');
      const nameWrapper = item.querySelector('.project-name-wrapper');
      const name = item.querySelector('.project-name');
      const arrow = item.querySelector('.project-arrow');

      if (!label || !name || !arrow || !nameWrapper) return;

      // Set initial states
      gsap.set([label, arrow], {
        opacity: 0,
        x: (el) => el === label ? -20 : 20,
        scale: 0.8
      });

      gsap.set(name, {
        color: 'rgba(255, 255, 255, 0.9)',
        fontStyle: 'normal',
        opacity: 1,
        visibility: 'visible'
      });

      // Mouse enter handler
      const handleMouseEnter = () => {
        // Animate label and arrow in
        gsap.to([label, arrow], {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out'
        });
      };

      // Mouse leave handler
      const handleMouseLeave = () => {
        // Animate label and arrow out
        gsap.to([label, arrow], {
          opacity: 0,
          x: (el) => el === label ? -20 : 20,
          scale: 0.8,
          duration: 0.4,
          ease: 'power2.in'
        });
      };

      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);

      // Store cleanup function
      cleanupFunctions.push(() => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    // Cleanup
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [projects]);

  // ============================================
  // PROJECT NAME WORD SPLIT ANIMATION (3D STYLE)
  // ============================================
  useEffect(() => {
    const projectsList = projectsListRef.current;
    if (!projectsList) return;

    const animationTriggers = [];
    let timeoutId;

    // Wait a bit for DOM to be ready
    timeoutId = setTimeout(() => {
      const projectItems = projectsList.querySelectorAll('.project-item');

      projectItems.forEach((item, index) => {
        const name = item.querySelector('.project-name');
        if (!name) return;

        // Split project name into words
        const nameText = name.textContent || name.innerText;
        const nameWords = nameText.split(/\s+/).filter(w => w.trim() !== '');
        
        if (nameWords.length === 0) return;
        
        // Wrap each word in a span
        name.innerHTML = nameWords.map(word => `<span class="project-name-word">${word}</span>`).join(' ');
        
        const nameWordSpans = name.querySelectorAll('.project-name-word');
        if (nameWordSpans.length === 0) return;

        // Set initial state for all words (3D style with rotationX)
        // Make sure parent is visible but words are hidden
        gsap.set(name, {
          opacity: 1,
          visibility: 'visible'
        });

        gsap.set(nameWordSpans, {
          opacity: 0,
          y: 60,
          rotationX: -90,
          transformOrigin: 'center center',
          display: 'inline-block'
        });

        // Animation function
        let hasAnimated = false;
        const animateProjectName = () => {
          if (hasAnimated) return;
          hasAnimated = true;

          gsap.to(nameWordSpans, {
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

        // Create ScrollTrigger for each project item
        const trigger = ScrollTrigger.create({
          trigger: item,
          start: 'top 80%',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            animateProjectName();
          },
          onEnterBack: () => {
            animateProjectName();
          }
        });

        // Fail-safe: IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
              const rect = entry.boundingClientRect;
              const viewportHeight = window.innerHeight;
              if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
                animateProjectName();
              }
            }
          });
        }, {
          threshold: [0, 0.1, 0.3],
          rootMargin: '50px'
        });

        observer.observe(item);

        // Fail-safe: Periodic check
        const checkInterval = setInterval(() => {
          if (hasAnimated) {
            clearInterval(checkInterval);
            return;
          }
          const rect = item.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > 0 && rect.top > -rect.height) {
            animateProjectName();
            clearInterval(checkInterval);
          }
        }, 200);

        // Check if already in viewport on mount
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          if (rect.top < viewportHeight * 0.8 && rect.bottom > viewportHeight * 0.2) {
            animateProjectName();
          }
        }, 300);

        // Store cleanup functions
        animationTriggers.push({
          trigger,
          observer,
          checkInterval
        });
      });

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
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
  }, [projects]);

  return (
    <section 
      id="section4" 
      className="section-four projects-section"
      ref={sectionRef}
    >
      <div className="projects-label" ref={labelRef}>
        HIGH-IMPACT PROJECTS
      </div>
      
      <h2 className="projects-title font-bebas" ref={titleRef}>
        SHAPING TOMORROW<br />
        <span className="instrument">(#1)</span>PROJECT A AT TIME
      </h2>
      
      <p className="projects-description" ref={descriptionRef}>
      We delivered impactful design solutions that garnered acclaim by working with a mix of great brands, utilising our design-driven approach to redefine what’s possible.
      </p>
      
      <div className="projects-list" ref={projectsListRef}>
        {projects.map((project, index) => (
          <div key={index} className="project-item reveal-global">
            <div className="project-line"></div>
            <a href={project.link} target="_blank" className="project-content">
              <div className="project-label">{project.label}</div>
              <div className="project-name-wrapper">
                <div className="project-name">{project.name}</div>
              </div>
              <div className="project-arrow">View All Projects</div>
            </a>
          </div>
        ))}
      </div>
      <div className="projects-button view-all-projects">
       <a href="https://www.gtechme.com/portfolio/" target="_blank">View All Projects
       <span className="project-arrow instrument" >(→)</span>
       </a>
      </div>

      {/* Hover Image */}
      <div className="project-hover-image" ref={hoverImageRef}>
        <button className="project-hover-image-close" aria-label="Close image">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="reveal-inner">
          <img className="reveal-image" src="" alt="Project preview" />
        </div>
      </div>



    </section>
  );
};

export default SectionFour;
