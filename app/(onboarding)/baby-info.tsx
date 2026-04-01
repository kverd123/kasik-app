/**
 * Kasik — Baby Info Screen (Onboarding Step 2)
 * Collects baby name, gender, birth date, feeding stage
 * Saves to babyStore for persistence
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { useBabyStore } from '../../stores/babyStore';
import { AgeStage } from '../../types';

const GENDER_OPTIONS = [
  { id: 'female' as const, label: 'Kız', emoji: '👧' },
  { id: 'male' as const, label: 'Erkek', emoji: '👦' },
  { id: 'other' as const, label: 'Belirtmek İstemiyorum', emoji: '👶' },
];

const STAGE_OPTIONS = [
  { id: '6m' as const, label: '6 Ay', desc: 'İlk püreler ve lapa' },
  { id: '8m' as const, label: '8 Ay', desc: 'Daha sert dokular' },
  { id: '12m+' as const, label: '12+ Ay', desc: 'Aile sofrasına geçiş' },
];

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear];

export default function BabyInfoScreen() {
  const colors = useColors();
  const { updateBaby, baby } = useBabyStore();

  const [babyName, setBabyName] = useState(baby?.name || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>(baby?.gender || '');
  const [stage, setStage] = useState<AgeStage | ''>(baby?.currentStage || '');
  const [birthMonth, setBirthMonth] = useState<number | null>(
    baby?.birthDate ? new Date(baby.birthDate).getMonth() : null
  );
  const [birthYear, setBirthYear] = useState<number | null>(
    baby?.birthDate ? new Date(baby.birthDate).getFullYear() : null
  );

  const canContinue = babyName.trim().length > 0 && gender && stage;

  const birthDate = useMemo(() => {
    if (birthMonth !== null && birthYear !== null) {
      return new Date(birthYear, birthMonth, 15);
    }
    return null;
  }, [birthMonth, birthYear]);

  const babyAgeText = useMemo(() => {
    if (!birthDate) return null;
    const now = new Date();
    const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
    if (months < 1) return 'Yenidoğan';
    if (months === 1) return '1 aylık';
    return `${months} aylık`;
  }, [birthDate]);

  const saveBabyData = () => {
    if (!baby) return;
    const updates: Partial<{ name: string; gender: 'male' | 'female' | 'other'; currentStage: AgeStage; birthDate: Date }> = {};
    if (babyName.trim()) updates.name = babyName.trim();
    if (gender) updates.gender = gender;
    if (stage) updates.currentStage = stage;
    if (birthDate) updates.birthDate = birthDate;
    if (Object.keys(updates).length > 0) {
      updateBaby(updates);
    }
  };

  const handleContinue = () => {
    saveBabyData();
    router.push('/(onboarding)/allergens');
  };

  const handleSkip = () => {
    saveBabyData();
    router.push('/(onboarding)/allergens');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <OnboardingProgress currentStep={2} totalSteps={4} />

        {/* Mascot */}
        <View style={styles.mascotRow}>
          <Text style={styles.mascot}>🥄</Text>
          <Text style={[styles.mascotText, { color: colors.textMid }]}>Bebeğinizi tanıyalım!</Text>
        </View>

        <Text style={styles.title}>Bebek Bilgileri</Text>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textMid }]}>Bebeğinizin adı</Text>
          <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
            <TextInput
              style={[styles.input, { color: colors.textDark }]}
              value={babyName}
              onChangeText={setBabyName}
              placeholder="Bebeğinizin adını yazın"
              placeholderTextColor={colors.border}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Gender */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textMid }]}>Cinsiyet</Text>
          <View style={styles.optionRow}>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionCard,
                  { backgroundColor: colors.white, borderColor: colors.creamDark },
                  gender === opt.id && { borderColor: colors.sage, backgroundColor: colors.sagePale },
                ]}
                onPress={() => setGender(opt.id)}
              >
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: colors.textMid },
                    gender === opt.id && { color: colors.sageDark, fontFamily: FontFamily.semiBold },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Birth Date */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textMid }]}>Doğum tarihi</Text>
          <View style={styles.dateRow}>
            {/* Month picker */}
            <View style={styles.datePickerGroup}>
              <Text style={[styles.datePickerLabel, { color: colors.textLight }]}>Ay</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateChipScroll}
              >
                {MONTHS.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.dateChip,
                      { backgroundColor: colors.white, borderColor: colors.creamDark },
                      birthMonth === index && { backgroundColor: colors.sage, borderColor: colors.sage },
                    ]}
                    onPress={() => setBirthMonth(index)}
                  >
                    <Text style={[
                      styles.dateChipText,
                      { color: colors.textMid },
                      birthMonth === index && { color: colors.white, fontFamily: FontFamily.bold },
                    ]}>
                      {month.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {/* Year picker */}
            <View style={styles.datePickerGroup}>
              <Text style={[styles.datePickerLabel, { color: colors.textLight }]}>Yıl</Text>
              <View style={styles.yearRow}>
                {YEARS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearChip,
                      { backgroundColor: colors.white, borderColor: colors.creamDark },
                      birthYear === year && { backgroundColor: colors.sage, borderColor: colors.sage },
                    ]}
                    onPress={() => setBirthYear(year)}
                  >
                    <Text style={[
                      styles.yearChipText,
                      { color: colors.textMid },
                      birthYear === year && { color: colors.white, fontFamily: FontFamily.bold },
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          {babyAgeText && (
            <View style={[styles.ageBadge, { backgroundColor: colors.sagePale }]}>
              <Text style={[styles.ageBadgeText, { color: colors.sageDark }]}>👶 {babyAgeText}</Text>
            </View>
          )}
        </View>

        {/* Stage */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textMid }]}>Ek gıda aşaması</Text>
          <View style={styles.stageList}>
            {STAGE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.stageCard,
                  { backgroundColor: colors.white, borderColor: colors.creamDark },
                  stage === opt.id && { borderColor: colors.sage, backgroundColor: colors.sagePale },
                ]}
                onPress={() => setStage(opt.id)}
              >
                <View style={[
                  styles.stageRadio,
                  { borderColor: colors.border },
                  stage === opt.id && { borderColor: colors.sage },
                ]}>
                  {stage === opt.id && <View style={[styles.stageRadioDot, { backgroundColor: colors.sage }]} />}
                </View>
                <View>
                  <Text style={[
                    styles.stageLabel,
                    { color: colors.textDark },
                    stage === opt.id && { color: colors.sageDark },
                  ]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.stageDesc, { color: colors.textLight }]}>{opt.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue */}
        <View style={styles.ctaContainer}>
          <Button
            title="Devam →"
            onPress={handleContinue}
            fullWidth
            size="lg"
            disabled={!canContinue}
          />
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.skipText, { color: colors.textLight }]}>Şimdilik geç</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.xxl, paddingTop: Spacing.lg, paddingBottom: 40, gap: Spacing.xl },
  mascotRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  mascot: { fontSize: 36 },
  mascotText: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  title: { ...Typography.h2, textAlign: 'center' },
  inputGroup: { gap: Spacing.md },
  label: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  inputWrapper: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg, height: 52, justifyContent: 'center',
    ...Shadow.soft,
  },
  input: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  optionRow: { flexDirection: 'row', gap: Spacing.md },
  optionCard: {
    flex: 1, borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1.5, ...Shadow.soft,
  },
  optionEmoji: { fontSize: 28 },
  optionLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, textAlign: 'center' },

  // Date picker
  dateRow: { gap: Spacing.md },
  datePickerGroup: { gap: Spacing.sm },
  datePickerLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  dateChipScroll: { gap: Spacing.xs, paddingRight: Spacing.md },
  dateChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  dateChipText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  yearRow: { flexDirection: 'row', gap: Spacing.sm },
  yearChip: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  yearChipText: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
  ageBadge: {
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  ageBadgeText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },

  // Stage
  stageList: { gap: Spacing.md },
  stageCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 1.5,
    ...Shadow.soft,
  },
  stageRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  stageRadioDot: { width: 12, height: 12, borderRadius: 6 },
  stageLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  stageDesc: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, marginTop: 2 },
  ctaContainer: { gap: Spacing.md, marginTop: Spacing.lg },
  skipText: { fontFamily: FontFamily.medium, fontSize: FontSize.md, textAlign: 'center' },
});
