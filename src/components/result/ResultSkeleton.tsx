"use client";

import Navbar from "@/components/Navbar";

export default function ResultSkeleton() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6">

          {/* Skeleton: ReportHeader */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6">
            {/* top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="skeleton h-4 w-20 rounded" />
              <div className="flex items-center gap-3">
                <div className="skeleton h-4 w-16 rounded" />
                <div className="skeleton h-4 w-32 rounded" />
              </div>
            </div>
            {/* title */}
            <div className="skeleton h-8 w-48 rounded mt-4" />
            {/* info row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              <div className="skeleton h-4 w-48 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-4 w-36 rounded" />
            </div>
          </div>

          {/* Skeleton: ScoreCards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface rounded-2xl p-6 shadow-sm border border-border overflow-hidden">
                <div className="skeleton h-1 -mx-6 -mt-6 mb-4 rounded-none" />
                <div className="skeleton h-12 w-20 rounded mt-2" />
                <div className="skeleton h-5 w-16 rounded mt-3" />
                <div className="skeleton h-4 w-20 rounded mt-4" />
              </div>
            ))}
          </div>

          {/* Skeleton: DonutChart */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6">
            <div className="skeleton h-6 w-36 rounded mb-6" />
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left -- circle */}
              <div className="lg:w-1/2 flex justify-center">
                <div className="skeleton w-[200px] h-[200px] rounded-full" />
              </div>
              {/* Right -- progress bars */}
              <div className="lg:w-1/2 flex flex-col justify-center gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="skeleton w-3 h-3 rounded-full" />
                        <div className="skeleton h-4 w-16 rounded" />
                      </div>
                      <div className="skeleton h-4 w-8 rounded" />
                    </div>
                    <div className="skeleton h-2.5 w-full rounded-full" />
                    <div className="skeleton h-3 w-40 rounded mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton: SentenceList */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6">
            <div className="skeleton h-6 w-36 rounded mb-4" />
            {/* filter bar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-8 w-14 rounded-full" />
              ))}
            </div>
            {/* sentence cards */}
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border-l-4 border-l-border bg-surface">
                  <div className="flex items-start gap-3">
                    <div className="skeleton h-4 w-10 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-3/4 rounded" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="skeleton h-5 w-10 rounded-full" />
                      <div className="skeleton h-1.5 w-16 rounded-full mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton: ActionItems */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border mb-6">
            <div className="skeleton h-6 w-32 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border">
                  <div className="skeleton w-6 h-6 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="flex gap-2">
                      <div className="skeleton h-5 w-16 rounded" />
                      <div className="skeleton h-5 w-20 rounded" />
                      <div className="skeleton h-5 w-16 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton: MeetingSummary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
              <div className="skeleton h-6 w-28 rounded mb-4" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-4 rounded" style={{ width: `${100 - i * 10}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-sm border border-border">
              <div className="skeleton h-6 w-28 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-bg">
                    <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-2/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skeleton: ExportActions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-12 w-32 rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
