/**
 * Kaşık — Allergen Selection Screen (Onboarding Step 3)
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { ALLERGENS } from '../../constants/allergens';
import { AllergenType } from '../../types';
import { useBabyStore } from '../../stores/babyStore';
import { useAuthStore } from '../../stores/authStore';
import { completeOnboarding } from '../../lib/firestore';
import { FOODS } from '../../constants/foods';

export default function AllergensScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState<AllergenType[]>([]);
  const [customAllergens, setCustomAllergens] = useState<string[]>([]);
  const [otherModalVisible, setOtherModalVisible] = useState(false);
  const [otherSearch, setOtherSearch] = useState('');
  const [customInput, setCustomInput] = useState('');
  const { updateBaby, baby, addCustomAllergen } = useBabyStore();
  const { user, refreshProfile } = useAuthStore();

  const toggleAllergen = (type: AllergenType) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((a) => a !== type) : [...prev, type]
    );
  };

  const toggleCustomAllergen = (name: string) => {
    setCustomAllergens((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const addCustom = () => {
    const name = customInput.trim();
    if (name && !customAllergens.includes(name)) {
      setCustomAllergens((prev) => [...prev, name]);
      setCustomInput('');
    }
  };

  // Filtrelenmiş ürün listesi (Diğer modal için)
  const filteredFoods = useMemo(() => {
    const q = otherSearch.toLowerCase().trim();
    const all = FOODS.map((f) => f.name);
    // Tipik alerjenleri hariç tut (zaten ana listede var)
    const allergenLabels = ALLERGENS.map((a) => a.label.toLowerCase());
    const filtered = all.filter((name) => !allergenLabels.some((al) => name.toLowerCase().includes(al)));
    if (!q) return filtered.slice(0, 30);
    return filtered.filter((name) => name.toLowerCase().includes(q));
  }, [otherSearch]);

  const handleComplete = async () => {
    // babyStore'a kaydet
    if (baby) {
      updateBaby({ knownAllergens: selected });
      customAllergens.forEach((name) => addCustomAllergen(name));
    }

    // Onboarding tamamlandı flag'ini Firestore'a yaz + local store güncelle
    if (user?.uid) {
      try {
        await completeOnboarding(user.uid);
        // Local store'u hemen güncelle (Firestore cache beklemeden)
        useAuthStore.setState((state) => ({
          user: state.user ? { ...state.user, onboardingCompleted: true } : state.user,
        }));
      } catch (e) {
        console.error('Onboarding tamamlama hatası:', e);
      }
    }

    router.replace('/(onboarding)/complete');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        <OnboardingProgress currentStep={3} totalSteps={4} />

        {/* Mascot with warning pose */}
        <View style={styles.mascotRow}>
          <Text style={styles.mascot}>🥄</Text>
          <View style={[styles.speechBubble, { backgroundColor: colors.warningBg }]}>
            <Text style={[styles.speechText, { color: colors.warningDark }]}>
              Takip etmeniz gereken{'\n'}alerjenleri seçin.{'\n'}Sonra da değiştirebilirsiniz.
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Alerjen Takibi</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Bebeğinizde alerjik reaksiyon gözlemlediğiniz veya takip etmek istediğiniz besinleri seçin.
        </Text>

        {/* Allergen Grid */}
        <View style={styles.allergenGrid}>
          {ALLERGENS.map((allergen) => {
            const isSelected = selected.includes(allergen.type);
            return (
              <TouchableOpacity
                key={allergen.type}
                style={[
                  styles.allergenCard,
                  { backgroundColor: colors.white, borderColor: colors.creamDark },
                  isSelected && { borderColor: colors.warningDark, backgroundColor: colors.warningBg },
                ]}
                onPress={() => toggleAllergen(allergen.type)}
                activeOpacity={0.7}
              >
                <Text style={styles.allergenEmoji}>{allergen.emoji}</Text>
                <Text style={[
                  styles.allergenLabel,
                  { color: colors.textMid },
                  isSelected && { color: colors.warningDark },
                ]}>
                  {allergen.label}
                </Text>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.warningDark }]}>
                    <Text style={[styles.checkMark, { color: colors.white }]}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          {/* Diğer kartı */}
          <TouchableOpacity
            style={[
              styles.allergenCard,
              { backgroundColor: colors.white, borderColor: colors.creamDark },
              customAllergens.length > 0 && { borderColor: colors.warningDark, backgroundColor: colors.warningBg },
            ]}
            onPress={() => setOtherModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.allergenEmoji}>➕</Text>
            <Text style={[
              styles.allergenLabel,
              { color: colors.textMid },
              customAllergens.length > 0 && { color: colors.warningDark },
            ]}>
              Diğer
            </Text>
            {customAllergens.length > 0 && (
              <View style={[styles.checkCircle, { backgroundColor: colors.warningDark }]}>
                <Text style={[styles.checkMark, { color: colors.white }]}>{customAllergens.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Seçilen özel alerjenler */}
        {customAllergens.length > 0 && (
          <View style={styles.customAllergenRow}>
            {customAllergens.map((name) => (
              <View key={name} style={[styles.customAllergenChip, { backgroundColor: colors.warningBg }]}>
                <Text style={[styles.customAllergenText, { color: colors.warningDark }]}>{name}</Text>
                <TouchableOpacity onPress={() => toggleCustomAllergen(name)}>
                  <Text style={[styles.customAllergenRemove, { color: colors.warningDark }]}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Info note */}
        <View style={[styles.infoNote, { backgroundColor: colors.infoBg }]}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={[styles.infoText, { color: colors.info }]}>
            Seçtiğiniz alerjenleri içeren tarifler için otomatik uyarı alacaksınız.
            Ayarlardan istediğiniz zaman güncelleyebilirsiniz.
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title={
              selected.length > 0 || customAllergens.length > 0
                ? `${selected.length + customAllergens.length} Alerjen Seçildi — Tamamla`
                : 'Alerjen Seçmeden Devam Et'
            }
            onPress={handleComplete}
            fullWidth
            size="lg"
            variant={selected.length > 0 || customAllergens.length > 0 ? 'primary' : 'outline'}
          />
        </View>
      </ScrollView>

      {/* Diğer Alerjen Modal */}
      <Modal
        visible={otherModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setOtherModalVisible(false)}
      >
        <SafeAreaView style={[styles.otherModalContainer, { backgroundColor: colors.cream }]}>
          <View style={[styles.otherModalHeader, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
            <TouchableOpacity onPress={() => setOtherModalVisible(false)}>
              <Text style={[styles.otherModalClose, { color: colors.textLight }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.otherModalTitle, { color: colors.textDark }]}>Diğer Alerjenler</Text>
            <TouchableOpacity onPress={() => setOtherModalVisible(false)}>
              <Text style={[styles.otherModalDone, { color: colors.sage }]}>Tamam</Text>
            </TouchableOpacity>
          </View>

          {/* Arama */}
          <View style={[styles.otherSearchBar, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
            <Text style={{ fontSize: 14 }}>🔍</Text>
            <TextInput
              style={[styles.otherSearchInput, { color: colors.textDark }]}
              placeholder="Ürün ara..."
              placeholderTextColor={colors.textLight}
              value={otherSearch}
              onChangeText={setOtherSearch}
            />
          </View>

          {/* Serbest metin ile ekle */}
          <View style={styles.customAddRow}>
            <TextInput
              style={[styles.customAddInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
              placeholder="Listede yoksa yazarak ekle..."
              placeholderTextColor={colors.textLight}
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={addCustom}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.customAddBtn, { backgroundColor: colors.sage }, !customInput.trim() && { opacity: 0.4 }]}
              onPress={addCustom}
              disabled={!customInput.trim()}
            >
              <Text style={[styles.customAddBtnText, { color: colors.white }]}>Ekle</Text>
            </TouchableOpacity>
          </View>

          {/* Seçilenler */}
          {customAllergens.length > 0 && (
            <View style={styles.otherSelectedRow}>
              {customAllergens.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={[styles.otherSelectedChip, { backgroundColor: colors.warningBg }]}
                  onPress={() => toggleCustomAllergen(name)}
                >
                  <Text style={[styles.otherSelectedText, { color: colors.warningDark }]}>{name} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Ürün listesi */}
          <ScrollView contentContainerStyle={styles.otherFoodList}>
            {filteredFoods.map((name) => {
              const isAdded = customAllergens.includes(name);
              return (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.otherFoodItem,
                    { backgroundColor: colors.white },
                    isAdded && { backgroundColor: colors.warningBg },
                  ]}
                  onPress={() => toggleCustomAllergen(name)}
                >
                  <Text style={[styles.otherFoodName, { color: colors.textDark }]}>{name}</Text>
                  {isAdded && <Text style={[styles.otherFoodCheck, { color: colors.warningDark }]}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: Spacing.xxl, paddingTop: Spacing.lg, paddingBottom: 40, gap: Spacing.xl },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  mascotRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  mascot: { fontSize: 48 },
  speechBubble: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md, maxWidth: 200,
  },
  speechText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 20 },
  title: { ...Typography.h2, textAlign: 'center' },
  subtitle: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md,
    textAlign: 'center', lineHeight: 22,
  },
  allergenGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: Spacing.md, justifyContent: 'center',
  },
  allergenCard: {
    width: '29%',
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    alignItems: 'center', gap: Spacing.sm,
    borderWidth: 2,
    ...Shadow.soft, position: 'relative',
  },
  allergenEmoji: { fontSize: 32 },
  allergenLabel: {
    fontFamily: FontFamily.semiBold, fontSize: 11,
    textAlign: 'center',
  },
  checkCircle: {
    position: 'absolute', top: 6, right: 6,
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  checkMark: { fontFamily: FontFamily.bold, fontSize: 10 },
  infoNote: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.md,
  },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 20 },
  ctaContainer: { gap: Spacing.md, marginTop: Spacing.sm },

  // Custom allergen chips
  customAllergenRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs,
  },
  customAllergenChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.round,
  },
  customAllergenText: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.xs,
  },
  customAllergenRemove: {
    fontFamily: FontFamily.bold, fontSize: 12,
  },

  // Other modal
  otherModalContainer: { flex: 1 },
  otherModalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  otherModalClose: { fontSize: 20, width: 28, textAlign: 'center' },
  otherModalTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  otherModalDone: { fontFamily: FontFamily.bold, fontSize: FontSize.md },
  otherSearchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    margin: Spacing.lg, borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg, borderWidth: 1,
  },
  otherSearchInput: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md,
    paddingVertical: Spacing.md,
  },
  customAddRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  customAddInput: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm, borderWidth: 1,
  },
  customAddBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg,
  },
  customAddBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
  otherSelectedRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs,
    marginHorizontal: Spacing.lg, marginBottom: Spacing.md,
  },
  otherSelectedChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs, borderRadius: BorderRadius.round,
  },
  otherSelectedText: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.xs,
  },
  otherFoodList: { paddingHorizontal: Spacing.lg, gap: 4, paddingBottom: 40 },
  otherFoodItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
  },
  otherFoodName: { fontFamily: FontFamily.medium, fontSize: FontSize.md },
  otherFoodCheck: { fontFamily: FontFamily.bold, fontSize: 16 },
});
