import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../general.scss';

gsap.registerPlugin(ScrollTrigger);

const SectionTwo = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  /* ============================
     TITLE REVEAL (ON VIEWPORT)
  ============================ */
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    /* ---- Split title into words ---- */
    const originalHTML = title.innerHTML;
    const temp = document.createElement('div');
    temp.innerHTML = originalHTML;

    const words = [];

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent.trim().split(/\s+/).forEach(word => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          words.push(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'SPAN' && node.classList.contains('instrument')) {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.innerHTML = node.outerHTML;
          words.push(span);
        } else {
          [...node.childNodes].forEach(processNode);
        }
      }
    };

    [...temp.childNodes].forEach(processNode);

    title.innerHTML = '';
    words.forEach((w, i) => {
      title.appendChild(w);
      if (i < words.length - 1) {
        title.appendChild(document.createTextNode(' '));
      }
    });

    const titleWords = title.querySelectorAll('.reveal-word');

    /* ---- Initial hidden state ---- */
    gsap.set(titleWords, {
      opacity: 0,
      y: 80,
      rotationX: -90,
      force3D: true
    });

    /* ---- ScrollTrigger animation ---- */
    gsap.to(titleWords, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'bottom top',
        toggleActions: 'play none none reverse'
      }
    });

    return () => ScrollTrigger.refresh();
  }, []);

  /* ============================
     CONTENT REVEAL (ON VIEWPORT)
  ============================ */
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const originalHTML = content.innerHTML;
    const temp = document.createElement('div');
    temp.innerHTML = originalHTML;

    const words = [];

    const processNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        node.textContent.trim().split(/\s+/).forEach(word => {
          const span = document.createElement('span');
          span.className = 'reveal-word';
          span.textContent = word;
          words.push(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'EM') {
          node.textContent.trim().split(/\s+/).forEach(word => {
            const span = document.createElement('span');
            span.className = 'reveal-word';
            span.innerHTML = `<em>${word}</em>`;
            words.push(span);
          });
        } else {
          [...node.childNodes].forEach(processNode);
        }
      }
    };

    [...temp.childNodes].forEach(processNode);

    content.innerHTML = '';
    words.forEach((w, i) => {
      content.appendChild(w);
      if (i < words.length - 1) {
        content.appendChild(document.createTextNode(' '));
      }
    });

    const contentWords = content.querySelectorAll('.reveal-word');

    gsap.set(contentWords, {
      opacity: 0,
      y: 80,
      rotationX: -90,
      force3D: true
    });

    gsap.to(contentWords, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.03,
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        end: 'bottom top',
        toggleActions: 'play none none reverse'
      }
    });

    return () => ScrollTrigger.refresh();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="section2"
      className="section-two focus-section"
    >
      <h2 ref={titleRef} className="focus-title font-bebas">
        THE <span className="instrument">2025</span> FOCUS
      </h2>

      <p ref={contentRef} className="focus-content">
        <span className="focus-content-text">
          We reinforced our vision, enhancing client relationships and satisfaction
          through improved feedback initiatives. Our focus was on
          <em> pushing creative boundaries</em> and turning ideas into stunning visuals.
        </span>
      </p>
    </section>
  );
};

export default SectionTwo;
