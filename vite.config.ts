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
      const [{ default: prerender }, { default: PuppeteerRenderer }, { getTeamMemberRoutes }] =
        await Promise.all([
          import("@prerenderer/rollup-plugin"),
          import("@prerenderer/renderer-puppeteer"),
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
        "/glossary",
        "/demo",
        "/contact",
        ...teamRoutes,
        // NOTE: /backend and /backend/login intentionally excluded —
        // admin-only, must remain client-rendered and unindexed.
      ];

      // Vercel build environments lack the system libs that bundled
      // Chromium needs. Use @sparticuz/chromium when running on Vercel
      // (detected via VERCEL env var), otherwise fall back to puppeteer's
      // bundled Chromium for local builds.
      const rendererOptions: any = {
        renderAfterTime: 3000,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      };

      if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
        const chromium = (await import("@sparticuz/chromium")).default;
        rendererOptions.executablePath = await chromium.executablePath();
        rendererOptions.args = [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"];
      }

      plugins.push(
        prerender({
          routes,
          renderer: new PuppeteerRenderer(rendererOptions),
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
