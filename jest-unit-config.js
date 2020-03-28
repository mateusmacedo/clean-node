module.exports = {
  coverageReporters: ['json', 'text'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  preset: '@shelf/jest-mongodb',
  testMatch: ['<rootDir>/tests/**/*.spec.ts']
}
