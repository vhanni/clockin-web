module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es6': true,
    'node': true,
  },
  'extends': 'plugin:vue/recommended',
  'plugins': ['vue'],
  'parserOptions': {
    'parser': 'babel-eslint',
    'sourceType': 'module',
    'ecmaVersion': 8
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
