/**
 * Kaşık — Type Definitions
 */

// ===== USER =====
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  onboardingCompleted: boolean;
  isPremium: boolean;
  premiumSince?: Date;
  subscriptionPlatform?: 'ios' | 'android';
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'tr' | 'en';
  notifications: boolean;
  darkMode: boolean;
}

// ===== BABY =====
export interface Baby {
  id: string;
  name: string;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  photoURL?: string;
  startedSolidsDate?: Date;
  currentStage: AgeStage;
  weight: GrowthEntry[];
  height: GrowthEntry[];
  knownAllergens: AllergenType[];
  triedFoods: TriedFood[];
}

export type AgeStage = '6m' | '8m' | '12m+';

export interface GrowthEntry {
  date: Date;
  value: number; // kg or cm
}

export interface TriedFood {
  foodId: string;
  foodName: string;
  date: Date;
  reaction: 'none' | 'mild' | 'moderate' | 'severe';
  liked: boolean | null;
  notes?: string;
}

// ===== ALLERGENS =====
export type AllergenType =
  | 'milk'
  | 'egg'
  | 'wheat'
  | 'soy'
  | 'peanut'
  | 'tree_nut'
  | 'fish'
  | 'shellfish'
  | 'sesame'
  | 'other';

export interface AllergenInfo {
  type: AllergenType;
  label: string; // Turkish label
  emoji: string;
  description: string;
}

// ===== MEAL PLAN =====
export interface MealPlan {
  id: string;
  date: string; // YYYY-MM-DD
  meals: Meal[];
}

export type MealSlot = 'breakfast' | 'lunch' | 'snack' | 'dinner';

export interface MealIngredient {
  name: string;
  emoji: string;
  amount: number;
  unit: string;
  isAllergen?: boolean;
}

export interface Meal {
  id: string;
  slot: MealSlot;
  recipeId?: string;
  foodName: string;
  emoji: string;
  ageGroup: AgeStage;
  calories?: number;
  nutrients?: NutrientInfo[];
  completed: boolean;
  isFirstTry: boolean;
  allergenWarning?: AllergenType[];
  notes?: string;
  // Manuel tarif detayları
  ingredients?: MealIngredient[];
  steps?: string[];
  prepTime?: number;
}

export interface NutrientInfo {
  name: string;
  value: number;
  unit: string;
}

// ===== PANTRY =====
export type PantryCategory =
  | 'sebze'
  | 'meyve'
  | 'protein'
  | 'tahil'
  | 'sut_urunleri'
  | 'baharat'
  | 'diger';

export interface PantryItem {
  id: string;
  name: string;
  category: PantryCategory;
  emoji: string;
  addedDate: Date;
  expiryDate?: Date;
  quantity?: string;
}

// ===== RECIPE =====
export interface Recipe {
  id: string;
  title: string;
  description: string;
  emoji: string;
  photoURL?: string;
  photoGallery: string[];
  authorId: string;
  authorName: string;
  authorVerified: boolean;
  ageGroup: AgeStage;
  prepTime: number; // minutes
  calories: number;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  allergens: AllergenType[];
  nutrients: NutrientInfo[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  likes: number;
  likedBy: string[];
  rating: {
    average: number;
    count: number;
  };
  isAIGenerated: boolean;
  source: 'official' | 'community' | 'ai';
  tip?: string;
  views?: number;
  commentCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  emoji: string;
  isAllergen?: boolean;
}

// ===== COMMUNITY =====
export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorBadge?: 'expert' | 'verified' | null;
  content: string;
  photos: string[];
  recipeId?: string;
  likes: number;
  likedBy: string[];
  commentCount: number;
  category: 'popular' | 'question' | 'tip' | 'recipe_share';
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
}

// ===== SUBSCRIPTION =====
export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';

export interface SubscriptionInfo {
  isPremium: boolean;
  plan?: SubscriptionPlan;
  expiresAt?: Date;
  platform?: 'ios' | 'android';
}

// ===== MASCOT =====
export type MascotPose =
  | 'greeting'
  | 'thinking'
  | 'warning'
  | 'celebration'
  | 'sharing';

// ===== NAVIGATION =====
export type RootStackParamList = {
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  '(auth)/forgot-password': undefined;
  '(onboarding)/welcome': undefined;
  '(onboarding)/baby-info': undefined;
  '(onboarding)/allergens': undefined;
  '(tabs)': undefined;
  'recipe/[id]': { id: string };
  'post/[id]': { id: string };
};
