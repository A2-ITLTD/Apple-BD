import HelpPageNav from "@/components/Policy/HelpPageNav";
import LegalPolicyContent from "@/components/Policy/LegalPolicyContent";
import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("Terms & Conditions"),
    getStoreName(),
  ]);
  return {
    title,
    description: `Read ${storeName}'s terms and conditions governing the use of our online store, purchases, and services in Bangladesh.`,
  };
}

export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <LegalPolicyContent type="terms" />
    </div>
  );
}
