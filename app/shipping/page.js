import HelpPageNav from "@/components/Policy/HelpPageNav";
import ShippingAccordion from "@/components/Policy/ShippingAccordion";

import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("Shipping Policy"),
    getStoreName(),
  ]);
  return {
    title,
    description: `Learn about ${storeName}'s delivery times, shipping charges, and areas we serve across Bangladesh.`,
  };
}

export default function ShippingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
        <ShippingAccordion />
      </div>
    </div>
  );
}
