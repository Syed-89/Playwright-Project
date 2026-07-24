import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment-specific variables (.env.dev, .env.staging, .env.prod, etc.)
dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.ENV || 'dev'}`),
});
// Fallback to a generic .env if the environment-specific file doesn't exist
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';
const CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // Fail the build on CI if test.only is left in the source
  forbidOnly: CI,

  // Retries: none locally (fail fast for debugging), 2x on CI (handle flakiness)
  retries: CI ? 2 : 0,

  // Parallelism
  fullyParallel: false,
  //workers: CI ? 4 : undefined,

  // Global timeouts
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          BASE_URL,
          ENV: process.env.ENV || 'dev',
          NODE_VERSION: process.version,
        },
      },
    ],
    ...(CI ? [['github'] as const] : []),
  ],

  use: {
    headless: false,
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  /*   {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    }, */
  ],
});
