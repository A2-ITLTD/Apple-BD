import HelpPageNav from "@/components/Policy/HelpPageNav";
import FaqPageContent from "@/components/Policy/FaqPageContent";
import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("Frequently Asked Questions"),
    getStoreName(),
  ]);
  return {
    title,
    description: `Get answers to common questions about ordering, shipping, payments, returns, and product authenticity at ${storeName} Bangladesh.`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://applebd.com"}/faq`,
    },
  };
}

export default function FaqPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <FaqPageContent />
    </div>
  );
}
