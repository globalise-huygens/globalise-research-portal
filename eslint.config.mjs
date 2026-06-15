import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import router from '@tanstack/eslint-plugin-router';
import unusedImports from 'eslint-plugin-unused-imports';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

const reactPackages = [
  'packages/app/**/*.{ts,tsx}',
  'packages/design/**/*.{ts,tsx}',
  'packages/diplomatic/**/*.{ts,tsx}',
  'packages/document/**/*.{ts,tsx}',
  'packages/facsimile/**/*.{ts,tsx}',
  'packages/line-by-line/**/*.{ts,tsx}',
  'packages/manifest/**/*.{ts,tsx}',
];

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/routeTree.gen.ts',
      '**/*.config.{js,ts,mjs,cjs}',
      'eslint.config.js',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      'unused-imports': unusedImports,
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ['warn', 'type'],
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      'curly': ['error', 'all'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowNumber: true,
        allowBoolean: true,
      }],
      '@typescript-eslint/no-confusing-void-expression': ['error', {
        ignoreArrowShorthand: true
      }],
      'arrow-body-style': ['error', 'as-needed'],

      // TODO: enable
      '@typescript-eslint/no-unsafe-assignment': 'off', // Unsafe assignment of an `any` value
      '@typescript-eslint/no-unnecessary-condition': 'off', // Unnecessary optional chain on a non-nullish value
      '@typescript-eslint/no-unsafe-argument': 'off', //Unsafe argument of type `any` assigned to a parameter of type `Error`
      '@typescript-eslint/no-dynamic-delete': 'off', // Do not delete dynamically computed property keys
    },
  },

  {
    files: reactPackages,
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  {
    files: [
      'packages/app/**/*.{ts,tsx}',
    ],
    plugins: {
      '@tanstack/router': router,
    },
    rules: {
      ...router.configs.recommended.rules,
    },
  },

  {
    files: ['**/*.spec.{ts,tsx}'],
    rules: {},
  },
);