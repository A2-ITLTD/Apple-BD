"use client";

import React from "react";
import Link from "next/link";

/**
 * Section header with a lightweight navigation link or expand/collapse action.
 * `title` may be a string or a JSX node (e.g. with a highlighted word).
 * Pass `onSeeMore` for a button, or `seeMoreHref` for a link.
 */
export default function SectionHeader({
  title,
  seeMoreHref,
  onSeeMore,
  seeMoreLabel = "See More",
  expanded = false,
  className = "",
}) {
  const actionClass =
    "group shrink-0 inline-flex min-h-10 items-center gap-1.5 px-1 text-xs sm:text-sm font-semibold text-[#1D1D1F] hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D1D1F]/40 focus-visible:ring-offset-2 rounded-sm transition-colors whitespace-nowrap";

  return (
    <div className={`flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 ${className}`}>
      <h2 className="min-w-0 truncate text-base sm:text-xl md:text-2xl font-semibold tracking-tight text-[#1F2937] text-left font-georgia">
        {title}
      </h2>
      <div className="flex-1 h-px bg-linear-to-r from-gray-200 to-transparent" />
      {seeMoreHref ? (
        <Link href={seeMoreHref} className={actionClass}>
          {seeMoreLabel}
          <svg
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      ) : onSeeMore ? (
        <button type="button" onClick={onSeeMore} className={actionClass}>
          {seeMoreLabel}
          <svg
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
