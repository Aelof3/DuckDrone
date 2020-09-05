module.exports = {
    root: true,
    env: {
      node: false,
      browser: true,
      es6: true
    },
    'extends': [
      'eslint:recommended'
    ],
    rules: {
      'no-console': 'off',
      'no-debugger': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off'
    },
    parserOptions: {
      "ecmaVersion": '2018',
      "sourceType": "module",
      parser: 'babel-eslint',
      modules: true
    }
  }
  