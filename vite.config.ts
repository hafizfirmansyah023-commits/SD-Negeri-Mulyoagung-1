import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, Plugin } from "vite";

/**
 * Plugin Vite: blokir semua akses ke folder /backend/ via Vite dev server.
 * API yang sesungguhnya diproses oleh Apache (port 80), bukan Vite.
 * Mencegah source PHP terbaca via Vite saat development.
 */
function backendGuardPlugin(): Plugin {
  return {
    name: "backend-guard",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "";
        if (/^\/backend\//i.test(url)) {
          res.writeHead(403, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "403 Forbidden" }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), backendGuardPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== "true",
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
    build: {
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react';
            if (id.includes('cropperjs')) return 'cms';
            if (id.includes('motion') || id.includes('lucide-react') || id.includes('aos') || id.includes('gsap')) return 'ui';
          },
        },
      },
    },
  };
});