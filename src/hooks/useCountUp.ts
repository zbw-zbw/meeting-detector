"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 数字从 0 计数到目标值的动画 hook
 * @param target 目标值
 * @param duration 动画时长(ms)，默认 1000
 * @param delay 延迟启动(ms)，默认 0
 */
export function useCountUp(target: number, duration = 1000, delay = 0) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  useEffect(() => {
    // Check for reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setValue(target);
      return;
    }

    // If target is 0, just show 0
    if (target === 0) {
      setValue(0);
      return;
    }

    const delayTimer = setTimeout(() => {
      startRef.current = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startRef.current;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };

      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}
