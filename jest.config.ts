import type { Config } from 'jest';

const config: Config = {
  projects: [
    { preset: 'jest-expo/android' },
    { preset: 'jest-expo/ios' },
    {
      preset: 'jest-expo/web',
      testMatch: ['**/__tests__/**/*.test.(web|node).ts?(x)'],
    },
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

export default config;
