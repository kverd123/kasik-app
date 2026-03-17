/**
 * Kaşık — Ranking Algorithm Tests
 * calculateHotScore, sortByHotScore, sortRecipes
 */

import { calculateHotScore, sortByHotScore, sortRecipes, RankableItem } from '../ranking';

// Helper: create a base item at a specific time
function makeItem(overrides: Partial<RankableItem> = {}): RankableItem {
  return {
    likes: 10,
    views: 100,
    comments: 5,
    saves: 2,
    rating: 4,
    createdAt: new Date(), // "just now"
    isVerified: false,
    isAIGenerated: false,
    pantryMatch: 0,
    ...overrides,
  };
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

describe('calculateHotScore', () => {
  it('returns a positive score for a basic item', () => {
    const score = calculateHotScore(makeItem());
    expect(score).toBeGreaterThan(0);
  });

  it('higher likes produce higher score (same age)', () => {
    const createdAt = hoursAgo(1);
    const low = calculateHotScore(makeItem({ likes: 5, createdAt }));
    const high = calculateHotScore(makeItem({ likes: 50, createdAt }));
    expect(high).toBeGreaterThan(low);
  });

  it('newer items score higher than older items (same engagement)', () => {
    const base = { likes: 10, views: 50, comments: 3 };
    const newer = calculateHotScore(makeItem({ ...base, createdAt: hoursAgo(1) }));
    const older = calculateHotScore(makeItem({ ...base, createdAt: hoursAgo(48) }));
    expect(newer).toBeGreaterThan(older);
  });

  it('score decreases over time', () => {
    const item = makeItem({ likes: 20 });
    const score1h = calculateHotScore({ ...item, createdAt: hoursAgo(1) });
    const score24h = calculateHotScore({ ...item, createdAt: hoursAgo(24) });
    const score72h = calculateHotScore({ ...item, createdAt: hoursAgo(72) });
    expect(score1h).toBeGreaterThan(score24h);
    expect(score24h).toBeGreaterThan(score72h);
  });

  it('isVerified gives ~30% bonus', () => {
    const createdAt = hoursAgo(2);
    const normal = calculateHotScore(makeItem({ createdAt, isVerified: false }));
    const verified = calculateHotScore(makeItem({ createdAt, isVerified: true }));
    // 30% bonus = 1.3x
    expect(verified / normal).toBeCloseTo(1.3, 1);
  });

  it('isAIGenerated gives ~10% bonus', () => {
    const createdAt = hoursAgo(2);
    const normal = calculateHotScore(makeItem({ createdAt, isAIGenerated: false }));
    const ai = calculateHotScore(makeItem({ createdAt, isAIGenerated: true }));
    expect(ai / normal).toBeCloseTo(1.1, 1);
  });

  it('pantryMatch bonus scales linearly up to cap at 3', () => {
    const createdAt = hoursAgo(2);
    const base = calculateHotScore(makeItem({ createdAt, pantryMatch: 0 }));
    const match1 = calculateHotScore(makeItem({ createdAt, pantryMatch: 1 }));
    const match3 = calculateHotScore(makeItem({ createdAt, pantryMatch: 3 }));
    const match5 = calculateHotScore(makeItem({ createdAt, pantryMatch: 5 }));

    expect(match1).toBeGreaterThan(base);
    expect(match3).toBeGreaterThan(match1);
    // Cap at 3 — match5 should equal match3
    expect(match5).toBeCloseTo(match3, 5);
  });

  it('handles string date in createdAt', () => {
    const score = calculateHotScore(makeItem({
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    }));
    expect(score).toBeGreaterThan(0);
  });
});

describe('sortByHotScore', () => {
  it('orders items descending by score', () => {
    const items = [
      makeItem({ likes: 5, createdAt: hoursAgo(24) }),
      makeItem({ likes: 100, createdAt: hoursAgo(1) }),
      makeItem({ likes: 20, createdAt: hoursAgo(6) }),
    ];
    const sorted = sortByHotScore(items);
    const scores = sorted.map(calculateHotScore);
    for (let i = 0; i < scores.length - 1; i++) {
      expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
    }
  });

  it('does not mutate the original array', () => {
    const items = [makeItem({ likes: 1 }), makeItem({ likes: 100 })];
    const original = [...items];
    sortByHotScore(items);
    expect(items).toEqual(original);
  });
});

describe('sortRecipes', () => {
  const items = [
    makeItem({ likes: 30, rating: 3, createdAt: hoursAgo(48) }),
    makeItem({ likes: 10, rating: 5, createdAt: hoursAgo(1) }),
    makeItem({ likes: 50, rating: 2, createdAt: hoursAgo(24) }),
  ];

  it('mode=newest sorts by date (newest first)', () => {
    const sorted = sortRecipes(items, 'newest');
    expect(sorted[0]).toBe(items[1]); // 1 hour ago = newest
  });

  it('mode=most_liked sorts by likes descending', () => {
    const sorted = sortRecipes(items, 'most_liked');
    expect(sorted[0]).toBe(items[2]); // 50 likes
    expect(sorted[1]).toBe(items[0]); // 30 likes
  });

  it('mode=top_rated sorts by rating descending', () => {
    const sorted = sortRecipes(items, 'top_rated');
    expect(sorted[0]).toBe(items[1]); // rating 5
  });
});
