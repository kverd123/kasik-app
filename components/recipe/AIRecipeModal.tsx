/**
 * Kaşık — AI Recipe Generator Modal
 * Full-screen modal for generating recipes from pantry items
 * Includes daily limit display, preferences, and result cards
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow, Typography } from '../../constants/theme';
import { Button } from '../ui/Button';
import { PremiumGate, usePremiumCheck } from '../ui/PremiumGate';
import { AIRecipeCard } from './AIRecipeCard';
import {
  generateAIRecipes,
  canGenerateRecipe,
  incrementDailyUsage,
  AIRecipeResult,
} from '../../lib/ai-recipes';
import { showInterstitialAsync } from '../../lib/ads';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import { PantryItem, AgeStage, AllergenType } from '../../types';

interface AIRecipeModalProps {
  visible: boolean;
  onClose: () => void;
  pantryItems: PantryItem[];
  babyAgeStage: AgeStage;
  knownAllergens: AllergenType[];
  babyName?: string;
  onSaveRecipe?: (recipe: AIRecipeResult) => void;
}

const MEAL_TYPES = [
  { id: 'any', label: 'Herhangi', emoji: '🍽️' },
  { id: 'breakfast', label: 'Kahvaltı', emoji: '🌅' },
  { id: 'lunch', label: 'Öğle', emoji: '☀️' },
  { id: 'snack', label: 'Ara Öğün', emoji: '🍌' },
  { id: 'dinner', label: 'Akşam', emoji: '🌙' },
];

const PREFERENCES = [
  { id: 'demir', label: 'Demir zengini', emoji: '💪' },
  { id: 'protein', label: 'Yüksek protein', emoji: '🥩' },
  { id: 'lif', label: 'Lifli', emoji: '🌾' },
  { id: 'hizli', label: 'Hızlı hazırlık', emoji: '⚡' },
  { id: 'sebze', label: 'Sebze ağırlıklı', emoji: '🥬' },
  { id: 'tatli', label: 'Doğal tatlı', emoji: '🍎' },
];

export const AIRecipeModal: React.FC<AIRecipeModalProps> = ({
  visible,
  onClose,
  pantryItems,
  babyAgeStage,
  knownAllergens,
  babyName,
  onSaveRecipe,
}) => {
  const colors = useColors();
  const { subscription } = useSubscriptionStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AIRecipeResult[]>([]);
  const [selectedMeal, setSelectedMeal] = useState('any');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [remaining, setRemaining] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const sessionRequestCountRef = React.useRef(0);

  useEffect(() => {
    if (visible) {
      checkLimit();
      setResults([]);
      setShowResults(false);
    }
  }, [visible]);

  const checkLimit = async () => {
    const status = await canGenerateRecipe(subscription.isPremium);
    setRemaining(status.remaining === Infinity ? -1 : status.remaining);
  };

  const handleGenerate = async () => {
    const status = await canGenerateRecipe(subscription.isPremium);
    if (!status.allowed) {
      Alert.alert(
        'Günlük Limit',
        'Bugünkü ücretsiz AI tarif hakkınız doldu. Premium ile sınırsız tarif alabilirsiniz.',
        [
          { text: 'Tamam', style: 'cancel' },
          { text: '✨ Premium\'a Geç', onPress: () => {} },
        ]
      );
      return;
    }

    // Show interstitial ad before 2nd request for free users
    sessionRequestCountRef.current += 1;
    if (!subscription.isPremium && sessionRequestCountRef.current === 2) {
      await showInterstitialAsync();
    }

    setIsGenerating(true);

    try {
      const prefText = selectedPrefs
        .map((id) => PREFERENCES.find((p) => p.id === id)?.label)
        .filter(Boolean)
        .join(', ');

      const recipes = await generateAIRecipes({
        pantryItems,
        babyAgeStage,
        knownAllergens,
        babyName,
        mealType: selectedMeal as any,
        preferences: prefText || undefined,
        count: 2,
      });

      setResults(recipes);
      setShowResults(true);

      if (!subscription.isPremium) {
        await incrementDailyUsage();
        await checkLimit();
      }
    } catch (error) {
      Alert.alert('Hata', 'Tarif oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePref = (id: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.cream }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🤖 AI Tarif Motoru</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!showResults ? (
            <>
              {/* Mascot intro */}
              <View style={styles.introSection}>
                <Text style={styles.mascot}>🥄</Text>
                <Text style={[styles.introTitle, { color: colors.textDark }]}>
                  Dolabınızdaki {pantryItems.length} malzeme ile{'\n'}tarif önerisi oluşturayım!
                </Text>
                <Text style={[styles.introSubtitle, { color: colors.textLight }]}>
                  {babyName ? `${babyName} için` : 'Bebeğiniz için'} güvenli ve besleyici
                </Text>
              </View>

              {/* Pantry preview */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textMid }]}>Dolaptaki Malzemeler</Text>
                <View style={styles.pantryGrid}>
                  {pantryItems.slice(0, 12).map((item) => (
                    <View key={item.id} style={[styles.pantryChip, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
                      <Text style={styles.pantryChipEmoji}>{item.emoji}</Text>
                      <Text style={[styles.pantryChipText, { color: colors.textDark }]}>{item.name}</Text>
                    </View>
                  ))}
                  {pantryItems.length > 12 && (
                    <View style={[styles.pantryChip, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
                      <Text style={[styles.pantryChipText, { color: colors.textDark }]}>+{pantryItems.length - 12}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Meal type */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textMid }]}>Öğün Tipi</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.chipRow}>
                    {MEAL_TYPES.map((meal) => (
                      <TouchableOpacity
                        key={meal.id}
                        style={[
                          styles.mealChip,
                          { backgroundColor: colors.white, borderColor: colors.creamDark },
                          selectedMeal === meal.id && { borderColor: colors.sage, backgroundColor: colors.sagePale },
                        ]}
                        onPress={() => setSelectedMeal(meal.id)}
                      >
                        <Text style={styles.mealChipEmoji}>{meal.emoji}</Text>
                        <Text
                          style={[
                            styles.mealChipText,
                            { color: colors.textMid },
                            selectedMeal === meal.id && { color: colors.sageDark, fontFamily: FontFamily.semiBold },
                          ]}
                        >
                          {meal.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Preferences */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textMid }]}>Tercihler (opsiyonel)</Text>
                <View style={styles.prefGrid}>
                  {PREFERENCES.map((pref) => (
                    <TouchableOpacity
                      key={pref.id}
                      style={[
                        styles.prefChip,
                        { backgroundColor: colors.white, borderColor: colors.creamDark },
                        selectedPrefs.includes(pref.id) && { borderColor: colors.sage, backgroundColor: colors.sagePale },
                      ]}
                      onPress={() => togglePref(pref.id)}
                    >
                      <Text style={styles.prefEmoji}>{pref.emoji}</Text>
                      <Text
                        style={[
                          styles.prefText,
                          { color: colors.textMid },
                          selectedPrefs.includes(pref.id) && { color: colors.sageDark, fontFamily: FontFamily.semiBold },
                        ]}
                      >
                        {pref.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Daily limit */}
              {remaining >= 0 && (
                <View style={[styles.limitInfo, { backgroundColor: colors.infoBg }]}>
                  <Text style={[styles.limitText, { color: colors.info }]}>
                    📊 Bugün {remaining} tarif hakkınız kaldı
                    {remaining === 0 && ' · Premium ile sınırsız'}
                  </Text>
                </View>
              )}
              {remaining === -1 && (
                <View style={[styles.limitInfo, { backgroundColor: colors.sagePale }]}>
                  <Text style={[styles.limitText, { color: colors.sageDark }]}>
                    ✨ Premium — Sınırsız AI tarif
                  </Text>
                </View>
              )}

              {/* Generate button */}
              <Button
                title={isGenerating ? 'Tarif oluşturuluyor...' : '🤖 Tarif Oluştur'}
                onPress={handleGenerate}
                loading={isGenerating}
                fullWidth
                size="lg"
                disabled={pantryItems.length === 0}
              />

              {pantryItems.length === 0 && (
                <Text style={[styles.emptyWarning, { color: colors.textLight }]}>
                  Dolabınıza malzeme ekleyerek tarif önerisi alabilirsiniz.
                </Text>
              )}
            </>
          ) : (
            <>
              {/* Results */}
              <View style={styles.resultsHeader}>
                <Text style={[styles.resultsTitle, { color: colors.textDark }]}>
                  🎉 {results.length} tarif buldum!
                </Text>
                <TouchableOpacity onPress={() => setShowResults(false)}>
                  <Text style={[styles.backBtn, { color: colors.sage }]}>← Tekrar dene</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resultsList}>
                {results.map((recipe, index) => (
                  <AIRecipeCard
                    key={index}
                    recipe={recipe}
                    onPress={() => {
                      Alert.alert(recipe.title, recipe.steps.join('\n\n'));
                    }}
                    onSave={onSaveRecipe ? () => onSaveRecipe(recipe) : undefined}
                  />
                ))}
              </View>

              {/* Generate more */}
              <Button
                title="🔄 Yeni Tarifler Oluştur"
                onPress={() => {
                  setShowResults(false);
                  handleGenerate();
                }}
                variant="outline"
                fullWidth
                size="lg"
              />
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  closeBtn: { fontSize: 20, fontWeight: '600', padding: 4 },
  headerTitle: { ...Typography.h3 },
  scrollContent: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 40 },
  introSection: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.lg },
  mascot: { fontSize: 56 },
  introTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    textAlign: 'center',
    lineHeight: 26,
  },
  introSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
  },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  pantryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  pantryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  pantryChipEmoji: { fontSize: 14 },
  pantryChipText: { fontFamily: FontFamily.medium, fontSize: 11 },
  chipRow: { flexDirection: 'row', gap: Spacing.sm },
  mealChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
  },
  mealChipEmoji: { fontSize: 18 },
  mealChipText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  prefGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  prefChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  prefEmoji: { fontSize: 14 },
  prefText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  limitInfo: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  limitText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  emptyWarning: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  backBtn: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  resultsList: { gap: Spacing.lg },
});
