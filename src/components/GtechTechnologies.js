import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './GtechTechnologies.scss';

import asanaIcon from '../images/p01.webp';
import geminiIcon from '../images/p02.webp';
import passwordIcon from '../images/p03.webp';
import notebookIcon from '../images/p04.webp';
import lottieIcon from '../images/p05.webp';

gsap.registerPlugin(ScrollTrigger);

const GtechTechnologies = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      const header = section.querySelector('.gtech-technologies-header');
      if (!header) return;

      const breadcrumb = header.querySelector('.gtech-tech-breadcrumb');
      const breadcrumbText = breadcrumb?.querySelector('.gtech-tech-breadcrumb-text');
      const mainTitle = header.querySelector('.gtech-tech-main-title');
      const subtitle = header.querySelector('.gtech-tech-subtitle');
      const description = header.querySelector('.gtech-tech-description');

      const splitTextIntoSpans = (element, specificClass = '') => {
        if (!element) return [];
        
        if (element.children.length === 0) {
          const words = element.innerText.split(/\s+/).filter(w => w.trim() !== '');
          element.innerHTML = words
            .map(word => `<span class="reveal-word ${specificClass}" style="display:inline-block;">${word}</span>`)
            .join(' ');
          return Array.from(element.querySelectorAll('.reveal-word'));
        } 
        
        const targets = [];
        return [element]; 
      };
      
      const elementsToAnimate = [
        breadcrumb,
        mainTitle,
        subtitle,
        description
      ].filter(Boolean);

      gsap.set(elementsToAnimate, { 
        y: 150, 
        opacity: 0, 
        autoAlpha: 0 
      });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          gsap.to(elementsToAnimate, {
            y: 0,
            opacity: 1,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      const container = section.querySelector('.gtech-technologies-container');
      const grid = container?.querySelector('.gtech-tech-grid');
      const header = container?.querySelector('.gtech-technologies-header');
      const cards = gsap.utils.toArray('.gtech-tech-card');

      if (!container || !grid || cards.length === 0) return;

      const getGridTravelDistance = () => {
        const gridHeight = grid.scrollHeight;
        const viewportHeight = window.innerHeight;
        return Math.max(0, gridHeight - viewportHeight);
      };
      

      const travelDistance = getGridTravelDistance();

      const getPinDuration = () => {
        const gridHeight = grid.scrollHeight;
        const innerHeight = window.innerHeight;
        return gridHeight + (innerHeight * 0.5);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${getGridTravelDistance()}`,
          pin: true,
          scrub: 6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onEnter: () => {
            if (header) header.classList.add('gtech-technologies-header--active');
          },
          onEnterBack: () => {
            if (header) header.classList.add('gtech-technologies-header--active');
          },
          onLeave: () => {
            if (header) header.classList.remove('gtech-technologies-header--active');
          },
          onLeaveBack: () => {
            if (header) header.classList.remove('gtech-technologies-header--active');
          }
        }
      });

      if (travelDistance > 0) {
        tl.to(grid, {
          y: () => -getGridTravelDistance(),
          ease: 'none',
          duration: 1
        });
      }

      gsap.set(cards, { y: 140, opacity: 1, force3D: true });

      tl.to(cards, {
        y: -40,
        opacity: 1,
        duration: 0.5,
        stagger: 0.15,
        ease: 'power3.out'
      }, 0);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const technologies = [
    {
      id: 1,
      title: 'Asana AI',
      description: 'This critical upgrade ensured smarter task organization, automated resource allocation, and optimized our internal workflows, making no detail too small.',
      iconBg: '#ff6b9d',
      iconImage: asanaIcon
    },
    {
      id: 2,
      title: 'Google Gemini',
      description: 'Utilised for enhanced content strategy, advanced ideation, and rapid prototyping, this integration helped push our creative boundaries.',
      iconBg: '#2d2d2d',
      iconImage: geminiIcon
    },
    {
      id: 3,
      title: '1Password',
      description: 'Standardising on this enterprise-grade solution allowed us to unify credential management, ensuring robust security and protection across all our specialised teams, from developers to designers.',
      iconBg: '#2d2d2d',
      iconImage: passwordIcon
    },
    {
      id: 4,
      title: 'Notebook LM',
      description: 'Implemented as a powerful research and knowledge synthesis tool, enabling our teams to quickly absorb complex information and accelerate development cycles, supporting our commitment to continuous innovation.',
      iconBg: '#2d2d2d',
      iconImage: notebookIcon
    },
    {
      id: 5,
      title: 'Lottiefiles',
      description: 'Streamlined the creation and deployment of high-quality, lightweight motion graphics and animations, contributing to the delivery of visually stunning realities.',
      iconBg: '#2d2d2d',
      iconImage: lottieIcon
    }
  ];

  return (
    <section className="gtech-technologies" ref={sectionRef}>
      <div className="gtech-technologies-container">
        <div className="gtech-technologies-header">
          <div className="gtech-tech-breadcrumb">
            <span className="gtech-tech-dot">•</span>
            <span className="gtech-tech-breadcrumb-text">TECHNOLOGICAL ADVANCEMENT & OPERATIONS</span>
            <span className="gtech-tech-dot">•</span>
          </div>
          
          <h2 className="gtech-tech-main-title font-bebas">
            TECH & TOOLS
          </h2>
          
          <h3 className="gtech-tech-subtitle font-bebas">
            THE <span className="gtech-tech-year">2025</span> UPGRADE
          </h3>
          
          <p className="gtech-tech-description">
            In 2025, GTECH didn't just upgrade - we revolutionised our internal ecosystem.
          </p>
        </div>

        <div className="gtech-tech-grid">
          {technologies.map((tech) => (
            <div key={tech.id} className="gtech-tech-card">
              <div 
                className="gtech-tech-icon-wrapper"
                style={{ backgroundColor: tech.iconBg }}
              >
                <div className="gtech-tech-icon-3d">
                  <img 
                    src={tech.iconImage} 
                    alt={tech.title}
                    className="gtech-tech-icon-img"
                  />
                </div>
              </div>
              
              <div className="gtech-tech-content">
                <h4 className="gtech-tech-card-title instrument">{tech.title}</h4>
                <p className="gtech-tech-card-description">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GtechTechnologies;