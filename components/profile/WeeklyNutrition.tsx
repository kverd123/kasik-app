/**
 * Kaşık — WeeklyNutrition
 * Tamamlanan öğünlerden haftalık besin özeti
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { useMealPlanStore } from '../../stores/mealPlanStore';

interface NutrientSummary {
  name: string;
  emoji: string;
  total: number;
  unit: string;
  target: number;
}

export function WeeklyNutrition() {
  const colors = useColors();
  const { weekMeals } = useMealPlanStore();

  const nutrients = useMemo(() => {
    // Tüm tamamlanmış öğünlerden besin topla
    const totals: Record<string, { value: number; unit: string }> = {};

    for (const dayMeals of Object.values(weekMeals)) {
      for (const slotMeals of Object.values(dayMeals)) {
        for (const meal of slotMeals as any[]) {
          if (meal.completed && meal.nutrients) {
            for (const n of meal.nutrients) {
              if (!totals[n.name]) totals[n.name] = { value: 0, unit: n.unit };
              totals[n.name].value += n.value;
            }
          }
        }
      }
    }

    // Önemli besinler ve hedefler
    const targets: NutrientSummary[] = [
      { name: 'Demir', emoji: '🩸', total: totals['Demir']?.value || 0, unit: 'mg', target: 77 }, // 11mg/gün × 7
      { name: 'Protein', emoji: '💪', total: totals['Protein']?.value || 0, unit: 'g', target: 77 }, // 11g/gün × 7
      { name: 'Kalsiyum', emoji: '🦴', total: totals['Kalsiyum']?.value || 0, unit: 'mg', target: 1820 }, // 260mg/gün × 7
      { name: 'Lif', emoji: '🌾', total: totals['Lif']?.value || 0, unit: 'g', target: 35 }, // 5g/gün × 7
      { name: 'C Vitamini', emoji: '🍊', total: totals['C Vitamini']?.value || 0, unit: 'mg', target: 350 }, // 50mg/gün × 7
    ];

    return targets;
  }, [weekMeals]);

  const hasAnyData = nutrients.some((n) => n.total > 0);

  if (!hasAnyData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.white }]}>
        <Text style={[styles.title, { color: colors.textDark }]}>📊 Haftalık Besin Özeti</Text>
        <Text style={[styles.emptyText, { color: colors.textLight }]}>
          Öğünleri tamamladıkça besin özeti burada görünecek
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Text style={[styles.title, { color: colors.textDark }]}>📊 Haftalık Besin Özeti</Text>
      <View style={styles.grid}>
        {nutrients.map((nutrient) => {
          const progress = Math.min(nutrient.total / nutrient.target, 1);
          const progressPercent = Math.round(progress * 100);

          return (
            <View key={nutrient.name} style={[styles.nutrientBox, { backgroundColor: colors.cream }]}>
              <Text style={styles.nutrientEmoji}>{nutrient.emoji}</Text>
              <Text style={[styles.nutrientName, { color: colors.textDark }]}>{nutrient.name}</Text>
              <Text style={[styles.nutrientValue, { color: colors.textDark }]}>
                {Math.round(nutrient.total)} {nutrient.unit}
              </Text>
              <View style={[styles.progressBg, { backgroundColor: colors.creamDark }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercent}%`,
                      backgroundColor: progress >= 0.7 ? colors.sage : progress >= 0.4 ? colors.warning : colors.heart,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textLight }]}>{progressPercent}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.soft,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  nutrientBox: {
    width: '30%' as any,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 3,
  },
  nutrientEmoji: {
    fontSize: 20,
  },
  nutrientName: {
    fontFamily: FontFamily.semiBold,
    fontSize: 10,
  },
  nutrientValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
  },
  progressBg: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
  },
});
