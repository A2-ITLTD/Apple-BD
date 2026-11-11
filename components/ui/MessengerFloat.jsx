"use client";

import { FaFacebookMessenger } from "react-icons/fa";
import { useStoreSettings } from "@/components/context/StoreSettingsContext";

export default function MessengerFloat() {
  const { socialLinks } = useStoreSettings();
  const messengerEnabled = socialLinks?.facebook?.enabled !== false;

  if (!messengerEnabled) return null;

  return (
    <a
      href="https://m.me/101913646023588"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on Facebook"
      title="Chat with us on Facebook"
      className="group fixed bottom-16 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#0866FF] text-white shadow-lg transition hover:scale-105 hover:bg-[#0757D5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0866FF] focus-visible:ring-offset-2"
    >
      <FaFacebookMessenger aria-hidden="true" className="h-6 w-6" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#1D1D1F] px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
