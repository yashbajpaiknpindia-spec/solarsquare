import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "/",
    server: {
      host: "::",
      port: 8080,
      hmr: { overlay: false },
      // In dev, proxy API calls to the Express server
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            charts: ["recharts"],
            ui: [
              "@radix-ui/react-accordion",
              "@radix-ui/react-dialog",
              "@radix-ui/react-tabs",
              "framer-motion",
            ],
          },
        },
      },
    },
    plugins: [
      react(),
      // Inline VITE_ env vars into index.html at build time
      // (replaces %VITE_GA_MEASUREMENT_ID% etc.)
      {
        name: "html-env-inject",
        transformIndexHtml(html) {
          return html.replace(/%(\w+)%/g, (_, key) => env[key] ?? "");
        },
      },
    ].filter(Boolean),
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    // Make VITE_ env vars available to React components
    define: {
      __GA_ID__: JSON.stringify(env.VITE_GA_MEASUREMENT_ID || ""),
    },
  };
});
