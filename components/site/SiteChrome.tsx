"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LiveChat } from "./LiveChat";

const APP_PREFIXES = ["/portal/dashboard"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isApp = APP_PREFIXES.some((p) => pathname.startsWith(p));

  if (isApp) return <>{children}</>;
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <LiveChat />
    </>
  );
}
