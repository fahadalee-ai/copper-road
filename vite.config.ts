import type { Plugin } from "vite";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

function legacyPathRedirect(): Plugin {
  const handler = (req: { url?: string }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: () => void }, next: () => void) => {
    const path = (req.url ?? "").split("?")[0];
    const target =
      path === "/copper-road" || path === "/copper-road/"
        ? "/"
        : path === "/copper-road/preview.html"
          ? "/preview.html"
          : "";
    if (!target) return next();
    res.statusCode = 302;
    res.setHeader("Location", target);
    res.end();
  };
  return {
    name: "legacy-path-redirect",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig({
  plugins: [legacyPathRedirect()],
  nitro: { preset: "vercel" },
  vite: {
    base: "/",
    server: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
    preview: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
  },
});
