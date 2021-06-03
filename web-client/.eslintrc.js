module.exports = {
  root: true,
  extends: ['plugin:vue/essential'],
  env: {
    node: true
  },
  rules: {
    'operator-linebreak': 0,
    'arrow-parens': 0,
    'no-constant-condition': 0,
    'no-return-assign': 0,
    'no-cond-assign': 0,
    'no-func-assign': 0,
    'no-empty': 0,
    'padded-blocks': 0,
    'no-unmodified-loop-condition': 0,
    'space-before-function-paren': 0,
    'no-useless-escape': 0,
    'template-curly-spacing': [2, 'always'],
    semi: [2, 'always'],
    quotes: [2, 'single', 'avoid-escape'],
    // allow async-await
    'generator-star-spacing': 0,
    curly: ['error', 'all']
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
