const types = [
    'build',
    'chore',
    'ci',
    'docs',
    'feat',
    'fix',
    'refactor',
    'revert',
    'style',
    'test'
  ],
  typeEnum = {
    rules: {
      'type-enum': [2, 'always', types]
    },
    value: () => {
      return types
    }
  }

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': typeEnum.rules['type-enum'],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
}
