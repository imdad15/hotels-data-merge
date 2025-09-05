module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/src/config/",
    "/src/infrastructure/",
    "/src/server.ts",
    ".test.ts$",
    ".spec.ts$",
    "index.ts",
  ],
  testTimeout: 10000, // 10 seconds
  detectOpenHandles: true, // Helps identify unclosed handles
  forceExit: true, // Force Jest to exit after tests complete
  clearMocks: true,
  resetModules: true,
  restoreMocks: true,
};
