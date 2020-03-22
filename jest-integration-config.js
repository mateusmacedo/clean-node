module.exports = {
  coverageReporters: ['json', 'text'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/tests/**/*.test.ts']
}
