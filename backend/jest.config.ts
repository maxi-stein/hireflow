module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'test',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.module.ts', // exclude modules
    '!**/main.ts', // exclude main
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
