module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/server.ts'
  ],
  testMatch: ['<rootDir>/tests/**/*.ts'],
  coverageReporters: ['json'],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
