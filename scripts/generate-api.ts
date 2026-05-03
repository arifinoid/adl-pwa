import { spawnSync } from "child_process";

/**
 * Cross-platform script to generate API types using openapi-typescript.
 * This handles environment variables and URL fallbacks consistently
 * across different operating systems and CI environments (like Vercel).
 */

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const swaggerUrl = `${apiUrl}/swagger/json`;
const outputPath = "lib/api/types.ts";

console.log(`🚀 Fetching OpenAPI schema from: ${swaggerUrl}`);

const result = spawnSync(
  "bunx",
  ["openapi-typescript", swaggerUrl, "-o", outputPath],
  {
    stdio: "inherit",
    shell: true,
  }
);

if (result.status !== 0) {
  console.error(`❌ Failed to generate API types from ${swaggerUrl}`);
  console.error("Make sure your backend server is running and accessible.");
  process.exit(1);
}

console.log(`✅ API types successfully generated to ${outputPath}`);
