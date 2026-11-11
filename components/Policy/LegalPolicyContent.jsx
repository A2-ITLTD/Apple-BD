"use client";

import { useStoreSettings } from "@/components/context/StoreSettingsContext";
import PolicyHeader from "@/components/Policy/PolicyHeader";

const PAGE_CONFIG = {
  privacy: {
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    title: "Privacy Policy",
    subtitle: "We are committed to protecting your information",
  },
  terms: {
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    title: "Terms & Conditions",
    subtitle: "Please read before using the site",
  },
};

export default function LegalPolicyContent({ type }) {
  const { storeName, policyContent } = useStoreSettings();
  const config = PAGE_CONFIG[type];
  const sections = policyContent?.[type] || [];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
      <PolicyHeader
        icon={config.icon}
        title={config.title}
        subtitle={config.subtitle}
      />
      {sections.length > 0 ? (
        <>
          {type === "privacy" ? (
            <p className="mb-6 text-sm leading-relaxed text-[#6B7280]">
              {storeName || "AppleBD"} is committed to protecting your personal information.
            </p>
          ) : (
            <p className="mb-6 text-sm leading-relaxed text-[#6B7280]">
              By using {storeName || "AppleBD"}, you agree to these terms and conditions.
            </p>
          )}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <section key={`${section.heading}-${index}`} className="border-l-4 border-gray-300 pl-4">
                <h2 className="mb-2 text-base font-semibold text-[#1F2937]">
                  {section.heading}
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#6B7280]">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-400">No information available.</p>
      )}
    </div>
  );
}
