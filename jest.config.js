module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|expo-modules-core|react-native-svg|zustand|firebase)/)',
  ],
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    'stores/**/*.ts',
    '!lib/firebase.ts',
    '!lib/firestore.ts',
    '!lib/auth.ts',
    '!lib/notifications.ts',
    '!lib/storage.ts',
  ],
};
