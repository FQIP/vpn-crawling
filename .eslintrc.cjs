/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'eslint:recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    // "sort-keys": ["error", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}]
    'import/order': [
      'error',
      {
        // 对导入模块进行分组
        groups: [
          'builtin',
          'external',
          ['internal', 'sibling', 'parent', 'index', 'object', 'type'],
          'unknown'
        ],
        // 通过路径自定义分组
        pathGroups: [
          {
            // pattern：当前组中模块的最短路径匹配
            pattern: 'vue*',
            group: 'builtin',
            position: 'before'
          },
          {
            // pattern：当前组中模块的最短路径匹配
            pattern: 'react*',
            group: 'builtin',
            position: 'before'
          },
          {
            // pattern：当前组中模块的最短路径匹配
            pattern: 'ant*',
            group: 'builtin',
            position: 'before'
          },
          {
            // pattern：当前组中模块的最短路径匹配
            pattern: '@/**',
            group: 'external',
            position: 'after'
          }
        ],
        // 这个需要加上，否则pathGroups配置将不能生效
        pathGroupsExcludedImportTypes: [],
        // newlines-between 不同组之间是否进行换行
        // 'newlines-between': 'always',
        // alphabetize 根据字母顺序对每个组内的顺序进行排序
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    }
  ],
  settings: {
    'import/resolver': {
      typescript: true,
      node: true
    }
  }
}
