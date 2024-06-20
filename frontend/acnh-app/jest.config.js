// frontend/jest.config.js
module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!axios).+\\.js$'
    ],
};