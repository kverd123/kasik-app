/**
 * Kaşık — Alerjen Açma Programı Başlatma Modal
 * Çok adımlı: Sorumluluk Reddi → Alerjen Seç → Doktor Planı → Önizleme → Başlat
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
  TextInput,
  Platform,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Shadow } from '../../constants/theme';
import { ALLERGENS } from '../../constants/allergens';
import { AllergenType, MealSlot, AgeStage, PantryCategory } from '../../types';
import {
  ALLERGEN_PROGRAM_TEMPLATES,
  DISCLAIMER_TEXT,
  STOP_WARNING_TEXT,
  ALLERGEN_SYMPTOMS,
  AllergenIntroProgramConfig,
  AllergenIntroDayPlan,
  AllergenIntroMeal,
} from '../../constants/allergenIntro';
import { useAllergenIntroStore } from '../../stores/allergenIntroStore';
import { useMealPlanStore } from '../../stores/mealPlanStore';
import { useRecipeBookStore } from '../../stores/recipeBookStore';
import { ALL_RECIPES, RecipeData, RecipeIngredient } from '../../constants/recipes';
import { FOODS, FoodItem, CATEGORY_LABELS } from '../../constants/foods';
import { useNotificationStore } from '../../stores/notificationStore';
import { useBabyStore } from '../../stores/babyStore';
import { scheduleAllergenCheck } from '../../lib/notifications';

interface AllergenIntroModalProps {
  visible: boolean;
  onClose: () => void;
}

type Step = 'disclaimer' | 'allergen' | 'plan' | 'preview' | 'symptoms';

interface CustomMealData {
  name: string;
  emoji: string;
  recipeId?: string; // Uygulama tarifinden seçildiyse
  ingredients?: RecipeIngredient[];
  steps?: string[];
  prepTime?: number;
}

const UNIT_OPTIONS = [
  'kaşık', 'bardak', 'adet', 'gram', 'ml',
  'küçük', 'orta', 'büyük', 'demet', 'dilim', 'tutam',
];

export function AllergenIntroModal({ visible, onClose }: AllergenIntroModalProps) {
  const colors = useColors();
  const [step, setStep] = useState<Step>('disclaimer');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [selectedAllergen, setSelectedAllergen] = useState<AllergenType | null>(null);
  const [customAllergenName, setCustomAllergenName] = useState('');
  const [totalDays, setTotalDays] = useState('3');
  const [mealsPerDay, setMealsPerDay] = useState('1');
  // Özel tarif atama
  const [customMealNames, setCustomMealNames] = useState<Record<string, CustomMealData>>({});
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [recipePickerVisible, setRecipePickerVisible] = useState(false);
  const [recipeSearch, setRecipeSearch] = useState('');
  // Manuel tarif formu state'leri
  const [manualFormVisible, setManualFormVisible] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualPrepTime, setManualPrepTime] = useState('15');
  const [manualIngredients, setManualIngredients] = useState<RecipeIngredient[]>([]);
  const [manualSteps, setManualSteps] = useState<string[]>(['']);
  // Malzeme ekleme (iç modal)
  const [showIngredientPicker, setShowIngredientPicker] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [showCustomIngredient, setShowCustomIngredient] = useState(false);
  const [customIngName, setCustomIngName] = useState('');
  const [customIngEmoji, setCustomIngEmoji] = useState('🥄');
  const [selectedAmount, setSelectedAmount] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState('adet');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const { startProgram } = useAllergenIntroStore();
  const { addMealToSlot } = useMealPlanStore();
  const { getAllSavedRecipes } = useRecipeBookStore();
  const { preferences: notifPrefs } = useNotificationStore();
  const { baby } = useBabyStore();

  const resetForm = () => {
    setStep('disclaimer');
    setDisclaimerAccepted(false);
    setSelectedAllergen(null);
    setCustomAllergenName('');
    setTotalDays('3');
    setMealsPerDay('1');
    setCustomMealNames({});
    setEditingMealId(null);
    setRecipePickerVisible(false);
    setRecipeSearch('');
    resetManualForm();
  };

  const resetManualForm = () => {
    setManualFormVisible(false);
    setManualTitle('');
    setManualPrepTime('15');
    setManualIngredients([]);
    setManualSteps(['']);
    setShowIngredientPicker(false);
    setIngredientSearch('');
    setShowCustomIngredient(false);
    setCustomIngName('');
    setCustomIngEmoji('🥄');
    setSelectedAmount('1');
    setSelectedUnit('adet');
    setSelectedFood(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Şablondan günlük plan oluştur
  const generatedPlan = useMemo(() => {
    if (!selectedAllergen) return [];
    const templates = ALLERGEN_PROGRAM_TEMPLATES[selectedAllergen] || [];
    const days = parseInt(totalDays) || 3;
    const perDay = parseInt(mealsPerDay) || 1;
    const slots: MealSlot[] = ['breakfast', 'lunch', 'snack', 'dinner'];

    const plan: AllergenIntroDayPlan[] = [];
    for (let d = 0; d < days; d++) {
      const meals: AllergenIntroMeal[] = [];
      for (let m = 0; m < perDay; m++) {
        const template = templates.length > 0
          ? (templates[d % templates.length] || templates[0])
          : null;
        const mealKey = `${d}-${m}`;
        const customMeal = customMealNames[mealKey];
        meals.push({
          id: `allergen-${Date.now()}-${d}-${m}`,
          slot: slots[m % slots.length],
          recipeName: customMeal ? customMeal.name : (template ? template.recipeName : (customAllergenName || 'Özel Alerjen')),
          emoji: customMeal ? customMeal.emoji : (template ? template.emoji : '⚠️'),
          completed: false,
        });
      }
      plan.push({ day: d + 1, meals });
    }
    return plan;
  }, [selectedAllergen, totalDays, mealsPerDay, customAllergenName, customMealNames]);

  const handleStartProgram = () => {
    if (!selectedAllergen) return;

    const program: AllergenIntroProgramConfig = {
      id: `program-${Date.now()}`,
      allergenType: selectedAllergen,
      ...(selectedAllergen === 'other' && customAllergenName.trim()
        ? { customAllergenName: customAllergenName.trim() }
        : {}),
      totalDays: parseInt(totalDays) || 3,
      mealsPerDay: parseInt(mealsPerDay) || 1,
      startDate: new Date(),
      status: 'active',
      dailyPlan: generatedPlan,
    };

    startProgram(program);

    // Alerjen takip bildirimi zamanla (72 saat sonra hatırlatma)
    if (notifPrefs.allergenTracking && baby?.name) {
      const allergenName = selectedAllergen === 'other'
        ? customAllergenName.trim() || 'Diğer'
        : ALLERGENS.find((a) => a.type === selectedAllergen)?.label || selectedAllergen;
      scheduleAllergenCheck(allergenName, baby.name).catch(console.error);
    }

    // Plana otomatik öğün ekle (bugünün indeksinden başla)
    const todayDayIndex = new Date().getDay();
    const mondayIndex = todayDayIndex === 0 ? 6 : todayDayIndex - 1;

    generatedPlan.forEach((day, idx) => {
      const dayIndex = (mondayIndex + idx) % 7;
      day.meals.forEach((meal, mealIdx) => {
        const mealKey = `${idx}-${mealIdx}`;
        const customData = customMealNames[mealKey];
        addMealToSlot(dayIndex, meal.slot, {
          id: meal.id,
          slot: meal.slot,
          foodName: meal.recipeName,
          emoji: meal.emoji,
          ageGroup: '8m',
          completed: false,
          isFirstTry: true,
          allergenWarning: [selectedAllergen],
          ...(customData?.recipeId ? { recipeId: customData.recipeId } : {}),
          ...(customData?.ingredients?.length ? {
            ingredients: customData.ingredients.map((ing) => ({
              name: ing.name,
              emoji: ing.emoji,
              amount: ing.amount,
              unit: ing.unit,
              isAllergen: ing.isAllergen,
            })),
          } : {}),
          ...(customData?.steps?.length ? { steps: customData.steps } : {}),
          ...(customData?.prepTime ? { prepTime: customData.prepTime } : {}),
        });
      });
    });

    handleClose();
  };

  const allergenInfo = selectedAllergen
    ? selectedAllergen === 'other'
      ? { type: 'other' as const, label: customAllergenName.trim() || 'Diğer', emoji: '⚠️', description: '' }
      : ALLERGENS.find((a) => a.type === selectedAllergen)
    : null;

  // ===== ADIM 1: SORUMLULUK REDDİ =====
  const renderDisclaimer = () => (
    <ScrollView contentContainerStyle={styles.stepContent}>
      <View style={styles.disclaimerIcon}>
        <Text style={{ fontSize: 48 }}>⚕️</Text>
      </View>
      <Text style={[styles.stepTitle, { color: colors.textDark }]}>Sorumluluk Bildirimi</Text>
      <View style={[styles.disclaimerBox, { backgroundColor: colors.warningBg, borderColor: colors.peach }]}>
        <Text style={[styles.disclaimerText, { color: colors.warningDark }]}>{DISCLAIMER_TEXT}</Text>
      </View>
      <TouchableOpacity
        style={styles.acceptRow}
        onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
      >
        <View style={[
          styles.acceptCheckbox,
          { borderColor: colors.creamDark },
          disclaimerAccepted && { borderColor: colors.sage, backgroundColor: colors.sage },
        ]}>
          {disclaimerAccepted && <Text style={[styles.acceptCheck, { color: colors.white }]}>✓</Text>}
        </View>
        <Text style={[styles.acceptText, { color: colors.textMid }]}>
          Yukarıdaki bilgileri okudum, anladım ve doktor kontrolünde olduğumu onaylıyorum.
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: colors.sage }, !disclaimerAccepted && styles.nextBtnDisabled]}
        disabled={!disclaimerAccepted}
        onPress={() => setStep('allergen')}
      >
        <Text style={[styles.nextBtnText, { color: colors.white }]}>Kabul Ediyorum</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ===== ADIM 2: ALERJEN SEÇİMİ =====
  const canProceedAllergen = selectedAllergen !== null &&
    (selectedAllergen !== 'other' || customAllergenName.trim().length > 0);

  const renderAllergenSelect = () => (
    <ScrollView contentContainerStyle={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.textDark }]}>Hangi alerjeni açmak istiyorsunuz?</Text>
      <View style={styles.allergenGrid}>
        {ALLERGENS.map((a) => {
          const isSelected = selectedAllergen === a.type;
          return (
            <TouchableOpacity
              key={a.type}
              style={[
                styles.allergenCard,
                { backgroundColor: colors.white, borderColor: colors.creamDark },
                isSelected && { borderColor: colors.sage, backgroundColor: colors.sagePale },
              ]}
              onPress={() => setSelectedAllergen(a.type)}
            >
              <Text style={styles.allergenEmoji}>{a.emoji}</Text>
              <Text style={[
                styles.allergenLabel,
                { color: colors.textMid },
                isSelected && { color: colors.sage },
              ]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* Diğer kartı */}
        <TouchableOpacity
          style={[
            styles.allergenCard,
            { backgroundColor: colors.white, borderColor: colors.creamDark },
            selectedAllergen === 'other' && { borderColor: colors.sage, backgroundColor: colors.sagePale },
          ]}
          onPress={() => setSelectedAllergen('other')}
        >
          <Text style={styles.allergenEmoji}>➕</Text>
          <Text style={[
            styles.allergenLabel,
            { color: colors.textMid },
            selectedAllergen === 'other' && { color: colors.sage },
          ]}>
            Diğer
          </Text>
        </TouchableOpacity>
      </View>

      {/* Diğer seçiliyse isim girişi */}
      {selectedAllergen === 'other' && (
        <View style={styles.customAllergenInput}>
          <Text style={[styles.formLabel, { color: colors.textDark }]}>Alerjen adı:</Text>
          <TextInput
            style={[styles.customAllergenField, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
            placeholder="Ör: Mısır, Çilek, Kereviz..."
            placeholderTextColor={colors.textLight}
            value={customAllergenName}
            onChangeText={setCustomAllergenName}
            returnKeyType="done"
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.nextBtn, { backgroundColor: colors.sage }, !canProceedAllergen && styles.nextBtnDisabled]}
        disabled={!canProceedAllergen}
        onPress={() => setStep('plan')}
      >
        <Text style={[styles.nextBtnText, { color: colors.white }]}>Devam →</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ===== ADIM 3: DOKTOR PLANI =====
  const renderPlanInput = () => (
    <ScrollView contentContainerStyle={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.textDark }]}>Doktor Planı</Text>
      <Text style={[styles.stepSubtitle, { color: colors.textLight }]}>
        Doktorunuzun önerdiği alerjen açma planını girin.
      </Text>

      <View style={[styles.doctorWarningBox, { backgroundColor: colors.warningBg, borderColor: colors.peach }]}>
        <Text style={[styles.doctorWarningText, { color: colors.warningDark }]}>
          ⚠️ Bu program yalnızca doktor kontrolünde uygulanmalıdır.
          Doktorunuzdan aldığınız plan bilgilerini aşağıya girin.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>Kaç gün sürecek?</Text>
        <View style={styles.chipRow}>
          {['1', '2', '3', '5', '7'].map((d) => (
            <TouchableOpacity
              key={d}
              style={[
                styles.chip,
                { backgroundColor: colors.white, borderColor: colors.creamDark },
                totalDays === d && { backgroundColor: colors.sage, borderColor: colors.sage },
              ]}
              onPress={() => setTotalDays(d)}
            >
              <Text style={[
                styles.chipText,
                { color: colors.textMid },
                totalDays === d && { color: colors.white },
              ]}>
                {d} gün
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>Günde kaç öğün?</Text>
        <View style={styles.chipRow}>
          {['1', '2', '3'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.chip,
                { backgroundColor: colors.white, borderColor: colors.creamDark },
                mealsPerDay === m && { backgroundColor: colors.sage, borderColor: colors.sage },
              ]}
              onPress={() => setMealsPerDay(m)}
            >
              <Text style={[
                styles.chipText,
                { color: colors.textMid },
                mealsPerDay === m && { color: colors.white },
              ]}>
                {m} öğün
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.sage }]} onPress={() => setStep('preview')}>
        <Text style={[styles.nextBtnText, { color: colors.white }]}>Program Önizleme →</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Tarif seçici: arama yapılmadığında boş, yazınca filtrele
  const savedRecipeIds = new Set(getAllSavedRecipes().map((r) => r.id));

  const filteredRecipes = useMemo(() => {
    const q = recipeSearch.toLowerCase().trim();
    if (!q) return []; // Arama yoksa liste boş
    const saved = getAllSavedRecipes();
    const rest = ALL_RECIPES.filter((r) => !savedRecipeIds.has(r.id));
    const combined = [...saved, ...rest];
    return combined.filter((r) =>
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some((ing) => ing.name.toLowerCase().includes(q))
    ).slice(0, 20);
  }, [recipeSearch]);

  const handlePickRecipe = (recipe: RecipeData) => {
    if (!editingMealId) return;
    setCustomMealNames((prev) => ({
      ...prev,
      [editingMealId]: {
        name: recipe.title,
        emoji: recipe.emoji,
        recipeId: recipe.id,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        prepTime: recipe.prepTime,
      },
    }));
    setRecipePickerVisible(false);
    setEditingMealId(null);
    setRecipeSearch('');
  };

  const handleSaveManualRecipe = () => {
    if (!editingMealId || !manualTitle.trim()) return;
    setCustomMealNames((prev) => ({
      ...prev,
      [editingMealId]: {
        name: manualTitle.trim(),
        emoji: '🍽️',
        ingredients: manualIngredients.length > 0 ? manualIngredients : undefined,
        steps: manualSteps.filter((s) => s.trim()).length > 0
          ? manualSteps.filter((s) => s.trim())
          : undefined,
        prepTime: parseInt(manualPrepTime) || undefined,
      },
    }));
    setRecipePickerVisible(false);
    setEditingMealId(null);
    resetManualForm();
  };

  // Malzeme yönetimi
  const filteredFoods = useMemo(() => {
    if (!ingredientSearch.trim()) return FOODS;
    const q = ingredientSearch.toLowerCase();
    return FOODS.filter((f) => f.name.toLowerCase().includes(q) || f.emoji.includes(q));
  }, [ingredientSearch]);

  const groupedFoods = useMemo(() => {
    const groups: Record<string, FoodItem[]> = {};
    for (const food of filteredFoods) {
      if (!groups[food.category]) groups[food.category] = [];
      groups[food.category].push(food);
    }
    return groups;
  }, [filteredFoods]);

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setSelectedAmount('1');
    setSelectedUnit('adet');
    setShowCustomIngredient(false);
  };

  const confirmIngredient = () => {
    if (selectedFood) {
      setManualIngredients((prev) => [...prev, {
        name: selectedFood.name,
        emoji: selectedFood.emoji,
        amount: parseFloat(selectedAmount) || 1,
        unit: selectedUnit,
        isAllergen: selectedFood.allergens.length > 0,
      }]);
    } else if (showCustomIngredient && customIngName.trim()) {
      setManualIngredients((prev) => [...prev, {
        name: customIngName.trim(),
        emoji: customIngEmoji || '🥄',
        amount: parseFloat(selectedAmount) || 1,
        unit: selectedUnit,
      }]);
    }
    setSelectedFood(null);
    setShowCustomIngredient(false);
    setCustomIngName('');
    setCustomIngEmoji('🥄');
    setSelectedAmount('1');
    setSelectedUnit('adet');
    setShowIngredientPicker(false);
    setIngredientSearch('');
  };

  const removeManualIngredient = (index: number) => {
    setManualIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addManualStep = () => setManualSteps((prev) => [...prev, '']);
  const updateManualStep = (index: number, text: string) => {
    setManualSteps((prev) => prev.map((s, i) => (i === index ? text : s)));
  };
  const removeManualStep = (index: number) => {
    if (manualSteps.length <= 1) return;
    setManualSteps((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== ADIM 4: PROGRAM ÖNİZLEME =====
  const renderPreview = () => (
    <ScrollView contentContainerStyle={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.textDark }]}>
        {allergenInfo?.emoji} {allergenInfo?.label} Açma Programı
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textLight }]}>
        {totalDays} gün · Günde {mealsPerDay} öğün
      </Text>

      <View style={[styles.doctorNoteBox, { backgroundColor: colors.infoBg, borderColor: colors.blueMid }]}>
        <Text style={styles.doctorNoteIcon}>👨‍⚕️</Text>
        <Text style={[styles.doctorNoteText, { color: colors.infoDark }]}>
          Aşağıdaki tarifler önerimizdir. Doktorunuzun önerdiği tarifler farklıysa, öğüne dokunarak değiştirebilirsiniz.
        </Text>
      </View>

      {generatedPlan.map((day, dayIdx) => (
        <View key={day.day} style={[styles.previewDay, { backgroundColor: colors.white }]}>
          <Text style={[styles.previewDayTitle, { color: colors.textDark }]}>Gün {day.day}</Text>
          {day.meals.map((meal, mealIdx) => {
            const mealKey = `${dayIdx}-${mealIdx}`;
            const customData = customMealNames[mealKey];
            const hasCustom = !!customData;
            const hasDetails = customData && (customData.ingredients?.length || customData.steps?.length);
            return (
              <TouchableOpacity
                key={meal.id}
                style={[styles.previewMeal, styles.previewMealTouchable, { backgroundColor: colors.creamDark + '30' }]}
                onPress={() => {
                  setEditingMealId(mealKey);
                  setRecipePickerVisible(true);
                }}
              >
                <Text style={styles.previewMealEmoji}>{meal.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.previewMealName,
                    { color: colors.textMid },
                    !hasCustom && selectedAllergen === 'other' && { color: colors.textLight, fontStyle: 'italic' },
                  ]}>
                    {meal.recipeName}
                  </Text>
                  {hasDetails && (
                    <Text style={[styles.previewMealDetails, { color: colors.sage }]}>
                      {customData.ingredients?.length ? `${customData.ingredients.length} malzeme` : ''}
                      {customData.ingredients?.length && customData.steps?.length ? ' · ' : ''}
                      {customData.steps?.length ? `${customData.steps.length} adım` : ''}
                      {customData.prepTime ? ` · ${customData.prepTime} dk` : ''}
                    </Text>
                  )}
                </View>
                <Text style={[styles.previewMealEdit, { color: colors.sage }]}>{hasCustom ? '✎' : '+'}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.sage }]} onPress={() => setStep('symptoms')}>
        <Text style={[styles.nextBtnText, { color: colors.white }]}>Uyarıları Gör →</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ===== ADIM 5: SEMPTOM UYARILARI + BAŞLAT =====
  const renderSymptoms = () => (
    <ScrollView contentContainerStyle={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.textDark }]}>Dikkat Edilecekler</Text>

      <View style={[styles.stopWarningBox, { backgroundColor: colors.dangerBg, borderColor: colors.heart }]}>
        <Text style={[styles.stopWarningTitle, { color: colors.dangerDark }]}>🚨 Durma Noktası — Hemen Doktora Başvurun</Text>
        <Text style={[styles.stopWarningText, { color: colors.dangerDark }]}>{STOP_WARNING_TEXT}</Text>

        <Text style={[styles.stopWarningSymptomsTitle, { color: colors.dangerDark }]}>
          Aşağıdaki semptomlardan herhangi biri görülürse programı durdurun ve doktorunuza başvurun:
        </Text>
        <View style={styles.symptomsList}>
          {ALLERGEN_SYMPTOMS.map((s) => (
            <View key={s.id} style={styles.symptomRow}>
              <Text style={styles.symptomEmoji}>{s.emoji}</Text>
              <Text style={[styles.symptomLabelWarning, { color: colors.dangerDark }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.stopWarningFooter, { color: colors.dangerDark }]}>
          112'yi arayın veya en yakın acil servise gidin. Programı uygulama üzerinden istediğiniz zaman durdurabilirsiniz.
        </Text>
      </View>

      <TouchableOpacity style={[styles.startBtn, { backgroundColor: colors.warningDark }]} onPress={handleStartProgram}>
        <Text style={[styles.startBtnText, { color: colors.white }]}>
          {allergenInfo?.emoji} Programı Başlat
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const stepIndex = ['disclaimer', 'allergen', 'plan', 'preview', 'symptoms'].indexOf(step);
  const goBack = () => {
    const steps: Step[] = ['disclaimer', 'allergen', 'plan', 'preview', 'symptoms'];
    if (stepIndex > 0) setStep(steps[stepIndex - 1]);
    else handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
          <TouchableOpacity onPress={goBack}>
            <Text style={[styles.headerBack, { color: colors.textLight }]}>{step === 'disclaimer' ? '✕' : '←'}</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textDark }]}>Alerjen Açma</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[0, 1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={[styles.stepLine, { backgroundColor: colors.creamDark }, i <= stepIndex && { backgroundColor: colors.sage }]} />}
              <View style={[styles.stepDot, { backgroundColor: colors.creamDark }, i <= stepIndex && { backgroundColor: colors.sage, width: 12, height: 12, borderRadius: 6 }]} />
            </React.Fragment>
          ))}
        </View>

        {step === 'disclaimer' && renderDisclaimer()}
        {step === 'allergen' && renderAllergenSelect()}
        {step === 'plan' && renderPlanInput()}
        {step === 'preview' && renderPreview()}
        {step === 'symptoms' && renderSymptoms()}
      </SafeAreaView>

      {/* Tarif Seçici Modal */}
      <Modal
        visible={recipePickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => { setRecipePickerVisible(false); setEditingMealId(null); resetManualForm(); }}
      >
        <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
          <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
            <TouchableOpacity onPress={() => {
              if (manualFormVisible) {
                setManualFormVisible(false);
              } else {
                setRecipePickerVisible(false);
                setEditingMealId(null);
                resetManualForm();
              }
            }}>
              <Text style={[styles.headerBack, { color: colors.textLight }]}>{manualFormVisible ? '←' : '✕'}</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textDark }]}>{manualFormVisible ? 'Tarif Ekle' : 'Tarif Seç'}</Text>
            <View style={{ width: 28 }} />
          </View>

          {manualFormVisible ? (
            /* ===== MANUEL TARİF FORMU ===== */
            <ScrollView contentContainerStyle={styles.manualFormContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {/* Tarif adı */}
              <View style={styles.mfGroup}>
                <Text style={[styles.mfLabel, { color: colors.textDark }]}>🍽 Tarif Adı</Text>
                <TextInput
                  style={[styles.mfInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
                  placeholder="Ör: Haşlanmış yumurta sarısı"
                  placeholderTextColor={colors.textLight}
                  value={manualTitle}
                  onChangeText={setManualTitle}
                  autoFocus
                />
              </View>

              {/* Hazırlık süresi */}
              <View style={styles.mfGroup}>
                <Text style={[styles.mfLabel, { color: colors.textDark }]}>⏱ Hazırlık Süresi (dk)</Text>
                <TextInput
                  style={[styles.mfInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark, width: 100 }]}
                  placeholder="15"
                  placeholderTextColor={colors.textLight}
                  value={manualPrepTime}
                  onChangeText={setManualPrepTime}
                  keyboardType="numeric"
                />
              </View>

              {/* Malzemeler */}
              <View style={styles.mfGroup}>
                <View style={styles.mfLabelRow}>
                  <Text style={[styles.mfLabel, { color: colors.textDark }]}>🥕 Malzemeler</Text>
                  <Text style={[styles.mfCount, { color: colors.textLight }]}>{manualIngredients.length} malzeme</Text>
                </View>
                {manualIngredients.map((ing, idx) => (
                  <View key={idx} style={[styles.mfIngRow, { backgroundColor: colors.white }]}>
                    <Text style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{ing.emoji}</Text>
                    <Text style={[styles.mfIngName, { color: colors.textDark }]}>{ing.name}</Text>
                    <Text style={[styles.mfIngAmount, { color: colors.textLight }]}>{ing.amount} {ing.unit}</Text>
                    <TouchableOpacity onPress={() => removeManualIngredient(idx)}>
                      <Text style={[styles.mfIngRemove, { color: colors.heart }]}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.mfAddBtn, { backgroundColor: colors.white, borderColor: colors.creamDark }]}
                  onPress={() => setShowIngredientPicker(true)}
                >
                  <Text style={[styles.mfAddBtnText, { color: colors.sage }]}>+ Malzeme Ekle</Text>
                </TouchableOpacity>
              </View>

              {/* Yapılışı */}
              <View style={styles.mfGroup}>
                <Text style={[styles.mfLabel, { color: colors.textDark }]}>📝 Yapılışı</Text>
                {manualSteps.map((stepText, idx) => (
                  <View key={idx} style={styles.mfStepRow}>
                    <View style={[styles.mfStepNum, { backgroundColor: colors.sage }]}>
                      <Text style={[styles.mfStepNumText, { color: colors.white }]}>{idx + 1}</Text>
                    </View>
                    <TextInput
                      style={[styles.mfStepInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
                      placeholder={`Adım ${idx + 1}...`}
                      placeholderTextColor={colors.textLight}
                      value={stepText}
                      onChangeText={(t) => updateManualStep(idx, t)}
                      multiline
                    />
                    {manualSteps.length > 1 && (
                      <TouchableOpacity onPress={() => removeManualStep(idx)}>
                        <Text style={[styles.mfStepRemove, { color: colors.heart }]}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity style={[styles.mfAddStepBtn, { backgroundColor: colors.white, borderColor: colors.creamDark }]} onPress={addManualStep}>
                  <Text style={[styles.mfAddBtnText, { color: colors.sage }]}>+ Adım Ekle</Text>
                </TouchableOpacity>
              </View>

              {/* Kaydet */}
              <TouchableOpacity
                style={[styles.mfSaveBtn, { backgroundColor: colors.sage }, !manualTitle.trim() && styles.nextBtnDisabled]}
                disabled={!manualTitle.trim()}
                onPress={handleSaveManualRecipe}
              >
                <Text style={[styles.mfSaveBtnText, { color: colors.white }]}>✓ Tarifi Kaydet</Text>
              </TouchableOpacity>
              <View style={{ height: 40 }} />
            </ScrollView>
          ) : (
            /* ===== TARİF SEÇİCİ EKRANI ===== */
            <>
              {/* Manuel tarif oluşturma butonu */}
              <View style={styles.manualEntrySection}>
                <TouchableOpacity
                  style={[styles.manualEntryBtn, { backgroundColor: colors.sagePale, borderColor: colors.sage }]}
                  onPress={() => setManualFormVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.manualEntryBtnIcon, { color: colors.sage }]}>＋</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.manualEntryBtnTitle, { color: colors.sage }]}>Manuel Tarif Ekle</Text>
                    <Text style={[styles.manualEntryBtnDesc, { color: colors.textLight }]}>
                      Doktorun önerdiği tarifi malzeme ve adımlarıyla ekle
                    </Text>
                  </View>
                  <Text style={[styles.recipeItemArrow, { color: colors.sage }]}>→</Text>
                </TouchableOpacity>
              </View>

              {/* Tarif arama */}
              <View style={styles.recipeSearchSection}>
                <Text style={[styles.recipeSearchLabel, { color: colors.textLight }]}>Veya uygulama tariflerinden seçin:</Text>
                <View style={[styles.recipeSearchBar, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
                  <Text style={{ fontSize: 14 }}>🔍</Text>
                  <TextInput
                    style={[styles.recipeSearchInput, { color: colors.textDark }]}
                    placeholder="Tarif adı veya malzeme yazın..."
                    placeholderTextColor={colors.textLight}
                    value={recipeSearch}
                    onChangeText={setRecipeSearch}
                  />
                  {recipeSearch.length > 0 && (
                    <TouchableOpacity onPress={() => setRecipeSearch('')}>
                      <Text style={{ fontSize: 16, color: colors.textLight }}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Tarif listesi */}
              <ScrollView contentContainerStyle={styles.recipeList} keyboardShouldPersistTaps="handled">
                {filteredRecipes.length === 0 && recipeSearch.trim().length > 0 && (
                  <Text style={[styles.recipeEmptyText, { color: colors.textLight }]}>Eşleşen tarif bulunamadı</Text>
                )}
                {filteredRecipes.length === 0 && recipeSearch.trim().length === 0 && (
                  <Text style={[styles.recipeEmptyText, { color: colors.textLight }]}>Tarif aramak için yukarıya yazın</Text>
                )}
                {filteredRecipes.map((recipe) => {
                  const isSaved = savedRecipeIds.has(recipe.id);
                  return (
                    <TouchableOpacity
                      key={recipe.id}
                      style={[styles.recipeItem, { backgroundColor: colors.white }]}
                      onPress={() => handlePickRecipe(recipe)}
                    >
                      <Text style={styles.recipeItemEmoji}>{recipe.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.recipeItemTitle, { color: colors.textDark }]}>{recipe.title}</Text>
                        <Text style={[styles.recipeItemSub, { color: colors.textLight }]}>
                          {recipe.ageGroup} · {recipe.prepTime} dk · {recipe.calories} kcal
                          {isSaved ? ' · 📖 Defterimde' : ''}
                        </Text>
                        {recipe.ingredients.length > 0 && (
                          <Text style={[styles.recipeItemIngredients, { color: colors.textLight }]} numberOfLines={1}>
                            {recipe.ingredients.slice(0, 4).map((i) => i.name).join(', ')}
                            {recipe.ingredients.length > 4 ? ` +${recipe.ingredients.length - 4}` : ''}
                          </Text>
                        )}
                      </View>
                      <Text style={[styles.recipeItemArrow, { color: colors.sage }]}>→</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          )}
        </SafeAreaView>

        {/* Malzeme Seçici iç Modal */}
        <Modal
          visible={showIngredientPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => { setShowIngredientPicker(false); setSelectedFood(null); setShowCustomIngredient(false); }}
        >
          <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
            <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
              <TouchableOpacity onPress={() => { setShowIngredientPicker(false); setSelectedFood(null); setShowCustomIngredient(false); }}>
                <Text style={[styles.headerBack, { color: colors.textLight }]}>✕</Text>
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.textDark }]}>Malzeme Seç</Text>
              <View style={{ width: 28 }} />
            </View>

            {(selectedFood || showCustomIngredient) ? (
              <View style={styles.ingAmountSection}>
                <View style={[styles.ingSelectedRow, { backgroundColor: colors.white }]}>
                  <Text style={{ fontSize: 28 }}>{selectedFood?.emoji || customIngEmoji}</Text>
                  {showCustomIngredient ? (
                    <TextInput
                      style={[styles.ingCustomNameInput, { color: colors.textDark, borderBottomColor: colors.creamDark }]}
                      placeholder="Malzeme adı"
                      placeholderTextColor={colors.textLight}
                      value={customIngName}
                      onChangeText={setCustomIngName}
                      autoFocus
                    />
                  ) : (
                    <Text style={[styles.ingSelectedName, { color: colors.textDark }]}>{selectedFood?.name}</Text>
                  )}
                </View>

                {showCustomIngredient && (
                  <View style={styles.mfGroup}>
                    <Text style={[styles.ingSubLabel, { color: colors.textMid }]}>Emoji (opsiyonel)</Text>
                    <View style={styles.ingEmojiRow}>
                      {['🥄', '🧀', '🥩', '🫘', '🥬', '🍶', '🧂', '📦'].map((e) => (
                        <TouchableOpacity
                          key={e}
                          style={[
                            styles.ingEmojiOption,
                            { backgroundColor: colors.white, borderColor: colors.creamDark },
                            customIngEmoji === e && { borderColor: colors.sage, backgroundColor: colors.sagePale },
                          ]}
                          onPress={() => setCustomIngEmoji(e)}
                        >
                          <Text style={{ fontSize: 20 }}>{e}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <View style={styles.mfGroup}>
                  <Text style={[styles.ingSubLabel, { color: colors.textMid }]}>Miktar</Text>
                  <TextInput
                    style={[styles.mfInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark, width: 100 }]}
                    value={selectedAmount}
                    onChangeText={setSelectedAmount}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor={colors.textLight}
                  />
                </View>

                <View style={styles.mfGroup}>
                  <Text style={[styles.ingSubLabel, { color: colors.textMid }]}>Birim</Text>
                  <View style={styles.ingUnitGrid}>
                    {UNIT_OPTIONS.map((u) => (
                      <TouchableOpacity
                        key={u}
                        style={[
                          styles.chip,
                          { backgroundColor: colors.white, borderColor: colors.creamDark },
                          selectedUnit === u && { backgroundColor: colors.sage, borderColor: colors.sage },
                        ]}
                        onPress={() => setSelectedUnit(u)}
                      >
                        <Text style={[
                          styles.chipText,
                          { color: colors.textMid },
                          selectedUnit === u && { color: colors.white },
                        ]}>{u}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={[styles.ingConfirmBtn, { backgroundColor: colors.sage }]} onPress={confirmIngredient}>
                  <Text style={[styles.mfSaveBtnText, { color: colors.white }]}>
                    ✓ {selectedFood?.name || customIngName || 'Malzeme'} Ekle
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={[styles.ingSearchBar, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
                  <Text style={{ fontSize: 14 }}>🔍</Text>
                  <TextInput
                    style={[styles.recipeSearchInput, { color: colors.textDark }]}
                    placeholder="Malzeme ara..."
                    placeholderTextColor={colors.textLight}
                    value={ingredientSearch}
                    onChangeText={setIngredientSearch}
                  />
                </View>

                <ScrollView contentContainerStyle={styles.ingFoodList} showsVerticalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[styles.ingCustomFoodBtn, { backgroundColor: colors.sagePale, borderColor: colors.sage }]}
                    onPress={() => { setShowCustomIngredient(true); setSelectedFood(null); }}
                  >
                    <Text style={[styles.manualEntryBtnIcon, { color: colors.sage }]}>＋</Text>
                    <View>
                      <Text style={[styles.ingCustomTitle, { color: colors.sage }]}>Diğer — Özel Malzeme</Text>
                      <Text style={[styles.ingCustomDesc, { color: colors.textLight }]}>Listede olmayan malzemeyi elle ekle</Text>
                    </View>
                  </TouchableOpacity>

                  {Object.entries(groupedFoods).map(([catKey, foods]) => {
                    const catLabel = CATEGORY_LABELS[catKey as PantryCategory];
                    if (!catLabel) return null;
                    return (
                      <View key={catKey}>
                        <Text style={[styles.ingCategoryTitle, { color: colors.textMid }]}>{catLabel.emoji} {catLabel.label}</Text>
                        {foods.map((food) => (
                          <TouchableOpacity
                            key={food.id}
                            style={[styles.ingFoodItem, { backgroundColor: colors.white }]}
                            onPress={() => handleFoodSelect(food)}
                          >
                            <Text style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{food.emoji}</Text>
                            <Text style={[styles.ingFoodName, { color: colors.textDark }]}>{food.name}</Text>
                            {food.allergens.length > 0 && <Text style={{ fontSize: 14 }}>⚠️</Text>}
                          </TouchableOpacity>
                        ))}
                      </View>
                    );
                  })}
                  <View style={{ height: 40 }} />
                </ScrollView>
              </>
            )}
          </SafeAreaView>
        </Modal>
      </Modal>
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
  headerBack: { fontSize: 20, width: 28, textAlign: 'center' },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },

  stepIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: Spacing.md, gap: 0,
  },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 30, height: 2 },

  stepContent: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 60 },
  stepTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.xxl, textAlign: 'center',
  },
  stepSubtitle: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md, textAlign: 'center',
  },

  // Disclaimer
  disclaimerIcon: { alignItems: 'center' },
  disclaimerBox: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    borderWidth: 1,
  },
  disclaimerText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 22,
  },
  acceptRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
  },
  acceptCheckbox: {
    width: 24, height: 24, borderRadius: 6, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center', marginTop: 2,
  },
  acceptCheck: { fontFamily: FontFamily.bold, fontSize: 14 },
  acceptText: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 20,
  },

  // Common buttons
  nextBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },

  // Allergen grid
  allergenGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, justifyContent: 'center' },
  allergenCard: {
    width: '29%', borderRadius: BorderRadius.lg,
    padding: Spacing.md, alignItems: 'center', gap: Spacing.xs,
    borderWidth: 2, ...Shadow.soft,
  },
  allergenEmoji: { fontSize: 28 },
  allergenLabel: {
    fontFamily: FontFamily.semiBold, fontSize: 11, textAlign: 'center',
  },

  // Custom allergen input
  customAllergenInput: { gap: Spacing.sm },
  customAllergenField: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderWidth: 1,
  },

  // Plan input
  formGroup: { gap: Spacing.sm },
  formLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  chipText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },

  // Preview
  previewDay: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg, gap: Spacing.sm, ...Shadow.soft,
  },
  previewDayTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  previewMeal: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  previewMealEmoji: { fontSize: 22 },
  previewMealName: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md },
  previewMealTouchable: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm, marginHorizontal: -Spacing.xs,
  },
  previewMealEdit: { fontFamily: FontFamily.bold, fontSize: 16 },
  doctorNoteBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1,
  },
  doctorNoteIcon: { fontSize: 20 },
  doctorNoteText: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.sm,
    lineHeight: 20,
  },
  doctorWarningBox: {
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    borderWidth: 1,
  },
  doctorWarningText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 20,
  },

  // Recipe picker
  manualEntrySection: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.sm,
  },
  recipeSearchSection: {
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.sm,
  },
  recipeSearchLabel: {
    fontFamily: FontFamily.bold, fontSize: FontSize.sm,
  },
  recipeSearchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg, borderWidth: 1,
  },
  recipeSearchInput: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md,
    paddingVertical: Spacing.md,
  },
  recipeList: { paddingHorizontal: Spacing.lg, gap: 4, paddingBottom: 40, paddingTop: Spacing.md },
  recipeEmptyText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm,
    textAlign: 'center', paddingVertical: Spacing.xl,
  },
  recipeItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
  },
  recipeItemEmoji: { fontSize: 28 },
  recipeItemTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  recipeItemSub: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  recipeItemArrow: { fontFamily: FontFamily.bold, fontSize: 16 },
  recipeItemIngredients: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 2,
  },

  // Preview meal details
  previewMealDetails: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 2,
  },

  // Manuel tarif formu
  manualFormContent: {
    padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 60,
  },
  manualEntryBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg, borderWidth: 2, borderStyle: 'dashed' as any,
  },
  manualEntryBtnIcon: {
    fontSize: 22, fontFamily: FontFamily.bold, width: 32, textAlign: 'center',
  },
  manualEntryBtnTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.md,
  },
  manualEntryBtnDesc: {
    fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 2,
  },
  mfGroup: { gap: Spacing.sm },
  mfLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  mfLabelRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  mfCount: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  mfInput: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderWidth: 1,
  },
  mfIngRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
  },
  mfIngName: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md },
  mfIngAmount: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  mfIngRemove: { fontFamily: FontFamily.bold, fontSize: 16, paddingLeft: Spacing.sm },
  mfAddBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderStyle: 'dashed' as any,
  },
  mfAddBtnText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  mfStepRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm,
  },
  mfStepNum: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', marginTop: 8,
  },
  mfStepNumText: { fontFamily: FontFamily.bold, fontSize: 12 },
  mfStepInput: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderWidth: 1, minHeight: 42,
  },
  mfStepRemove: { fontFamily: FontFamily.bold, fontSize: 16, paddingTop: 10 },
  mfAddStepBtn: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderStyle: 'dashed' as any,
  },
  mfSaveBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  mfSaveBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },

  // Malzeme seçici (iç modal)
  ingAmountSection: { padding: Spacing.xl, gap: Spacing.lg },
  ingSelectedRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg, ...Shadow.soft,
  },
  ingCustomNameInput: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.lg,
    borderBottomWidth: 1, paddingVertical: 4,
  },
  ingSelectedName: { flex: 1, fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  ingSubLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  ingEmojiRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  ingEmojiOption: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2,
  },
  ingUnitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ingConfirmBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.md,
  },
  ingSearchBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg, marginHorizontal: Spacing.lg, marginTop: Spacing.md,
    borderWidth: 1,
  },
  ingFoodList: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: 40, gap: 2 },
  ingCustomFoodBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md,
    borderWidth: 1, borderStyle: 'dashed' as any,
  },
  ingCustomTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md },
  ingCustomDesc: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  ingCategoryTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.sm,
    paddingVertical: Spacing.sm, paddingTop: Spacing.md,
  },
  ingFoodItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
  },
  ingFoodName: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md },

  // Symptoms
  stopWarningBox: {
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    gap: Spacing.sm, borderWidth: 1,
  },
  stopWarningTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  stopWarningText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.sm, lineHeight: 22,
  },
  stopWarningSymptomsTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.sm,
    marginTop: Spacing.md,
  },
  stopWarningFooter: {
    fontFamily: FontFamily.bold, fontSize: FontSize.sm,
    lineHeight: 20, marginTop: Spacing.sm,
  },
  symptomsList: { gap: Spacing.xs, marginTop: Spacing.xs },
  symptomRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: BorderRadius.md,
    paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md,
  },
  symptomEmoji: { fontSize: 16 },
  symptomLabelWarning: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },

  startBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg, alignItems: 'center',
  },
  startBtnText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
});
