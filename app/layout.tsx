import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site/SiteChrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gauslab.com.au"),
  title: {
    default: "GausLab Maths Academy — NAPLAN Tutoring for Years 3, 5, 7 & 9",
    template: "%s · GausLab Maths Academy",
  },
  description:
    "Australia's premium maths tutoring for Years 3, 5, 7 and 9. Personalised NAPLAN preparation, online and in Sydney. Book a free diagnostic assessment.",
  keywords: [
    "NAPLAN Maths Tutor",
    "Online Maths Tutoring Australia",
    "Maths Tutor Sydney",
    "NAPLAN Preparation",
    "Year 3 5 7 9 maths",
  ],
  openGraph: {
    type: "website",
    title: "GausLab Maths Academy — NAPLAN Tutoring for Years 3, 5, 7 & 9",
    description:
      "Personalised NAPLAN maths tutoring for Australian students. Book a free diagnostic assessment.",
    url: "https://gauslab.com.au",
    siteName: "GausLab Maths Academy",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "GausLab Maths Academy",
    description:
      "Personalised NAPLAN maths tutoring for Australian students in Years 3, 5, 7 and 9.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "GausLab Maths Academy",
  url: "https://gauslab.com.au",
  logo: "https://gauslab.com.au/logo.png",
  sameAs: [
    "https://facebook.com/gauslab",
    "https://instagram.com/gauslab",
    "https://linkedin.com/company/gauslab",
    "https://youtube.com/@gauslab",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Level 3, 88 George Street",
    addressLocality: "Sydney",
    addressRegion: "NSW",
    postalCode: "2000",
    addressCountry: "AU",
  },
  telephone: "+61-2-1234-5678",
  email: "hello@gauslab.com.au",
  areaServed: "AU",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "320",
  },
  offers: {
    "@type": "OfferCatalog",
    name: "Maths Tutoring Programs",
    itemListElement: [
      { "@type": "Course", name: "Year 3 Maths & NAPLAN Prep" },
      { "@type": "Course", name: "Year 5 Maths & NAPLAN Prep" },
      { "@type": "Course", name: "Year 7 Maths & NAPLAN Prep" },
      { "@type": "Course", name: "Year 9 Maths & NAPLAN Prep" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-dvh bg-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy-800 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteChrome>{children}</SiteChrome>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
