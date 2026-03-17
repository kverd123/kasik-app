/**
 * Kaşık — Alerjen Reaksiyon Kayıt Modal
 * Alerjen içeren öğün tamamlandığında açılır
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { getAllergenLabel, getAllergenEmoji } from '../../constants/allergens';
import { AllergenType } from '../../types';
import {
  ALLERGEN_SYMPTOMS,
  SEVERITY_LABELS,
  AllergenReactionResult,
} from '../../constants/allergenIntro';
import { useAllergenIntroStore } from '../../stores/allergenIntroStore';

interface AllergenReactionModalProps {
  visible: boolean;
  onClose: () => void;
  allergenType: AllergenType;
  programId: string;
  day: number;
  mealId: string;
  mealName: string;
}

export function AllergenReactionModal({
  visible,
  onClose,
  allergenType,
  programId,
  day,
  mealId,
  mealName,
}: AllergenReactionModalProps) {
  const colors = useColors();
  const [severity, setSeverity] = useState<'none' | 'mild' | 'moderate' | 'severe' | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const { recordReaction } = useAllergenIntroStore();

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!severity) return;

    const reaction: AllergenReactionResult = {
      severity,
      symptoms: selectedSymptoms,
      notes: notes.trim(),
      timestamp: new Date(),
    };

    recordReaction(programId, day, mealId, reaction);
    resetAndClose();
  };

  const resetAndClose = () => {
    setSeverity(null);
    setSelectedSymptoms([]);
    setNotes('');
    onClose();
  };

  const severityInfo = severity ? SEVERITY_LABELS[severity] : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={resetAndClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
          <TouchableOpacity onPress={resetAndClose}>
            <Text style={[styles.headerClose, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textDark }]}>Reaksiyon Kaydı</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Öğün bilgisi */}
          <View style={[styles.mealInfo, { backgroundColor: colors.white }]}>
            <Text style={styles.mealInfoEmoji}>{getAllergenEmoji(allergenType)}</Text>
            <View>
              <Text style={[styles.mealInfoTitle, { color: colors.textDark }]}>{mealName}</Text>
              <Text style={[styles.mealInfoSubtitle, { color: colors.textLight }]}>
                {getAllergenLabel(allergenType)} içeren öğün · Gün {day}
              </Text>
            </View>
          </View>

          {/* Severity seçimi */}
          <Text style={[styles.sectionTitle, { color: colors.textDark }]}>Sonuç nasıldı?</Text>
          <View style={styles.severityGrid}>
            {(['none', 'mild', 'moderate', 'severe'] as const).map((sev) => {
              const info = SEVERITY_LABELS[sev];
              const isSelected = severity === sev;
              return (
                <TouchableOpacity
                  key={sev}
                  style={[
                    styles.severityCard,
                    { backgroundColor: colors.white, borderColor: colors.creamDark },
                    isSelected && { borderColor: info.color, backgroundColor: info.color + '15' },
                  ]}
                  onPress={() => setSeverity(sev)}
                >
                  <Text style={styles.severityEmoji}>{info.emoji}</Text>
                  <Text style={[styles.severityLabel, { color: colors.textMid }, isSelected && { color: info.color }]}>
                    {info.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Ciddi uyarı */}
          {severity === 'severe' && (
            <View style={[styles.severeWarning, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
              <Text style={[styles.severeWarningTitle, { color: colors.dangerDark }]}>🚨 HEMEN DOKTORA BAŞVURUN!</Text>
              <Text style={[styles.severeWarningText, { color: colors.dangerDark }]}>
                Ciddi alerjik reaksiyon tespit edildi. Program otomatik olarak duraklatılacak.
                Derhal doktorunuza başvurun veya 112'yi arayın.
              </Text>
            </View>
          )}

          {/* Semptom seçimi (yalnızca reaksiyon varsa) */}
          {severity && severity !== 'none' && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.textDark }]}>Gözlemlenen semptomlar:</Text>
              <View style={styles.symptomGrid}>
                {ALLERGEN_SYMPTOMS.map((s) => {
                  const isSelected = selectedSymptoms.includes(s.id);
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[
                        styles.symptomChip,
                        { backgroundColor: colors.white, borderColor: colors.creamDark },
                        isSelected && { borderColor: colors.warning, backgroundColor: colors.warningBg },
                      ]}
                      onPress={() => toggleSymptom(s.id)}
                    >
                      <Text style={{ fontSize: 14 }}>{s.emoji}</Text>
                      <Text style={[
                        styles.symptomText,
                        { color: colors.textMid },
                        isSelected && { color: colors.warningDark },
                      ]}>
                        {s.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Notlar */}
          {severity && (
            <View style={styles.notesSection}>
              <Text style={[styles.sectionTitle, { color: colors.textDark }]}>Notlar (opsiyonel)</Text>
              <TextInput
                style={[styles.notesInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
                placeholder="Ek bilgi veya gözlemlerinizi yazın..."
                placeholderTextColor={colors.textLight}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>
          )}

          {/* Kaydet */}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.sage }, !severity && styles.saveBtnDisabled]}
            disabled={!severity}
            onPress={handleSave}
          >
            <Text style={[styles.saveBtnText, { color: colors.white }]}>
              {severity === 'severe' ? '🚨 Kaydet & Programı Durdur' : '✓ Sonucu Kaydet'}
            </Text>
          </TouchableOpacity>

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
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  content: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 40 },

  // Meal info
  mealInfo: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg, ...Shadow.soft,
  },
  mealInfoEmoji: { fontSize: 36 },
  mealInfoTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  mealInfoSubtitle: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },

  sectionTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base },

  // Severity
  severityGrid: { flexDirection: 'row', gap: Spacing.sm },
  severityCard: {
    flex: 1, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', gap: Spacing.xs,
    borderWidth: 2,
  },
  severityEmoji: { fontSize: 24 },
  severityLabel: { fontFamily: FontFamily.semiBold, fontSize: 10, textAlign: 'center' },

  // Severe warning
  severeWarning: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    gap: Spacing.sm, borderWidth: 2,
  },
  severeWarningTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.lg, textAlign: 'center',
  },
  severeWarningText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 22, textAlign: 'center',
  },

  // Symptoms
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  symptomChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderWidth: 1,
  },
  symptomText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },

  // Notes
  notesSection: { gap: Spacing.sm },
  notesInput: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg, minHeight: 80, textAlignVertical: 'top',
    borderWidth: 1,
  },

  // Save
  saveBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
});
