// eslint-disable-next-line import/extensions
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "use-swr-like",
    // Keeping globals to true triggers React Testing Library's auto cleanup
    // https://vitest.dev/guide/migration.html
    globals: true,
    environment: "jsdom",
    dir: "tests",
    reporters: "basic",
    setupFiles: ["tests/setup.ts"],
  },
});
