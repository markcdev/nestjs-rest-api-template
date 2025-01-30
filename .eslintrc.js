module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // 1️⃣ NestJS imports (always first)
          ['^@nestjs'],

          // 2️⃣ Path aliases (e.g., @modules, @services)
          ['^@\\w+'],

          // 3️⃣ External packages (Node.js built-ins, then npm packages)
          ['^node:', '^\\w'],

          // 4️⃣ Absolute imports (if applicable)
          ['^/'],

          // 5️⃣ Parent imports (../../ before ../)
          ['^\\.\\./\\.\\./', '^\\.\\./'],

          // 6️⃣ Relative imports (always last)
          ['^\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
  },
};
