"use client";
import { useEffect } from "react";

/**
 * scroll reveal 入场动画 hook
 *
 * 使用 IntersectionObserver 监听带有 `.reveal` class 的元素，
 * 当元素滚动进入视口时添加 `.revealed` class 触发渐显动画。
 * 同时用 MutationObserver 监听 DOM 变化，确保异步渲染的
 * `.reveal` 元素也能被正确观察到。
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Observe all elements with .reveal class
    const elements = document.querySelectorAll(".reveal:not(.revealed)");
    elements.forEach((el) => observer.observe(el));

    // Also observe dynamically added elements
    const mo = new MutationObserver(() => {
      const newElements = document.querySelectorAll(".reveal:not(.revealed)");
      newElements.forEach((el) => observer.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);
}
