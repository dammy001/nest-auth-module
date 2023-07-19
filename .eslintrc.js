module.exports = {
  extends: ['@damilaredev/eslint-config', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'off',
    'no-useless-constructor': 'off',
    'no-return-await': 'off',
  },
};
