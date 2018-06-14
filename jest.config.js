module.exports = {
  projects: [
    {
      displayName: 'Test',
      testMatch: ['<rootDir>/**/*.spec.js']
    },
    {
      displayName: 'Lint',
      runner: 'jest-runner-eslint',
      testMatch: ['<rootDir>/**/*?(.spec).js']
    }
  ]
}
