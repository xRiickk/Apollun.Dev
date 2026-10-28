import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://apollundev.com", lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: "https://apollundev.com/politica-de-privacidade", lastModified: new Date(), changeFrequency: "yearly", priority: .3 },
    { url: "https://apollundev.com/termos-de-uso", lastModified: new Date(), changeFrequency: "yearly", priority: .3 },
  ];
}
