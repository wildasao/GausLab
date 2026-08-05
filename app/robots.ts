import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://gauslab.com.au/sitemap.xml",
    host: "https://gauslab.com.au",
  };
}
