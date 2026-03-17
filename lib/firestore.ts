/**
 * Kaşık — Firestore CRUD Operations
 * All database read/write operations
 */

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Baby, MealPlan, PantryItem, Recipe, Post, Comment } from '../types';

// ===== BABY PROFILES =====

export const saveBabyProfile = async (userId: string, baby: Omit<Baby, 'id'>): Promise<string> => {
  const babyRef = doc(collection(db, `users/${userId}/babies`));
  await setDoc(babyRef, {
    ...baby,
    createdAt: serverTimestamp(),
  });
  return babyRef.id;
};

export const getBabyProfiles = async (userId: string): Promise<Baby[]> => {
  const snapshot = await getDocs(collection(db, `users/${userId}/babies`));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Baby[];
};

export const updateBabyProfile = async (
  userId: string,
  babyId: string,
  updates: Partial<Baby>
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}/babies/${babyId}`), updates);
};

// ===== MEAL PLANS =====

export const saveMealPlan = async (userId: string, plan: MealPlan): Promise<void> => {
  await setDoc(doc(db, `users/${userId}/mealPlans/${plan.date}`), {
    ...plan,
    updatedAt: serverTimestamp(),
  });
};

export const getMealPlan = async (userId: string, date: string): Promise<MealPlan | null> => {
  const docSnap = await getDoc(doc(db, `users/${userId}/mealPlans/${date}`));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as MealPlan;
};

export const getMealPlansForWeek = async (
  userId: string,
  dates: string[]
): Promise<MealPlan[]> => {
  const plans: MealPlan[] = [];
  for (const date of dates) {
    const plan = await getMealPlan(userId, date);
    if (plan) plans.push(plan);
  }
  return plans;
};

// ===== PANTRY =====

export const addPantryItem = async (userId: string, item: Omit<PantryItem, 'id'>): Promise<string> => {
  const ref = doc(collection(db, `users/${userId}/pantry`));
  await setDoc(ref, {
    ...item,
    addedDate: serverTimestamp(),
  });
  return ref.id;
};

export const getPantryItems = async (userId: string): Promise<PantryItem[]> => {
  const snapshot = await getDocs(
    query(collection(db, `users/${userId}/pantry`), orderBy('addedDate', 'desc'), limit(200))
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PantryItem[];
};

export const removePantryItem = async (userId: string, itemId: string): Promise<void> => {
  await deleteDoc(doc(db, `users/${userId}/pantry/${itemId}`));
};

export const updatePantryItem = async (
  userId: string,
  itemId: string,
  updates: Record<string, any>
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}/pantry/${itemId}`), updates);
};

// ===== RECIPES =====

