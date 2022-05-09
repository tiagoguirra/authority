module.exports = {
  collectCoverageFrom: [
    '**/*.{js,ts}',
    '!**/jest-*',
    '!**/jest.*',
    '!**/bin/**',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/*.test.{js,ts}',
    '!**/*_MOCK_.{js,ts}'
  ],
  moduleDirectories: ['node_modules'],
  testRegex: '.*\\.test.ts$',
  snapshotSerializers: [],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
}
