import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Next.js marker module that has no runtime in vitest — stub it out.
      "server-only": path.resolve(__dirname, "./tests/unit/__stubs__/server-only.ts"),
    },
  },
})
