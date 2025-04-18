import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginNext from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import * as tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/.next/**',
      '**/node_modules/**',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/*.config.mjs',
      '**/*.config.ts',
    ],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      prettier: eslintPluginPrettier,
      '@next/next': eslintPluginNext,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@next/next/no-html-link-for-pages': 'off', // optional
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: 'tsconfig.json',
      },
    },
  },
  eslintConfigPrettier,
];
