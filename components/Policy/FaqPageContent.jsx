"use client";

import { useStoreSettings } from "@/components/context/StoreSettingsContext";
import Accordion from "@/components/Policy/Accordion";
import PolicyHeader from "@/components/Policy/PolicyHeader";

const FAQ_ICON =
  "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";

export default function FaqPageContent() {
  const { policyContent } = useStoreSettings();
  const faqs = policyContent?.faq || [];
  const faqSchema = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <PolicyHeader
          icon={FAQ_ICON}
          title="Frequently Asked Questions"
          subtitle="Find answers to your questions here"
        />
        {faqs.length > 0 ? (
          <Accordion items={faqs} />
        ) : (
          <p className="text-sm text-gray-400">No information available.</p>
        )}
      </div>
    </>
  );
}
