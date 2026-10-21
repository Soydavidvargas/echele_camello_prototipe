import type { Variants } from 'motion/react';

/** Easing ease-out prolongado, sin rebote. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Contenedor que anima a sus hijos en cascada. */
export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Elemento que aparece deslizándose hacia arriba. */
export const fadeUp = (distance = 50, duration = 0.7): Variants => ({
  hidden: { opacity: 0, y: distance },
  show: { opacity: 1, y: 0, transition: { duration, ease: EASE_OUT } },
});

/** Transición de entrada de una vista completa (cambio de pestaña). */
export const pageEnter = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE_OUT },
} as const;

/** Viewport común para whileInView: se anima una sola vez. */
export const VIEWPORT_ONCE = { once: true, amount: 0.15 } as const;

/** Anillos de foco accesibles reutilizables. */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c2410c]';
