// jest.config.js
module.exports = {
    roots: ['<rootDir>/src'],
    testMatch: ['/tests//*.spec.ts'],
    transform: {
        '^.+\.tsx?$': 'ts-jest',
    },
};