import HelpPageNav from "@/components/Policy/HelpPageNav";
import ContactContent from "@/components/ContactContent";
import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("Contact Us"),
    getStoreName(),
  ]);
  return {
    title,
    description: `Get in touch with ${storeName} customer support. We are here to help with your orders, returns, and product queries.`,
    openGraph: {
      title: `Contact ${storeName} — Customer Support Bangladesh`,
      description:
        "Reach our support team for help with orders, returns, and product queries.",
      type: "website",
    },
  };
}

export default function ContactPage() {
  return (
      <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <ContactContent />
    </div>
  );
}
