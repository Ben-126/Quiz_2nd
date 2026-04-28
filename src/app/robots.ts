import type { MetadataRoute } from "next";

const BASE_URL = "https://quiz-2nd-q5pu.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/parametres", "/scan"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
