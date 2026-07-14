import { NextResponse } from "next/server";

export function GET() {
  const base = "https://www.vitaketo.app";
  const pages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/info", priority: "0.9", changefreq: "monthly" },
    { url: "/rezepte", priority: "0.8", changefreq: "weekly" },
    { url: "/startplan", priority: "0.8", changefreq: "monthly" },
    { url: "/ampel", priority: "0.7", changefreq: "monthly" },
    { url: "/rechner", priority: "0.7", changefreq: "monthly" },
    { url: "/frauen", priority: "0.7", changefreq: "monthly" },
    { url: "/geldbeutel", priority: "0.7", changefreq: "monthly" },
    { url: "/keto-flu", priority: "0.6", changefreq: "monthly" },
    { url: "/supplemente", priority: "0.6", changefreq: "monthly" },
    { url: "/agb", priority: "0.3", changefreq: "yearly" },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
