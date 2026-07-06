"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useFadeUp } from "@/hooks/useFadeUp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { meetingTemplates, type MeetingTemplate } from "@/lib/templates";
import { IconArrowRight, IconClock, IconUsers, IconArrowLeft } from "@/components/Icon";

export default function TemplatesPage() {
  useFadeUp();
  const router = useRouter();
  const [category, setCategory] = useState("全部");
  const [preview, setPreview] = useState<MeetingTemplate | null>(null);

  const categories = ["全部", ...Array.from(new Set(meetingTemplates.map((t) => t.category)))];
  const filtered =
    category === "全部"
      ? meetingTemplates
      : meetingTemplates.filter((t) => t.category === category);

  const applyTemplate = (template: MeetingTemplate) => {
    // Save template content to localStorage and redirect to analyze page,
    // where it will be auto-filled via the ?from=template flag.
    localStorage.setItem("templateText", template.content);
    router.push("/analyze?from=template");
  };

  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 fade-up">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
            >
              <IconArrowLeft size={14} /> 返回首页
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text font-display">
              会议模板库
            </h1>
            <p className="text-text-secondary mt-3">
              选择预设会议场景，快速体验 AI 会议效率分析
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 fade-up">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium filter-btn transition-all ${
                  category === cat
                    ? "bg-primary text-white"
                    : "bg-surface border border-border text-text-secondary hover:bg-border-light"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Template cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((template, i) => (
              <div
                key={template.id}
                className="bg-surface rounded-2xl border border-border p-5 fade-up card-gradient-border interactive-card hover:shadow-lg transition-shadow group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Category badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                    {template.category}
                  </span>
                  <span className="text-xs text-text-muted number-highlight">{template.duration}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-text mb-2 font-display">{template.title}</h3>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded bg-bg text-text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Info row */}
                <div className="flex items-center gap-4 text-xs text-text-muted mb-4 number-highlight">
                  <span className="flex items-center gap-1">
                    <IconClock size={12} /> {template.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconUsers size={12} /> {template.participantRange}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => applyTemplate(template)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors cta-btn"
                  >
                    使用此模板
                  </button>
                  <button
                    onClick={() => setPreview(template)}
                    className="px-4 py-2 bg-bg border border-border rounded-lg text-sm text-text-secondary hover:text-text hover:border-primary transition-all"
                  >
                    预览
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-modal-enter"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium mr-2">
                  {preview.category}
                </span>
                <h3 className="font-bold text-text font-display inline">{preview.title}</h3>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="text-text-muted hover:text-text transition-colors shrink-0 ml-3"
                aria-label="关闭预览"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="flex items-center gap-4 text-xs text-text-muted mb-4 number-highlight">
                <span className="flex items-center gap-1">
                  <IconClock size={12} /> {preview.duration}
                </span>
                <span className="flex items-center gap-1">
                  <IconUsers size={12} /> {preview.participantRange}
                </span>
              </div>
              <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
                {preview.content}
              </pre>
            </div>
            <div className="p-5 border-t border-border">
              <button
                onClick={() => {
                  applyTemplate(preview);
                  setPreview(null);
                }}
                className="w-full px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors cta-btn inline-flex items-center justify-center gap-1.5"
              >
                使用此模板分析 <IconArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
