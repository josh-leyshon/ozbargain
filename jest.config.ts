import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo/universal',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

export default config;
