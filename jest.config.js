module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  testPathIgnorePatterns: ['src/__tests__/schemas'],
};
