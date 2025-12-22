import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHeroScrollAnimation(
  destroyPerspectiveHover,
  init3dPerspectiveHover
) {
  const heroCard = document.querySelector(".hero__card");
  const heroIntroTextElements = gsap.utils.toArray(".hero__intro__text");

  const heroHeaders = gsap.utils.toArray(".hero__card__content h1");
  // const heroInitial = document.querySelector(".hero__card__initial");
  const heroInitial = document.querySelector(".initial_to_hide");

  const heroCardMedia = document.querySelector(".hero__card__media");

  const heroCardMediaImage = document.querySelector(
    ".hero__card__media__image"
  );

  // Hide all headers initially
  gsap.set(heroHeaders, { opacity: 0 });
  // gsap.set(heroCard, { scale: 0 });

  let perspectiveDestroy = destroyPerspectiveHover;
  let capturedRotationX = null;
  let capturedRotationY = null;

  const isMobile = window.innerWidth < 768;
  const scrollMultiplier = isMobile ? 5 : 10;

  const scrollTrigger = ScrollTrigger.create({
    trigger: ".hero",
    start: "top top",
    end: `+=${window.innerHeight * scrollMultiplier}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      const scaleProgress = Math.min(progress / 0.3, 1);

      if (perspectiveDestroy && progress > 0.02) {
        console.log("perspectiveDestroy");

        // Capture rotation values once when perspective is destroyed
        capturedRotationX = gsap.getProperty(heroCard, "rotationX");
        capturedRotationY = gsap.getProperty(heroCard, "rotationY");

        perspectiveDestroy();
        perspectiveDestroy = null;
      }

      // Animate rotation based on progress - extend the range for smoother animation
      if (progress > 0.02 && progress < 0.17) {
        const rotationProgress = (progress - 0.02) / 0.15;
        const easeProgress = gsap.parseEase("power2.out")(rotationProgress);

        gsap.set(heroCard, {
          rotationX: (1 - easeProgress) * (capturedRotationX || 0),
          rotationY: (1 - easeProgress) * (capturedRotationY || 0),
        });
      } else if (progress >= 0.17) {
        gsap.set(heroCard, {
          rotationX: 0,
          rotationY: 0,
        });
      }

      if (!perspectiveDestroy && progress <= 0.02) {
        console.log("perspectiveInit");
        perspectiveDestroy = init3dPerspectiveHover();
        capturedRotationX = null;
        capturedRotationY = null;
      }

      // Interpolate width and height from initial to viewport dimensions
      const remToPx = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      const initialWidth = `${isMobile ? 18 : 24.7}` * remToPx;
      const initialHeight = `${isMobile ? 28 : 43.4}` * remToPx;
      const finalWidth = window.innerWidth;
      const finalHeight = window.innerHeight;

      const initialBorderRadius = 1 * remToPx; // 1.6rem converted to pixels
      const currentBorderRadius = initialBorderRadius * (1 - scaleProgress);

      const currentWidth =
        initialWidth + scaleProgress * (finalWidth - initialWidth);
      const currentHeight =
        initialHeight + scaleProgress * (finalHeight - initialHeight);

      gsap.set(heroCard, {
        width: `${currentWidth}px`,
        height: `${currentHeight}px`,
      });

      gsap.set(heroCardMedia, {
        borderRadius: `${currentBorderRadius}px`,
      });

      // Reset 3D perspective rotation when scrolling
      // if (perspectiveTargets.length > 0) {
      //   gsap.set(perspectiveTargets, {
      //     rotationX: 0,
      //     rotationY: 0,
      //     // duration: 0.3,
      //     // ease: "power3.out",
      //     overwrite: true,
      //   });
      // }

      // Animate intro text out between 0.0 and 0.3

      if (progress <= 0.3) {
        const textProgress = progress / 0.3;
        const offsetDistance = 5 * remToPx; // 13rem from card edge
        const cardHalfWidth = currentWidth / 2;
        const moveDistance = window.innerWidth * 0.1;

        gsap.set(heroIntroTextElements[0], {
          x: -(cardHalfWidth + offsetDistance) - textProgress * moveDistance,
          opacity: 1 - textProgress,
        });

        gsap.set(heroIntroTextElements[1], {
          x: cardHalfWidth + offsetDistance + textProgress * moveDistance,
          opacity: 1 - textProgress,
        });

        gsap.set(heroInitial, {
          opacity: 1 - textProgress,
        });
      }

      // if (progress > 0.3 && progress < 0.4) {
      //   const initialProgress = (progress - 0.3) / 0.1;
      //   gsap.set(heroInitial, {
      //     y: -initialProgress * 100,
      //     opacity: 1 - initialProgress,
      //   });
      // } else if (progress >= 0.4) {
      //   gsap.set(heroInitial, { y: -100, opacity: 0 });
      // } else {
      //   gsap.set(heroInitial, { y: 0, opacity: 1 });
      // }

      // Animate headers between 0.3 and 1.0
      if (progress > 0.3) {
        const headerProgress = (progress - 0.3) / 0.7;
        const fadeInDuration = 0.15;
        const holdDuration = 0.15;
        const fadeOutDuration = 0.15;
        const overlapOffset = fadeOutDuration * 0.5;
        const cycleSpacing = fadeInDuration + holdDuration + overlapOffset;
        heroHeaders.forEach((header, i) => {
          const startProgress = i * cycleSpacing;
          const fadeInEnd = startProgress + fadeInDuration;
          const fadeOutStart = fadeInEnd + holdDuration;
          const fadeOutEnd = fadeOutStart + fadeOutDuration;
          let opacity = 0;
          if (headerProgress < startProgress) {
            opacity = 0;
          } else if (
            headerProgress >= startProgress &&
            headerProgress < fadeInEnd
          ) {
            const fadeInProgress =
              (headerProgress - startProgress) / fadeInDuration;
            opacity = fadeInProgress;
          } else if (
            headerProgress >= fadeInEnd &&
            headerProgress < fadeOutStart
          ) {
            opacity = 1;
          } else if (
            headerProgress >= fadeOutStart &&
            headerProgress < fadeOutEnd
          ) {
            const fadeOutProgress =
              (headerProgress - fadeOutStart) / fadeOutDuration;
            opacity = 1 - fadeOutProgress;
          } else if (headerProgress >= fadeOutEnd) {
            opacity = 0;
          }
          gsap.set(header, { opacity });
        });
        // Animate background image position
        const totalHeaders = heroHeaders.length;
        const imageProgress =
          (headerProgress * (totalHeaders - 1)) / (totalHeaders - 1);
        const moveAmount = 20; // Adjust this value for how much the image moves (percentage)
        gsap.set(heroCardMediaImage, {
          objectPosition: `50% ${50 + imageProgress * moveAmount}%`,
          scale: 1.2 + imageProgress * 0.1, // Scale up to prevent cutoff
        });
      } else {
        gsap.set(heroHeaders, { opacity: 0 });
        gsap.set(heroCardMediaImage, {
          objectPosition: "50% 50%",
          scale: 1.2,
        });
      }
    },
  });

  return () => {
    scrollTrigger.kill();
  };
}

