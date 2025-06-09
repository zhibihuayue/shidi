/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-08-14 11:45:32
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-08-22 17:25:45
 * @FilePath: /Component-Gallery/.eslintrc.cjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-unused-vars': ['error', { varsIgnorePattern: '.*', args: 'none' }],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'kebab-case',
      {
        registeredComponentsOnly: false,
        ignores: []
      }
    ],
    'vue/prop-name-casing': ['error', 'camelCase'],
    'vue/require-v-for-key': 'error',
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: false
      }
    ],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'no-useless-escape': 0,
    'vue/no-deprecated-destroyed-lifecycle': 'off',
    'vue/no-deprecated-dollar-listeners-api': 'off',
    'vue/no-undef-properties': [
      'error',
      {
        ignores: [
          'pxToRem',
          '$globalEventBus',
          '$classNames',
          'realPx',
          '$confirm',
          '$ELEMENT'
        ]
      }
    ],
    '@typescript-eslint/no-use-before-define': 'off',

    // "vue/no-unused-components": "off",
    // "vue/require-valid-default-prop": "off",
    // "vue/require-prop-type-constructor":"off",
    // "vue/component-name-in-template-casing":'off',
    // "vue/no-undef-properties":'off'
  },
  globals: {
    pxToRem: 'readonly',
    Cesium: 'readonly'
  }
}
