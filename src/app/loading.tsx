export default function Loading() {
  return (
    <div className="pt-24 pb-20 flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
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
