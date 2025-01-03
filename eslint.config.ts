import neostandardPlugin, { plugins } from 'neostandard';

const createConfig = plugins['typescript-eslint'].config;

const neostandardConfig = neostandardPlugin({
  files: ['**/*.{t,j}sx?'],
  ignores: ['node_modules', 'dist', 'src-tauri'],
  ts: true,
  filesTs: ['**/*.tsx?'],
  noStyle: true,
});

const tsEslintConfig = createConfig(
  plugins['typescript-eslint'].configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error'],
      '@typescript-eslint/no-confusing-void-expression': ['error', {
        ignoreArrowShorthand: true,
      }],
      'no-void': ['error', {
        allowAsStatement: true,
      }],
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowBoolean: true,
        allowNumber: true,
      }],
      '@typescript-eslint/no-misused-promises': ['error', {
        checksVoidReturn: false,
      }],
    },
  },
  {
    files: ['**/*.jsx?'],
    extends: [plugins['typescript-eslint'].configs.disableTypeChecked],
  },
);

export default [
  ...neostandardConfig,
  ...tsEslintConfig,
];
