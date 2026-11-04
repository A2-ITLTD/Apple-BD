import PageBanner from "@/components/ui/PageBanner";
import PolicyTabs from "./Sidebar";

export default function HelpPageNav() {
  return (
    <div className="mb-6 space-y-5">
      <PageBanner placement="help" />
      <PolicyTabs />
    </div>
  );
}
