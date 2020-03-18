module.exports = {
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: ['<rootDir>/tests/**/*.spec.ts']
}
