"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { useLanguage } from "@/components/context/LanguageContext";
import SectionHeader from "./SectionHeader";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.applebd.com";

// Dark-neutral palette (stays inside the site's monochrome theme) so each
// customer without a real photo still gets a visually distinct avatar
// instead of every card showing the same flat gray circle.
const AVATAR_COLORS = [
  "#1D1D1F",
  "#374151",
  "#4B5563",
  "#52525B",
  "#44403C",
  "#3F3F46",
];

function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return isDesktop;
}

function Stars({ rating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

// Testimonials are hand-picked and published by the admin, so every card
// shown here has already been vetted — the badge is a static trust signal.
function VerifiedBadge({ featured }) {
  return (
    <span
      title="Verified Buyer"
      aria-label="Verified Buyer"
      className="absolute -top-0.5 -right-0.5 flex items-center justify-center z-10 bg-white rounded-full"
    >
      <MdVerified
        className={`text-[#1D1D1F] ${featured ? "w-4 h-4" : "w-3.5 h-3.5"}`}
      />
    </span>
  );
}

function TestimonialCard({ item, featured }) {
  return (
    <div
      className={`relative h-full flex flex-col bg-white rounded-3xl border overflow-hidden transition-shadow duration-300 ${
        featured
          ? "border-[#1D1D1F]/15 shadow-xl px-4 py-4 sm:px-7 sm:py-8 md:px-8 md:py-10"
          : "border-gray-100 shadow-sm p-6 md:p-7 opacity-70"
      }`}
    >
      <span
        aria-hidden="true"
        className="work-sans -mb-2 select-none text-7xl font-bold leading-none text-[#E5E7EB] pointer-events-none md:text-8xl"
      >
        &ldquo;
      </span>

      <p
        className={`relative text-[#374151] leading-snug sm:leading-relaxed flex-1 ${
          featured ? "text-[13px] sm:text-base md:text-[17px]" : "text-sm"
        }`}
      >
        {item.message}
      </p>

      <div className="relative mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 md:gap-4">
        <div
          className={`relative shrink-0 ${
            featured ? "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" : "w-10 h-10"
          }`}
        >
          <div
            className={`relative w-full h-full rounded-full overflow-hidden bg-[#F5F6F7] ring-2 shadow-sm ${
              featured ? "ring-[#1D1D1F]/10" : "ring-[#F5F6F7]"
            }`}
          >
            {item.avatar?.url ? (
              <Image
                src={item.avatar.url}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div
                className={`work-sans font-bold w-full h-full flex items-center justify-center text-white ${
                  featured ? "text-lg sm:text-2xl" : "text-xl"
                }`}
                style={{ backgroundColor: avatarColor(item.name) }}
              >
                {item.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
          <VerifiedBadge featured={featured} />
        </div>
        <div className="min-w-0">
          <p
            className={`work-sans font-semibold text-[#1F2937] truncate ${
              featured ? "text-sm sm:text-base md:text-lg" : "text-sm"
            }`}
          >
            {item.name}
          </p>
          {item.address && (
            <p
              className={`text-[#6B7280] truncate mt-0.5 mb-1 sm:mb-1.5 ${
                featured ? "text-[10px] sm:text-xs" : "text-[10px]"
              }`}
            >
              {item.address}
            </p>
          )}
          <Stars rating={item.rating || 5} />
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDesktop = useIsDesktop();
  const autoRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/testimonials`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);

  const n = items.length;

  // Warm the adjacent customer avatars before their cards are shown. The card
  // animation remounts on review changes, but cached images then appear without
  // an additional visible load delay.
  useEffect(() => {
    if (n < 2) return;
    const adjacentItems = [
      items[(currentIndex + 1) % n],
      items[(currentIndex - 1 + n) % n],
    ];
    adjacentItems.forEach((item) => {
      const url = item?.avatar?.url;
      if (!url) return;
      const preloadedImage = new window.Image();
      preloadedImage.src = url;
    });
  }, [currentIndex, items, n]);

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    if (n <= 1) return;
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % n);
    }, 5000);
  }, [n]);

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
  }, [startAuto]);

  const go = (dir) => {
    setCurrentIndex((prev) => (prev + dir + n) % n);
    startAuto();
  };

  if (n === 0) return null;

  const showSides = isDesktop && n >= 3;
  const prevItem = items[(currentIndex - 1 + n) % n];
  const nextItem = items[(currentIndex + 1) % n];
  const centerItem = items[currentIndex];

  return (
    <section className="w-full py-8 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("home.testimonials_title")} />

        <div
          className="relative"
          onMouseEnter={() => clearInterval(autoRef.current)}
          onMouseLeave={startAuto}
        >
          {n > 1 && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous"
              className="hidden sm:flex absolute -left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur border border-gray-100 shadow-lg rounded-full items-center justify-center text-[#6B7280] hover:bg-[#1D1D1F] hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6L9 12L15 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div
            className={`grid grid-cols-1 items-center gap-4 md:gap-5 ${
              showSides
                ? "md:grid-cols-[0.88fr_1.1fr_0.88fr]"
                : "max-w-xl mx-auto"
            }`}
          >
            {showSides && (
              <div className="hidden md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={prevItem._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TestimonialCard item={prevItem} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            <div className="h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={centerItem._id}
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -12 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full"
                >
                  <TestimonialCard item={centerItem} featured />
                </motion.div>
              </AnimatePresence>
            </div>

            {showSides && (
              <div className="hidden md:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={nextItem._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TestimonialCard item={nextItem} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>

          {n > 1 && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next"
              className="hidden sm:flex absolute -right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur border border-gray-100 shadow-lg rounded-full items-center justify-center text-[#6B7280] hover:bg-[#1D1D1F] hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {n > 1 && (
            <div className="flex justify-center gap-1.5 mt-4 md:mt-7">
              {items.map((item, i) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(i);
                    startAuto();
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? "bg-[#1D1D1F] w-6" : "bg-gray-200 w-1.5"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
