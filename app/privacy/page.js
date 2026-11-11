import HelpPageNav from "@/components/Policy/HelpPageNav";
import LegalPolicyContent from "@/components/Policy/LegalPolicyContent";
import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("Privacy Policy"),
    getStoreName(),
  ]);
  return {
    title,
    description: `Read ${storeName}'s privacy policy to understand how we collect, use, and protect your personal information when you shop with us in Bangladesh.`,
  };
}

export default function PrivacyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <LegalPolicyContent type="privacy" />
    </div>
  );
}
