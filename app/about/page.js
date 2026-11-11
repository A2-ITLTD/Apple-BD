import HelpPageNav from "@/components/Policy/HelpPageNav";
import AboutPageContent from "@/components/Policy/AboutPageContent";
import { siteTitle, getStoreName } from "@/lib/storeMeta";

export async function generateMetadata() {
  const [title, storeName] = await Promise.all([
    siteTitle("About Us"),
    getStoreName(),
  ]);
  return {
    title,
    description: `${storeName} brings you curated gadgets and electronics with fast shipping across Bangladesh.`,
    openGraph: {
      title: `About ${storeName} — Online Shopping Bangladesh`,
      description: `Learn about ${storeName} — your one-stop destination for authentic gadgets & electronics in Bangladesh.`,
      type: "website",
    },
  };
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-2 pb-10 sm:pt-3 sm:pb-16">
      <HelpPageNav />
      <AboutPageContent />
    </div>
  );
}
