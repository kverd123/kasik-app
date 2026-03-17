/**
 * Kaşık — Alerjen Program Detay Modalı
 * Gün bazlı öğün+reaksiyon geçmişi, program yönetimi
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { AllergenType } from '../../types';
import {
  AllergenIntroProgramConfig,
  SEVERITY_LABELS,
} from '../../constants/allergenIntro';
import { useAllergenIntroStore } from '../../stores/allergenIntroStore';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';

interface AllergenProgramDetailModalProps {
  visible: boolean;
  program: AllergenIntroProgramConfig | null;
  onClose: () => void;
}

export function AllergenProgramDetailModal({ visible, program, onClose }: AllergenProgramDetailModalProps) {
  const colors = useColors();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { completeProgram, cancelProgram, pauseProgram, resumeProgram, getProgramReport } = useAllergenIntroStore();

  const STATUS_INFO: Record<string, { label: string; color: string; bg: string }> = useMemo(() => ({
    active: { label: 'Aktif', color: colors.warningDark, bg: colors.warningBg },
    paused: { label: 'Duraklatıldı', color: colors.warning, bg: colors.peachLight },
    completed: { label: 'Tamamlandı', color: colors.success, bg: colors.successBg },
    cancelled: { label: 'İptal Edildi', color: colors.textLight, bg: colors.cream },
  }), [colors]);

  const RESULT_INFO: Record<string, { emoji: string; label: string; color: string; bg: string; desc: string }> = useMemo(() => ({
    safe: { emoji: '✅', label: 'Güvenli', color: colors.success, bg: colors.successBg, desc: 'Program boyunca herhangi bir reaksiyon gözlenmedi.' },
    caution: { emoji: '⚠️', label: 'Dikkatli Olun', color: colors.warningDark, bg: colors.warningBg, desc: 'Hafif veya orta düzey reaksiyonlar gözlemlendi. Doktorunuzla görüşün.' },
    allergic: { emoji: '🚨', label: 'Alerjik Reaksiyon', color: colors.dangerDark, bg: colors.dangerBg, desc: 'Ciddi reaksiyon kaydedildi. Doktorunuzla mutlaka görüşün.' },
    in_progress: { emoji: '⏳', label: 'Devam Ediyor', color: colors.textLight, bg: colors.cream, desc: 'Program henüz tamamlanmadı.' },
  }), [colors]);

  const report = useMemo(() => {
    if (!program) return null;
    return getProgramReport(program.id);
  }, [program]);

  if (!program || !report) return null;

  const allergenName = program.allergenType === 'other' && program.customAllergenName
    ? program.customAllergenName
    : getAllergenLabel(program.allergenType);
  const allergenEmoji = getAllergenEmoji(program.allergenType);
  const statusInfo = STATUS_INFO[program.status] || STATUS_INFO.active;
  const resultInfo = RESULT_INFO[report.overallResult];
  const progress = report.totalMeals > 0 ? report.completedMeals / report.totalMeals : 0;

  const startDateStr = program.startDate instanceof Date
    ? program.startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const handleComplete = () => {
    completeProgram(program.id);
    onClose();
  };

  const handleCancel = () => {
    cancelProgram(program.id);
    onClose();
  };

  const handlePause = () => {
    pauseProgram(program.id);
    onClose();
  };

  const handleResume = () => {
    resumeProgram(program.id);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={[styles.headerClose, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textDark }]}>Program Detayı</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={{ fontSize: 48 }}>{allergenEmoji}</Text>
            <Text style={[styles.heroTitle, { color: colors.textDark }]}>{allergenName} Açma</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          {/* Özet */}
          <View style={[styles.summaryCard, { backgroundColor: colors.white }]}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.textDark }]}>{program.totalDays}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Gün</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.creamDark }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.textDark }]}>{report.completedMeals}/{report.totalMeals}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Öğün</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.creamDark }]} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryValue, { color: colors.textDark }]}>{Math.round(progress * 100)}%</Text>
                <Text style={[styles.summaryLabel, { color: colors.textLight }]}>İlerleme</Text>
              </View>
            </View>
            <View style={[styles.progressBarBg, { backgroundColor: colors.creamDark }]}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: colors.sage }]} />
            </View>
            <Text style={[styles.summaryDate, { color: colors.textLight }]}>Başlangıç: {startDateStr}</Text>
          </View>

          {/* Genel Sonuç (tamamlanmış veya duraklatılmış) */}
          {(program.status === 'completed' || program.status === 'paused' || program.status === 'cancelled') && resultInfo && (
            <View style={[styles.resultCard, { backgroundColor: resultInfo.bg }]}>
              <Text style={{ fontSize: 28 }}>{resultInfo.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.resultTitle, { color: resultInfo.color }]}>{resultInfo.label}</Text>
                <Text style={[styles.resultDesc, { color: resultInfo.color + 'CC' }]}>{resultInfo.desc}</Text>
              </View>
            </View>
          )}

          {/* Gün bazlı liste */}
          <Text style={[styles.sectionTitle, { color: colors.textDark }]}>📅 Günlük Detay</Text>
          {program.dailyPlan.map((day) => {
            const isExpanded = expandedDay === day.day;
            const dayCompleted = day.meals.filter((m) => m.completed).length;
            const dayTotal = day.meals.length;
            const dayReactions = day.meals.filter((m) => m.reaction && m.reaction.severity !== 'none');
            const worstReaction = dayReactions.length > 0
              ? dayReactions.reduce((worst, m) => {
                  const order = ['none', 'mild', 'moderate', 'severe'];
                  return order.indexOf(m.reaction!.severity) > order.indexOf(worst) ? m.reaction!.severity : worst;
                }, 'none' as string)
              : null;

            return (
              <TouchableOpacity
                key={day.day}
                style={[styles.dayCard, { backgroundColor: colors.white }]}
                onPress={() => setExpandedDay(isExpanded ? null : day.day)}
                activeOpacity={0.7}
              >
                {/* Day header */}
                <View style={styles.dayHeader}>
                  <View style={[
                    styles.dayCircle,
                    { backgroundColor: colors.creamDark },
                    dayCompleted === dayTotal && dayTotal > 0 && { backgroundColor: colors.sage },
                  ]}>
                    <Text style={[
                      styles.dayCircleText,
                      { color: colors.textMid },
                      dayCompleted === dayTotal && dayTotal > 0 && { color: colors.white },
                    ]}>
                      {dayCompleted === dayTotal && dayTotal > 0 ? '✓' : day.day}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dayTitle, { color: colors.textDark }]}>Gün {day.day}</Text>
                    <Text style={[styles.daySub, { color: colors.textLight }]}>
                      {dayCompleted}/{dayTotal} öğün
                      {worstReaction && ` · ${SEVERITY_LABELS[worstReaction]?.emoji || ''} ${SEVERITY_LABELS[worstReaction]?.label || ''}`}
                    </Text>
                  </View>
                  <Text style={[styles.dayArrow, { color: colors.textLight }]}>{isExpanded ? '▼' : '▶'}</Text>
                </View>

                {/* Expanded meals */}
                {isExpanded && (
                  <View style={[styles.dayMeals, { borderTopColor: colors.creamDark + '60' }]}>
                    {day.meals.map((meal) => {
                      const sev = meal.reaction ? SEVERITY_LABELS[meal.reaction.severity] : null;
                      return (
                        <View key={meal.id} style={styles.mealRow}>
                          <Text style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{meal.emoji}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.mealName, { color: colors.textDark }]}>{meal.recipeName}</Text>
                            {meal.completed ? (
                              <View style={styles.mealReactionRow}>
                                <View style={[styles.mealSeverityBadge, { backgroundColor: (sev?.color || colors.success) + '20' }]}>
                                  <Text style={[styles.mealSeverityText, { color: sev?.color || colors.success }]}>
                                    {sev?.emoji || '✅'} {sev?.label || 'Reaksiyon Yok'}
                                  </Text>
                                </View>
                              </View>
                            ) : (
                              <Text style={[styles.mealPending, { color: colors.textLight }]}>Henüz tamamlanmadı</Text>
                            )}
                            {/* Semptomlar */}
                            {meal.reaction && meal.reaction.symptoms.length > 0 && (
                              <Text style={[styles.mealSymptoms, { color: colors.textLight }]}>
                                Belirtiler: {meal.reaction.symptoms.join(', ')}
                              </Text>
                            )}
                            {/* Notlar */}
                            {meal.reaction?.notes ? (
                              <Text style={[styles.mealNotes, { color: colors.textMid }]}>📝 {meal.reaction.notes}</Text>
                            ) : null}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Aksiyon butonları */}
          {program.status === 'active' && (
            <View style={styles.actionRow}>
              {report.completedMeals >= report.totalMeals && (
                <TouchableOpacity style={[styles.completeBtn, { backgroundColor: colors.sage }]} onPress={handleComplete}>
                  <Text style={[styles.completeBtnText, { color: colors.white }]}>✅ Programı Tamamla</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.pauseBtn, { backgroundColor: colors.warningBg, borderColor: colors.peach }]} onPress={handlePause}>
                <Text style={[styles.pauseBtnText, { color: colors.warningDark }]}>⏸ Durakla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.white, borderColor: colors.creamDark }]} onPress={handleCancel}>
                <Text style={[styles.cancelBtnText, { color: colors.textLight }]}>İptal Et</Text>
              </TouchableOpacity>
            </View>
          )}

          {program.status === 'paused' && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.completeBtn, { backgroundColor: colors.sage }]} onPress={handleResume}>
                <Text style={[styles.completeBtnText, { color: colors.white }]}>▶ Devam Et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: colors.white, borderColor: colors.creamDark }]} onPress={handleCancel}>
                <Text style={[styles.cancelBtnText, { color: colors.textLight }]}>İptal Et</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  headerClose: { fontSize: 20, width: 28, textAlign: 'center' },
  headerTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
    flex: 1, textAlign: 'center',
  },
  content: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 60 },

  // Hero
  heroSection: { alignItems: 'center', gap: Spacing.sm },
  heroTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.xxl, textAlign: 'center',
  },
  statusBadge: {
    borderRadius: BorderRadius.round, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs,
  },
  statusBadgeText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },

  // Summary
  summaryCard: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    gap: Spacing.md, ...Shadow.soft,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 2 },
  summaryValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  summaryLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  summaryDivider: { width: 1, height: 30 },
  progressBarBg: { height: 6, borderRadius: 3 },
  progressBarFill: { height: 6, borderRadius: 3 },
  summaryDate: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs, textAlign: 'center',
  },

  // Result
  resultCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
  },
  resultTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  resultDesc: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 20, marginTop: 2 },

  // Section
  sectionTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg,
  },

  // Day cards
  dayCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md, ...Shadow.soft,
  },
  dayHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  dayCircle: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  dayCircleText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
  dayTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  daySub: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  dayArrow: { fontSize: 12 },

  // Day expanded meals
  dayMeals: {
    marginTop: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 1, gap: Spacing.md,
  },
  mealRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
  },
  mealName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  mealReactionRow: { flexDirection: 'row', marginTop: 4 },
  mealSeverityBadge: {
    borderRadius: BorderRadius.round, paddingHorizontal: Spacing.sm, paddingVertical: 2,
  },
  mealSeverityText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs },
  mealPending: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs, fontStyle: 'italic',
    marginTop: 2,
  },
  mealSymptoms: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 4,
  },
  mealNotes: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs,
    fontStyle: 'italic', marginTop: 2,
  },

  // Actions
  actionRow: { gap: Spacing.sm },
  completeBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  completeBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  pauseBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1,
  },
  pauseBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  cancelBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1,
  },
  cancelBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
});
