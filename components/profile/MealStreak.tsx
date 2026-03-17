/**
 * Kaşık — MealStreak
 * Ardışık tamamlanan gün sayısı ve motivasyonel mesaj
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { useMealPlanStore } from '../../stores/mealPlanStore';

export function MealStreak() {
  const colors = useColors();
  const { weekMeals, getCompletedMealsThisWeek } = useMealPlanStore();

  const { streak, completedToday } = useMemo(() => {
    // Bugünün gün indeksi (0=Pzt)
    const dayJs = new Date().getDay();
    const todayIndex = dayJs === 0 ? 6 : dayJs - 1;

    // Bugünden geriye doğru ardışık tamamlanmış gün say
    let streakCount = 0;
    for (let i = todayIndex; i >= 0; i--) {
      const dayMeals = weekMeals[i];
      if (!dayMeals) break;

      const allMeals = Object.values(dayMeals).flat();
      if (allMeals.length === 0) break;

      const completed = allMeals.filter((m: any) => m.completed).length;
      if (completed > 0) {
        streakCount++;
      } else {
        break;
      }
    }

    // Bugünkü tamamlanma
    const todayMeals = weekMeals[todayIndex];
    const todayAll = todayMeals ? Object.values(todayMeals).flat() : [];
    const todayCompleted = todayAll.filter((m: any) => m.completed).length;

    return {
      streak: streakCount,
      completedToday: todayCompleted > 0,
    };
  }, [weekMeals]);

  const completedTotal = getCompletedMealsThisWeek();

  const getMessage = () => {
    if (streak === 0) return 'Bugün bir öğün tamamlayarak seriye başlayın!';
    if (streak === 1) return 'Harika başlangıç! Yarın da devam edin 💪';
    if (streak === 2) return 'İki gün üst üste! Muhteşem gidiyorsunuz 🌟';
    if (streak === 3) return 'Üç gün seri! Bebek sağlıklı besleniyor 🎉';
    if (streak >= 4) return `${streak} gün üst üste! Süper ebeveynsiniz! 🏆`;
    return '';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.topRow}>
        <View style={[styles.streakBadge, { backgroundColor: colors.peachLight }]}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={[styles.streakNumber, { color: colors.warningDark }]}>{streak}</Text>
        </View>
        <View style={styles.streakInfo}>
          <Text style={[styles.title, { color: colors.textDark }]}>
            {streak > 0 ? `${streak} Gün Seri!` : 'Öğün Serisi'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>{getMessage()}</Text>
        </View>
      </View>

      {/* Haftalık gösterim */}
      <View style={styles.weekRow}>
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, i) => {
          const dayMeals = weekMeals[i];
          const allMeals = dayMeals ? Object.values(dayMeals).flat() : [];
          const hasCompleted = allMeals.some((m: any) => m.completed);
          const dayJs = new Date().getDay();
          const todayIdx = dayJs === 0 ? 6 : dayJs - 1;
          const isToday = i === todayIdx;

          return (
            <View key={day} style={styles.dayColumn}>
              <Text style={[
                styles.dayLabel,
                { color: colors.textLight },
                isToday && { fontFamily: FontFamily.bold, color: colors.sage },
              ]}>
                {day}
              </Text>
              <View
                style={[
                  styles.dayDot,
                  { backgroundColor: colors.creamMid, borderColor: colors.creamDark },
                  hasCompleted && { backgroundColor: colors.sagePale, borderColor: colors.sage },
                  isToday && { borderColor: colors.sage, borderWidth: 2 },
                ]}
              >
                {hasCompleted && <Text style={[styles.checkmark, { color: colors.sage }]}>✓</Text>}
              </View>
            </View>
          );
        })}
      </View>

      {/* Toplam */}
      <Text style={[styles.totalText, { color: colors.textLight }]}>
        Bu hafta toplam {completedTotal} öğün tamamlandı
      </Text>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  streakBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  fireEmoji: {
    fontSize: 18,
  },
  streakNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
  },
  streakInfo: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    lineHeight: 18,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  checkmark: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
  },
  totalText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
