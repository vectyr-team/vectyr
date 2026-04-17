import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins: any[] = [
    react(),
    mode === "development" && componentTagger(),
  ];

  // Prerender for production builds only — generates static HTML per route
  // so JSON-LD (and other React-injected head/body content) is present in
  // the initial HTML response for crawlers that don't execute JS.
  if (mode === "production") {
    try {
      const [{ default: prerender }, { default: JSDOMRenderer }, { getTeamMemberRoutes }] =
        await Promise.all([
          import("@prerenderer/rollup-plugin"),
          import("@prerenderer/renderer-jsdom"),
          import("./scripts/get-team-slugs"),
        ]);

      const teamRoutes = await getTeamMemberRoutes();

      const routes = [
        "/",
        "/about",
        "/team",
        "/brand-os",
        "/site-ops",
        "/faqs",
        "/demo",
        "/contact",
        ...teamRoutes,
        // NOTE: /backend and /backend/login intentionally excluded —
        // admin-only, must remain client-rendered and unindexed.
      ];

      plugins.push(
        prerender({
          routes,
          renderer: new JSDOMRenderer({
            renderAfterTime: 3000,
          }),
        })
      );
    } catch (err) {
      console.warn("[vite] Prerender plugin not loaded:", err);
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: plugins.filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
