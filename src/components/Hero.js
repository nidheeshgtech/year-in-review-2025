import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { init3dPerspectiveHover } from './perspective';
import recapBg from '../images/hero-bg.jpg';
import { initHeroScrollAnimation } from './hero-scroll-animation';
import './hero.scss';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  useEffect(() => {
    const destroyHover = init3dPerspectiveHover();
    const cleanup = initHeroScrollAnimation(destroyHover, init3dPerspectiveHover);
    
    return () => {
      if (destroyHover) destroyHover();
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section className="hero section">
      <div className="hero__intro__text__container text-white">
        <div className="hero__intro__text hero__intro__text--left">Defining the Future</div>
        <div className="hero__intro__text hero__intro__text--right instrument">
          Through <br /> Unprecedented <br />  Scale and Impact
        </div>
      </div>

      <div 
        className="hero__card" 
        data-3d-hover-target 
        data-max-rotate="20"
      >
        <div className="hero__card__media">
          <img 
            src={recapBg} 
            alt="hero background" 
            className="hero__card__media__image" 
          />
        </div>

        <div className="hero__card__initial" data-3d-hover-inner="layer-1">
          <div className="hero__card__initial__header">SEE RECAP</div>
          <div className="hero__card__initial__main font-bebas initial_to_hide">2025</div>
          <div className="hero__card__initial__footer">
            <span className="fs-instrument text-white instrument">(Scroll Down)</span>
          </div>
        </div>

        <div className="hero__card__content">
          <h1>This was the year we made good on our promise to "crush 2025".</h1>
          <h1> Fueled by the continued "hustle, heart, and high-fives", this year witnessed us scaling our ambition and achieving exponential impact across every vertical.</h1>
          <h1>From Big Wins to <span className="bebas-neue banner-text-bold">Bold Moves</span>, we lived up to our commitment to Endless Innovation.</h1>

          <div className="hero__card__content__button">
            <div className="scroll-text instrument">Scroll down</div>
            <div className="scroll-icon">
              <span className="fs-instrument text-white instrument rotate-180">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
