/**
 * Kasik — OnboardingProgress
 * Step indicator for onboarding screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { Spacing } from '../../constants/theme';

interface OnboardingProgressProps {
  currentStep: number; // 1-based
  totalSteps: number;
}

export function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <View
            key={step}
            style={[
              styles.dot,
              { backgroundColor: colors.creamDark },
              isActive && { backgroundColor: colors.sage, width: 24 },
              isCompleted && { backgroundColor: colors.sage },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
