/**
 * Kaşık — Skeleton Loader
 * Shimmer animasyonlu placeholder bileşenleri
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColors } from '../../hooks/useColors';
import { BorderRadius, Spacing } from '../../constants/theme';

// ===== BASE SKELETON =====

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width, height, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.creamDark,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ===== PRESET: Recipe Card Skeleton =====

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 40 - 12) / 2;

export function RecipeCardSkeleton() {
  const colors = useColors();

  return (
    <View style={[skeletonStyles.recipeCard, { backgroundColor: colors.white }]}>
      <SkeletonLoader width="100%" height={110} borderRadius={BorderRadius.xl} />
      <View style={skeletonStyles.recipeCardInfo}>
        <SkeletonLoader width="80%" height={14} borderRadius={4} />
        <SkeletonLoader width="50%" height={12} borderRadius={4} />
        <View style={skeletonStyles.recipeCardRow}>
          <SkeletonLoader width={40} height={12} borderRadius={4} />
          <SkeletonLoader width={40} height={12} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View style={skeletonStyles.recipeGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </View>
  );
}

// ===== PRESET: Post Skeleton =====

export function PostSkeleton() {
  const colors = useColors();

  return (
    <View style={[skeletonStyles.postCard, { backgroundColor: colors.white }]}>
      <View style={skeletonStyles.postHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={skeletonStyles.postHeaderText}>
          <SkeletonLoader width={120} height={14} borderRadius={4} />
          <SkeletonLoader width={80} height={10} borderRadius={4} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={14} borderRadius={4} />
      <SkeletonLoader width="70%" height={14} borderRadius={4} />
      <SkeletonLoader width="100%" height={160} borderRadius={BorderRadius.lg} />
      <View style={skeletonStyles.postActions}>
        <SkeletonLoader width={50} height={12} borderRadius={4} />
        <SkeletonLoader width={50} height={12} borderRadius={4} />
        <SkeletonLoader width={50} height={12} borderRadius={4} />
      </View>
    </View>
  );
}

export function PostListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={{ gap: Spacing.md }}>
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </View>
  );
}

// ===== PRESET: Meal Card Skeleton =====

export function MealCardSkeleton() {
  const colors = useColors();

  return (
    <View style={[skeletonStyles.mealCard, { backgroundColor: colors.white }]}>
      <SkeletonLoader width={42} height={42} borderRadius={21} />
      <View style={skeletonStyles.mealCardText}>
        <SkeletonLoader width="60%" height={14} borderRadius={4} />
        <SkeletonLoader width="40%" height={10} borderRadius={4} />
      </View>
      <SkeletonLoader width={28} height={28} borderRadius={14} />
    </View>
  );
}

export function MealSlotSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={{ gap: Spacing.sm }}>
      {Array.from({ length: count }).map((_, i) => (
        <MealCardSkeleton key={i} />
      ))}
    </View>
  );
}

// ===== STYLES =====

const skeletonStyles = StyleSheet.create({
  // Recipe card
  recipeCard: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  recipeCardInfo: {
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  recipeCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xxs,
  },
  recipeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },

  // Post card
  postCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  postHeaderText: {
    gap: Spacing.xs,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },

  // Meal card
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  mealCardText: {
    flex: 1,
    gap: Spacing.xs,
  },
});