export const createRecipe = async (recipe: Omit<Recipe, 'id'>): Promise<string> => {
  const ref = doc(collection(db, 'recipes'));
  await setDoc(ref, {
    ...recipe,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const getRecipe = async (recipeId: string): Promise<Recipe | null> => {
  const docSnap = await getDoc(doc(db, `recipes/${recipeId}`));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Recipe;
};

export const getRecipes = async (
  filters?: { ageGroup?: string; difficulty?: string },
  maxResults = 20
): Promise<Recipe[]> => {
  let q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'), limit(maxResults));

  if (filters?.ageGroup) {
    q = query(collection(db, 'recipes'), where('ageGroup', '==', filters.ageGroup), orderBy('createdAt', 'desc'), limit(maxResults));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Recipe[];
};

export const toggleRecipeLike = async (recipeId: string, userId: string, isLiked: boolean): Promise<void> => {
  const ref = doc(db, `recipes/${recipeId}`);
  if (isLiked) {
    await updateDoc(ref, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(ref, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }
};

export const getRecipesByIngredients = async (ingredientNames: string[]): Promise<Recipe[]> => {
  // Get all recipes and filter client-side for ingredient matching
  const snapshot = await getDocs(
    query(collection(db, 'recipes'), orderBy('likes', 'desc'), limit(50))
  );

  const recipes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Recipe[];

  // Filter recipes that can be made with available ingredients
  return recipes.filter((recipe) => {
    const recipeIngredients = recipe.ingredients.map((i) => i.name.toLowerCase());
    return recipeIngredients.some((ri) =>
      ingredientNames.some((pi) => ri.includes(pi.toLowerCase()))
    );
  });
};

// ===== COMMUNITY RECIPES (Topluluk Tarifleri) =====

export const getCommunityRecipes = async (
  options?: {
    ageGroup?: string;
    sortBy?: 'newest' | 'popular';
    maxResults?: number;
    lastDoc?: QueryDocumentSnapshot;
  }
): Promise<{ recipes: Recipe[]; lastDoc: QueryDocumentSnapshot | null }> => {
  const maxResults = options?.maxResults ?? 20;
  const sortField = options?.sortBy === 'popular' ? 'likes' : 'createdAt';

  const constraints = [
    where('source', '==', 'community'),
    ...(options?.ageGroup ? [where('ageGroup', '==', options.ageGroup)] : []),
    orderBy(sortField, 'desc'),
    ...(options?.lastDoc ? [startAfter(options.lastDoc)] : []),
    limit(maxResults),
  ];

  const q = query(collection(db, 'recipes'), ...constraints);
  const snapshot = await getDocs(q);

  const recipes = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Recipe[];

  const lastVisible = snapshot.docs.length > 0
    ? snapshot.docs[snapshot.docs.length - 1]
    : null;

  return { recipes, lastDoc: lastVisible };
};

export const getPopularRecipes = async (maxResults = 10): Promise<Recipe[]> => {
  const q = query(
    collection(db, 'recipes'),
    where('source', '==', 'community'),
    orderBy('likes', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Recipe[];
};

// ===== COMMUNITY POSTS =====

export const createPost = async (post: Omit<Post, 'id'>): Promise<string> => {
  const ref = doc(collection(db, 'posts'));
  await setDoc(ref, {
    ...post,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getPosts = async (
  category?: string,
  maxResults = 20
): Promise<Post[]> => {
  let q;
  if (category && category !== 'popular') {
    q = query(
      collection(db, 'posts'),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );
  } else {
    q = query(collection(db, 'posts'), orderBy('likes', 'desc'), limit(maxResults));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
};

export const togglePostLike = async (postId: string, userId: string, isLiked: boolean): Promise<void> => {
  const ref = doc(db, `posts/${postId}`);
  if (isLiked) {
    await updateDoc(ref, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    await updateDoc(ref, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'postId'>): Promise<string> => {
  const ref = doc(collection(db, `posts/${postId}/comments`));
  await setDoc(ref, {
    ...comment,
    postId,
    createdAt: serverTimestamp(),
  });

  // Increment comment count on post
  await updateDoc(doc(db, `posts/${postId}`), {
    commentCount: increment(1),
  });

  return ref.id;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  const snapshot = await getDocs(
    query(collection(db, `posts/${postId}/comments`), orderBy('createdAt', 'asc'), limit(50))
  );
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
};

// ===== USER UPDATES =====

export const completeOnboarding = async (userId: string): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}`), {
    onboardingCompleted: true,
  });
};

export const updateUserPremium = async (
  userId: string,
  isPremium: boolean,
  platform?: 'ios' | 'android'
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}`), {
    isPremium,
    premiumSince: isPremium ? serverTimestamp() : null,
    subscriptionPlatform: platform || null,
  });
};

// ===== PUSH TOKEN =====

export const savePushToken = async (
  userId: string,
  token: string,
  platform: 'ios' | 'android' | 'web'
): Promise<void> => {
  const tokenRef = doc(db, `pushTokens/${userId}`);
  await setDoc(tokenRef, {
    userId,
    token,
    platform,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });
};

export const removePushToken = async (userId: string): Promise<void> => {
  await deleteDoc(doc(db, `pushTokens/${userId}`));
};

// ===== GORUNTULEME & BEGENI SAYACI =====

export const incrementRecipeViews = async (recipeId: string): Promise<void> => {
  await updateDoc(doc(db, `recipes/${recipeId}`), {
    views: increment(1),
  });
};

export const incrementPostViews = async (postId: string): Promise<void> => {
  await updateDoc(doc(db, `posts/${postId}`), {
    views: increment(1),
  });
};

// ===== WEEK MEAL PLANS =====

export const saveWeekMealPlan = async (
  userId: string,
  weekKey: string,
  weekData: Record<string, any>
): Promise<void> => {
  await setDoc(doc(db, `users/${userId}/mealPlans/${weekKey}`), {
    ...weekData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getWeekMealPlan = async (
  userId: string,
  weekKey: string
): Promise<Record<string, any> | null> => {
  const docSnap = await getDoc(doc(db, `users/${userId}/mealPlans/${weekKey}`));
  if (!docSnap.exists()) return null;
  return docSnap.data();
};

export const getAllWeekMealPlans = async (
  userId: string
): Promise<Record<string, Record<string, any>>> => {
  const snapshot = await getDocs(
    query(collection(db, `users/${userId}/mealPlans`), limit(52))
  );
  const result: Record<string, Record<string, any>> = {};
  snapshot.docs.forEach((d) => {
    result[d.id] = d.data();
  });
  return result;
};

// ===== RECIPE BOOK =====

export const saveRecipeBookEntry = async (
  userId: string,
  entry: Record<string, any>
): Promise<void> => {
  await setDoc(doc(db, `users/${userId}/recipeBook/${entry.recipeId}`), {
    ...entry,
    updatedAt: serverTimestamp(),
  });
};

export const getRecipeBookEntries = async (
  userId: string
): Promise<Record<string, any>[]> => {
  const snapshot = await getDocs(
    query(collection(db, `users/${userId}/recipeBook`), limit(100))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const removeRecipeBookEntry = async (
  userId: string,
  recipeId: string
): Promise<void> => {
  await deleteDoc(doc(db, `users/${userId}/recipeBook/${recipeId}`));
};

export const updateRecipeBookEntry = async (
  userId: string,
  recipeId: string,
  updates: Record<string, any>
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}/recipeBook/${recipeId}`), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// ===== ALLERGEN PROGRAMS =====

export const saveAllergenProgram = async (
  userId: string,
  program: Record<string, any>
): Promise<void> => {
  const programId = program.id || program.allergenType;
  await setDoc(doc(db, `users/${userId}/allergenPrograms/${programId}`), {
    ...program,
    updatedAt: serverTimestamp(),
  });
};

export const getAllergenPrograms = async (
  userId: string
): Promise<Record<string, any>[]> => {
  const snapshot = await getDocs(
    query(collection(db, `users/${userId}/allergenPrograms`), limit(20))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateAllergenProgram = async (
  userId: string,
  programId: string,
  updates: Record<string, any>
): Promise<void> => {
  await updateDoc(doc(db, `users/${userId}/allergenPrograms/${programId}`), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// ===== ANALYTICS =====

interface AnalyticsEventData {
  name: string;
  params: Record<string, string | number | boolean>;
  userId: string | null;
  timestamp: number;
  platform: string;
  sessionId: string;
}

/** Batch analytics event'lerini Firestore'a yaz */
export const logAnalyticsBatch = async (
  userId: string,
  events: AnalyticsEventData[]
): Promise<void> => {
  if (events.length === 0) return;

  const batch = writeBatch(db);
  const colRef = collection(db, 'analytics_events');

  for (const event of events) {
    const docRef = doc(colRef);
    batch.set(docRef, {
      ...event,
      userId,
      serverTimestamp: serverTimestamp(),
    });
  }

  await batch.commit();
};
