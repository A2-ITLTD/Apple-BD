import HelpPageNav from "@/components/Policy/HelpPageNav";
import ReturnAccordion from "@/components/Policy/ReturnAccordion";

import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("Return & Replacement Policy"),
    getStoreName(),
  ]);
  return {
    title,
    description: `${storeName}'s hassle-free return and replacement policy. Learn how to return products, get refunds, and replacement timelines for your orders in Bangladesh.`,
  };
}

export default function ReturnsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <ReturnAccordion />
      </div>
    </div>
  );
}
