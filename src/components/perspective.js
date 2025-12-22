import { gsap } from 'gsap';

export function init3dPerspectiveHover() {
  // Skip on touch / non-hover devices
  const canHover = window.matchMedia?.(
    "(hover: hover) and (pointer: fine)"
  ).matches;
  if (!canHover) return () => {};

  // Skip if there's no targets on page
  const nodeList = document.querySelectorAll("[data-3d-hover-target]");
  if (!nodeList.length) return () => {};

  // Skip if user prefers reduced motion
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
    return () => {};

  const DEFAULT_MAX_DEG = 20;
  const EASE = "power3.out";
  const DURATION = 0.5;

  const targets = Array.from(nodeList).map((el) => {
    const maxAttr = parseFloat(el.getAttribute("data-max-rotate"));
    const maxRotate = Number.isFinite(maxAttr) ? maxAttr : DEFAULT_MAX_DEG;

    const setRotationX = gsap.quickSetter(el, "rotationX", "deg");
    const setRotationY = gsap.quickSetter(el, "rotationY", "deg");

    return {
      el,
      maxRotate,
      rect: el.getBoundingClientRect(),
      proxy: { rx: 0, ry: 0 },
      setRotationX,
      setRotationY,
    };
  });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let isFrameScheduled = false;

  function measureAll() {
    for (const target of targets) {
      target.rect = target.el.getBoundingClientRect();
    }
  }

  function onPointerMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    if (!isFrameScheduled) {
      isFrameScheduled = true;
      requestAnimationFrame(updateAll);
    }
  }

  function updateAll() {
    isFrameScheduled = false;

    for (const target of targets) {
      const { rect, maxRotate, proxy, setRotationX, setRotationY } = target;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const normX = Math.max(
        -1,
        Math.min(1, (mouseX - centerX) / (rect.width / 2 || 1))
      );
      const normY = Math.max(
        -1,
        Math.min(1, (mouseY - centerY) / (rect.height / 2 || 1))
      );

      const rotationY = normX * maxRotate;
      const rotationX = -normY * maxRotate;

      gsap.to(proxy, {
        rx: rotationX,
        ry: rotationY,
        duration: DURATION,
        ease: EASE,
        overwrite: true,
        onUpdate: () => {
          setRotationX(proxy.rx);
          setRotationY(proxy.ry);
        },
      });
    }
  }

  // stable listener so we can remove them later
  function onResize() {
    requestAnimationFrame(measureAll);
  }
  function onScroll() {
    requestAnimationFrame(measureAll);
  }

  // init
  measureAll();
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });

  // expose cleanup
  function destroy() {
    document.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("scroll", onScroll);
  }

  return destroy;
}
