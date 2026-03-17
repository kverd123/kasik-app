/**
 * Kaşık — Jest Setup
 * Global mocks for React Native, Firebase, Expo modules
 */

// === AsyncStorage Mock ===
const mockStore = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn((key) => Promise.resolve(mockStore[key] || null)),
    setItem: jest.fn((key, value) => {
      mockStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key) => {
      delete mockStore[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStore).forEach((k) => delete mockStore[k]);
      return Promise.resolve();
    }),
  },
}));

// === Firebase App Mock ===
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

// === Firebase Auth Mock ===
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getReactNativePersistence: jest.fn(),
  initializeAuth: jest.fn(),
}));

// === Firestore Mock ===
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(() => new Date()),
  arrayUnion: jest.fn(),
  arrayRemove: jest.fn(),
  increment: jest.fn(),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  Timestamp: {
    fromDate: jest.fn((d) => ({ toDate: () => d })),
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

// === expo-haptics Mock ===
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// === expo-notifications Mock ===
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// === expo-constants Mock ===
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: { extra: {} },
  },
}));

// === react-native-reanimated Mock ===
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn((init) => ({ value: init })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((val) => val),
  withSpring: jest.fn((val) => val),
  withRepeat: jest.fn((val) => val),
  runOnJS: jest.fn((fn) => fn),
  Easing: { inOut: jest.fn(), bezier: jest.fn() },
}));

// === @react-native-community/netinfo Mock ===
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
}));

// === lib/firebase Mock ===
jest.mock('./lib/firebase', () => ({
  app: {},
  auth: {},
  db: {},
}));

// === lib/firestoreSync Mock ===
jest.mock('./lib/firestoreSync', () => ({
  syncToFirestore: jest.fn(),
  getAuthUserId: jest.fn(() => null),
  initializeSync: jest.fn(),
}));

// === lib/networkMonitor Mock ===
jest.mock('./lib/networkMonitor', () => ({
  isOnline: jest.fn(() => true),
  startNetworkMonitor: jest.fn(),
  stopNetworkMonitor: jest.fn(),
  onNetworkChange: jest.fn(() => jest.fn()),
}));

// === lib/syncQueue Mock ===
jest.mock('./lib/syncQueue', () => ({
  loadSyncQueue: jest.fn(() => Promise.resolve()),
  enqueue: jest.fn(() => Promise.resolve()),
  flushQueue: jest.fn(() => Promise.resolve()),
  getQueueLength: jest.fn(() => 0),
  onQueueChange: jest.fn(() => jest.fn()),
}));

// === lib/firestore Mock ===
jest.mock('./lib/firestore', () => ({
  saveWeekMealPlan: jest.fn(() => Promise.resolve()),
  getAllWeekMealPlans: jest.fn(() => Promise.resolve({})),
  addPantryItem: jest.fn(() => Promise.resolve()),
  getPantryItems: jest.fn(() => Promise.resolve([])),
  removePantryItem: jest.fn(() => Promise.resolve()),
  updatePantryItem: jest.fn(() => Promise.resolve()),
  saveBabyProfile: jest.fn(() => Promise.resolve()),
  getBabyProfiles: jest.fn(() => Promise.resolve([])),
  updateBabyProfile: jest.fn(() => Promise.resolve()),
  logAnalyticsBatch: jest.fn(() => Promise.resolve()),
  saveRecipeBookEntry: jest.fn(() => Promise.resolve()),
  getRecipeBookEntries: jest.fn(() => Promise.resolve([])),
  removeRecipeBookEntry: jest.fn(() => Promise.resolve()),
  updateRecipeBookEntry: jest.fn(() => Promise.resolve()),
  saveAllergenProgram: jest.fn(() => Promise.resolve()),
  getAllergenPrograms: jest.fn(() => Promise.resolve([])),
  updateAllergenProgram: jest.fn(() => Promise.resolve()),
}));

