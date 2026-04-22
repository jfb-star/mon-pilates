import { defineConfig } from "vitest/config"
import path from "node:path"

// Note: vite-tsconfig-paths is not currently a devDependency. The manual alias
// below is functionally equivalent for this codebase's single `@/*` mapping.
// If the plugin is added later, you can replace the `resolve.alias` block with:
//   import tsconfigPaths from "vite-tsconfig-paths"
//   plugins: [tsconfigPaths()]
// and keep only the `server-only` alias.

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    environment: "node",
    globals: false,
    setupFiles: ["./tests/unit/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/**/*.d.ts",
        "src/lib/prisma.ts",
        "src/lib/mock-data.ts",
        "src/lib/structured-data.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Next.js marker module that has no runtime in vitest — stub it out.
      "server-only": path.resolve(__dirname, "./tests/unit/__stubs__/server-only.ts"),
    },
  },
})
