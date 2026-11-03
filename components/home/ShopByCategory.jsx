"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/components/context/CategoryContext";
import { useLanguage } from "@/components/context/LanguageContext";
import SectionHeader from "./SectionHeader";

const INITIAL_COUNT = 8;

export default function ShopByCategory() {
  const { categories: rawCategories, loading } = useCategories();
  const { t, lang } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const categories = (rawCategories || []).map((c) => {
    const slug = c.slug || (c.name || "").replace(/\s+/g, "-");
    return {
      _id: c._id,
      name: lang === "bn" ? c.nameBn || c.name : c.name,
      image:
        c.images && c.images[0] && c.images[0].url
          ? c.images[0].url
          : "/assets/placeholder.svg",
      link: `/category/${slug}/`,
    };
  });

  const hasMore = categories.length > INITIAL_COUNT;
  const visible = expanded ? categories : categories.slice(0, INITIAL_COUNT);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 mb-10">
      <SectionHeader
        title={t("home.category")}
        onSeeMore={hasMore ? () => setExpanded((v) => !v) : undefined}
        expanded={expanded}
        seeMoreLabel={expanded ? t("home.see_less") : t("home.see_more")}
      />

      {loading ? (
        <div className="text-[#6B7280] py-10 w-full text-center">
          {t("home.loading_categories")}
        </div>
      ) : visible.length === 0 ? (
        <div className="text-[#6B7280] py-10 w-full text-center">
          {t("home.no_categories")}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-6 sm:gap-x-4 sm:gap-y-5 xl:grid-cols-8">
          {visible.map((cat) => (
            <Link
              key={cat._id}
              href={cat.link}
              className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl px-0 py-1 text-center transition-colors hover:bg-gray-50 sm:px-1.5 sm:py-2"
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-gray-200 bg-[#F5F6F7] shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-gray-300 group-hover:shadow-md sm:h-[72px] sm:w-[72px] md:h-20 md:w-20">
                <Image
                  src={encodeURI(cat.image)}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 56px, 72px"
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-110 sm:p-2.5"
                />
              </div>
              <span className="line-clamp-2 min-h-[2.5em] w-full text-[11px] font-semibold leading-tight text-[#1D1D1F] transition-colors group-hover:text-black sm:text-[13px]">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