// === lib/analytics Mock (for tests that import modules using analytics) ===
jest.mock('./lib/analytics', () => ({
  initAnalytics: jest.fn(),
  setAnalyticsUser: jest.fn(),
  clearAnalyticsUser: jest.fn(),
  logEvent: jest.fn(),
  logScreenView: jest.fn(),
  flushEvents: jest.fn(() => Promise.resolve()),
  analytics: {
    screenView: jest.fn(),
    recipeView: jest.fn(),
    recipeLike: jest.fn(),
    recipeUnlike: jest.fn(),
    recipeBookmark: jest.fn(),
    recipeUnbookmark: jest.fn(),
    recipeShare: jest.fn(),
    recipeSearch: jest.fn(),
    mealAdd: jest.fn(),
    mealComplete: jest.fn(),
    mealRemove: jest.fn(),
    weekNavigate: jest.fn(),
    pantryItemAdd: jest.fn(),
    pantryItemRemove: jest.fn(),
    postCreate: jest.fn(),
    postLike: jest.fn(),
    postComment: jest.fn(),
    postShare: jest.fn(),
    aiRecipeGenerate: jest.fn(),
    aiRecipeSave: jest.fn(),
    shoppingListGenerate: jest.fn(),
    shoppingListShare: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    onboardingStep: jest.fn(),
    onboardingComplete: jest.fn(),
  },
}));

// === lib/logger Mock ===
jest.mock('./lib/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// === lib/debouncedStorage Mock ===
jest.mock('./lib/debouncedStorage', () => ({
  debouncedSetItem: jest.fn((key, value) => {
    // Hemen yaz (test ortamında debounce yok)
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.setItem(key, value);
  }),
  flushKey: jest.fn(),
  cancelAll: jest.fn(),
  getPendingCount: jest.fn(() => 0),
}));

// === stores/themeStore Mock ===
jest.mock('./stores/themeStore', () => ({
  useThemeStore: Object.assign(
    jest.fn((selector) => {
      const state = { mode: 'system', isDark: false, isLoaded: true, loadFromStorage: jest.fn(), setMode: jest.fn(), _updateIsDark: jest.fn() };
      return selector ? selector(state) : state;
    }),
    { getState: jest.fn(() => ({ mode: 'system', isDark: false, isLoaded: true, loadFromStorage: jest.fn(), setMode: jest.fn(), _updateIsDark: jest.fn() })) }
  ),
}));

// === hooks/useColors Mock ===
jest.mock('./hooks/useColors', () => ({
  useColors: jest.fn(() => ({
    sage: '#A3BA91', sageDark: '#8FAA7B', sageLight: '#D4E0C8', sagePale: '#E8F5E0',
    cream: '#F7F3ED', creamDark: '#E8E2D8', creamMid: '#F0EBE3',
    peach: '#F5C0A0', peachLight: '#FFF3E0', blueLight: '#E8F0FA', blueMid: '#5B7BA8',
    textDark: '#3A3A2A', textMid: '#6A6A5A', textLight: '#A0997E', textOnPrimary: '#FFFFFF',
    warning: '#F5D590', warningDark: '#C4882B', warningBg: '#FFF0E0',
    heart: '#F5A0A0', heartDark: '#C06070',
    success: '#6B8F55', successBg: '#E8F5E0',
    info: '#5B7BA8', infoDark: '#3D5A80', infoBg: '#E8F0FA',
    danger: '#D95555', dangerDark: '#B33A3A', dangerBg: '#FDECEC',
    white: '#FFFFFF', black: '#000000', border: '#D4CFC5',
    cardShadow: 'rgba(143, 170, 123, 0.08)', overlay: 'rgba(0, 0, 0, 0.4)',
    bgStart: '#F7F3ED', bgEnd: '#F0EBE3', headerStart: '#A3BA91', headerEnd: '#8FAA7B',
  })),
}));
