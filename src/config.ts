import path from 'path';
import dotenv from 'dotenv';

// Explicitly resolve and load .env from the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Base URL and users come from environment variables, never from test bodies.
// Defaults are the public Sauce Demo practice credentials.
const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';

export const config = {
  baseUrl,
  baseURL: baseUrl,
  password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  users: {
    standard: process.env.STANDARD_USER || 'standard_user',
    lockedOut: process.env.LOCKED_OUT_USER || 'locked_out_user',
    problem: process.env.PROBLEM_USER || 'problem_user',
    performanceGlitch: process.env.PERFORMANCE_GLITCH_USER || 'performance_glitch_user',
    error: process.env.ERROR_USER || 'error_user',
    visual: process.env.VISUAL_USER || 'visual_user',
  },
};

export type Config = typeof config;
export default config;
