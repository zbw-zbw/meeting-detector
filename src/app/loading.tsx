import { IconChart } from "@/components/Icon";

export default function Loading() {
  return (
    <div className="pt-24 pb-20 flex flex-col items-center justify-center gap-6">
      {/* Brand icon */}
      <IconChart size={32} className="text-primary" />

      {/* Navbar skeleton */}
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="h-10 w-48 skeleton rounded-lg mb-2" />
        <div className="h-10 w-32 skeleton rounded-lg" />
      </div>

      {/* Loading dots */}
      <div className="flex gap-2 mt-8">
        <span
          className="w-3 h-3 rounded-full bg-primary"
          style={{ animation: "pulseDot 1.4s ease-in-out infinite", animationDelay: "0s" }}
        />
        <span
          className="w-3 h-3 rounded-full bg-primary"
          style={{ animation: "pulseDot 1.4s ease-in-out infinite", animationDelay: "0.2s" }}
        />
        <span
          className="w-3 h-3 rounded-full bg-primary"
          style={{ animation: "pulseDot 1.4s ease-in-out infinite", animationDelay: "0.4s" }}
        />
      </div>
      <p className="text-text-muted text-sm">加载中...</p>
    </div>
  );
}
