import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE_URL = "https://vectyr.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Static routes — add new pages here and they'll appear in the sitemap automatically.
const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/team", changefreq: "monthly", priority: "0.8" },
  { path: "/demo", changefreq: "monthly", priority: "0.9" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/faqs", changefreq: "weekly", priority: "0.7" },
  { path: "/brand-os", changefreq: "monthly", priority: "0.8" },
  { path: "/site-ops", changefreq: "monthly", priority: "0.8" },
];

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;"
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Dynamic team member pages
    const { data: members } = await supabase
      .from("team_members")
      .select("slug, updated_at");

    const urls: string[] = [];

    for (const r of STATIC_ROUTES) {
      urls.push(
        `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
      );
    }

    for (const m of members ?? []) {
      if (!m.slug) continue;
      const lastmod = m.updated_at ? new Date(m.updated_at).toISOString().split("T")[0] : null;
      urls.push(
        `  <url>\n    <loc>${SITE_URL}/team/${escapeXml(m.slug)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
      status: 200,
    });
  } catch (err) {
    console.error("sitemap error", err);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});
