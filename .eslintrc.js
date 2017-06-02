// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: ['html'],
  // add your custom rules here
  rules: {
    'brace-style': [0, '1tbs'],
    eqeqeq: 0,
    // 必须使用全等
    indent: [0, 2],
    // 缩进风格
    'padded-blocks': 0,
    // 块语句内行首行尾是否要空行
    'no-irregular-whitespace': 0,
    // 不能有不规则的空格--不验证
    'no-cond-assign': 0,
    // 禁止在条件表达式中使用赋值语句--不验证
    'no-multi-spaces': 0,
    'space-before-function-paren': [0],
    /*
    0：表示不验证
    1：验证不对的话，以警告的方式提示
    2 : 验证不对的话，以异常的方式抛出*/
    "space-before-function-paren": [0],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'eol-last': 0,
    // 文件以单一的换行符结束
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
