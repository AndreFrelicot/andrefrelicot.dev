import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "andrefrelicot-dev",
    compatibilityDate: "2026-11-09",
    domains: ["andrefrelicot.dev"],
    assets: {
      notFoundHandling: "404-page",
    },
  },
});
