import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      preset: 'jest-expo/android',
      setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
    },
    {
      preset: 'jest-expo/ios',
      setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
    },
    {
      preset: 'jest-expo/web',
      testMatch: ['**/__tests__/**/*.test.(web|node).ts?(x)'],
    },
  ],
};

export default config;
