const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  globalSetup: "./tests/setup.ts",
  transform: {
    ...tsJestTransformCfg,
  },
};