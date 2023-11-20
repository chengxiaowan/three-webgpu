import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "./environments",
  plugins: [vue()],
  build: {
    emptyOutDir: true,
    target:'esnext',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3002,
    proxy: {
      "/api/": "http://192.168.30.111:6971/",
    },
  },
  optimizeDeps:{
    esbuildOptions:{
      target:'esnext'
    }
  }
})
