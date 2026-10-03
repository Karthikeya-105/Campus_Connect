import React from 'react';

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
    return (
        <div className={`${width} ${height} animate-pulse rounded bg-slate-200`} />
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                    <SkeletonLine width="w-1/3" />
                    <SkeletonLine width="w-1/2" height="h-3" />
                </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                <SkeletonLine height="h-14" />
                <SkeletonLine height="h-14" />
                <SkeletonLine height="h-14" />
                <SkeletonLine height="h-14" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                <SkeletonLine width="w-32" height="h-3" />
            </div>
            <div className="divide-y divide-slate-100">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-4">
                        <SkeletonLine width="w-1/4" />
                        <SkeletonLine width="w-1/4" />
                        <SkeletonLine width="w-1/4" />
                        <SkeletonLine width="w-1/4" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonJobCard() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
                <div className="flex-1 space-y-2">
                    <SkeletonLine width="w-2/3" height="h-5" />
                    <SkeletonLine width="w-1/3" height="h-3" />
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <SkeletonLine width="w-full" height="h-3" />
                <SkeletonLine width="w-3/4" height="h-3" />
            </div>
            <div className="mt-5 flex gap-2">
                <SkeletonLine width="w-16" height="h-6" />
                <SkeletonLine width="w-20" height="h-6" />
                <SkeletonLine width="w-14" height="h-6" />
            </div>
        </div>
    );
}