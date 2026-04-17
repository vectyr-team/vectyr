import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || "https://bhwjpaogtxhapiyhvjlc.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJod2pwYW9ndHhoYXBpeWh2amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NjY5MDQsImV4cCI6MjA5MTU0MjkwNH0.4B9M4IaP1M1KWwt9NfR3morO1S4rrfs0BvxXScLsUI0";

/**
 * Fetches all team member slugs from Supabase at build time.
 * Returns an array of route paths like ["/team/john-doe", "/team/jane-smith"].
 * Failures return an empty array so the build doesn't break.
 */
export async function getTeamMemberRoutes(): Promise<string[]> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data, error } = await supabase
      .from("team_members")
      .select("slug");

    if (error) {
      console.warn("[prerender] Failed to fetch team slugs:", error.message);
      return [];
    }

    const routes = (data || [])
      .map((m: { slug: string }) => m.slug)
      .filter(Boolean)
      .map((slug: string) => `/team/${slug}`);

    console.log(`[prerender] Found ${routes.length} team member routes`);
    return routes;
  } catch (err) {
    console.warn("[prerender] Error fetching team slugs:", err);
    return [];
  }
}
