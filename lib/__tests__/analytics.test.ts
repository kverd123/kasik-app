/**
 * Kaşık — Analytics Service Tests
 * Tests the analytics module's public API, event structure, and semantic helpers.
 * The actual Firestore writes are mocked globally in jest.setup.js.
 */

// We test the MOCKED analytics (from jest.setup.js) to verify the API shape
// and the UNMOCKED module for structural tests
import {
  initAnalytics,
  logEvent,
  logScreenView,
  flushEvents,
  setAnalyticsUser,
  clearAnalyticsUser,
  analytics,
  AnalyticsEvent,
} from '../analytics';

describe('Analytics Service — API Shape', () => {
  it('exports all core functions', () => {
    expect(typeof initAnalytics).toBe('function');
    expect(typeof logEvent).toBe('function');
    expect(typeof logScreenView).toBe('function');
    expect(typeof flushEvents).toBe('function');
    expect(typeof setAnalyticsUser).toBe('function');
    expect(typeof clearAnalyticsUser).toBe('function');
  });

  it('exports analytics object with all semantic helpers', () => {
    const expectedKeys = [
      'screenView',
      'recipeView', 'recipeLike', 'recipeUnlike', 'recipeBookmark', 'recipeUnbookmark', 'recipeShare', 'recipeSearch',
      'mealAdd', 'mealComplete', 'mealRemove', 'weekNavigate',
      'pantryItemAdd', 'pantryItemRemove',
      'postCreate', 'postLike', 'postComment', 'postShare',
      'aiRecipeGenerate', 'aiRecipeSave',
      'shoppingListGenerate', 'shoppingListShare',
      'login', 'register', 'logout',
      'onboardingStep', 'onboardingComplete',
    ];

    for (const key of expectedKeys) {
      expect(typeof (analytics as any)[key]).toBe('function');
    }
  });

  it('all semantic helpers are callable without error', () => {
    expect(() => analytics.screenView('test')).not.toThrow();
    expect(() => analytics.recipeLike('r1')).not.toThrow();
    expect(() => analytics.recipeUnlike('r1')).not.toThrow();
    expect(() => analytics.recipeBookmark('r1')).not.toThrow();
    expect(() => analytics.recipeUnbookmark('r1')).not.toThrow();
    expect(() => analytics.recipeView('r1', 'Test Recipe')).not.toThrow();
    expect(() => analytics.recipeShare('r1')).not.toThrow();
    expect(() => analytics.recipeSearch('havuç', 5)).not.toThrow();
    expect(() => analytics.mealAdd('breakfast', 'Havuç Püresi')).not.toThrow();
    expect(() => analytics.mealComplete('Havuç Püresi')).not.toThrow();
    expect(() => analytics.mealRemove('Havuç Püresi')).not.toThrow();
    expect(() => analytics.weekNavigate('next')).not.toThrow();
    expect(() => analytics.pantryItemAdd('Elma', 'meyve')).not.toThrow();
    expect(() => analytics.pantryItemRemove('Elma')).not.toThrow();
    expect(() => analytics.postCreate('recipe')).not.toThrow();
    expect(() => analytics.postLike('p1')).not.toThrow();
    expect(() => analytics.postComment('p1')).not.toThrow();
    expect(() => analytics.postShare('p1')).not.toThrow();
    expect(() => analytics.aiRecipeGenerate('openai', 2)).not.toThrow();
    expect(() => analytics.aiRecipeSave('Test Tarif')).not.toThrow();
    expect(() => analytics.shoppingListGenerate(10)).not.toThrow();
    expect(() => analytics.shoppingListShare()).not.toThrow();
    expect(() => analytics.login('email')).not.toThrow();
    expect(() => analytics.register('email')).not.toThrow();
    expect(() => analytics.logout()).not.toThrow();
    expect(() => analytics.onboardingStep('baby-info')).not.toThrow();
    expect(() => analytics.onboardingComplete()).not.toThrow();
  });

  it('initAnalytics does not throw', () => {
    expect(() => initAnalytics()).not.toThrow();
    expect(() => initAnalytics('test-user')).not.toThrow();
  });

  it('setAnalyticsUser and clearAnalyticsUser do not throw', () => {
    expect(() => setAnalyticsUser('user-1')).not.toThrow();
    expect(() => clearAnalyticsUser()).not.toThrow();
  });

  it('logEvent does not throw', () => {
    expect(() => logEvent('test', { key: 'value' })).not.toThrow();
  });

  it('logScreenView does not throw', () => {
    expect(() => logScreenView('recipes')).not.toThrow();
  });

  it('flushEvents returns a promise', async () => {
    const result = flushEvents();
    expect(result).toBeInstanceOf(Promise);
    await result; // Should resolve without error
  });
});

describe('AnalyticsEvent type structure', () => {
  it('has the expected fields', () => {
    const event: AnalyticsEvent = {
      name: 'test_event',
      params: { key: 'value', count: 1, flag: true },
      userId: 'user-1',
      timestamp: Date.now(),
      platform: 'ios',
      sessionId: 'session-123',
    };

    expect(event.name).toBe('test_event');
    expect(event.params).toEqual({ key: 'value', count: 1, flag: true });
    expect(event.userId).toBe('user-1');
    expect(typeof event.timestamp).toBe('number');
    expect(event.platform).toBe('ios');
    expect(event.sessionId).toBe('session-123');
  });
});
