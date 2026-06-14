module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@components/(.*)$': '<rootDir>/src/design-system/components/$1',
    '^@screens/(.*)$': '<rootDir>/src/screens/$1',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1'
  }
};
