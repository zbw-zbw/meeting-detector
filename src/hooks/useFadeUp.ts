"use client";

import { useEffect } from "react";

/**
 * fade-up 入场动画 hook
 *
 * 使用 IntersectionObserver 实现滚动入场，同时用 MutationObserver
 * 监听 DOM 变化，确保异步渲染的 .fade-up 元素也能被正确观察到。
 * （修复：result 页面 loading→内容 切换后元素一直 opacity:0 的问题）
 */
export function useFadeUp() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ── reduced motion：直接全部显示 ── */
    if (prefersReducedMotion) {
      const reveal = (el: Element) => el.classList.add("visible");
      document.querySelectorAll(".fade-up").forEach(reveal);
      const mo = new MutationObserver((mutations) => {
        for (const m of mutations)
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            if (node.classList.contains("fade-up")) reveal(node);
            node.querySelectorAll?.(".fade-up").forEach(reveal);
          });
      });
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    /* ── 正常模式：IntersectionObserver + MutationObserver ── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    const observeAll = () =>
      document
        .querySelectorAll(".fade-up:not(.visible)")
        .forEach((el) => observer.observe(el));

    // 观察当前已存在的元素
    observeAll();

    // 监听后续动态添加的元素（如 loading 结束后渲染的内容）
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);
}
