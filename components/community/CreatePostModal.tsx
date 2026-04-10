/**
 * Kaşık — Gönderi Oluşturma Modal
 * Tip seçimi + içerik girişi + yapılandırılmış tarif formu
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
  KeyboardAvoidingView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { moderatePost } from '../../lib/contentModeration';
import { useColors } from '../../hooks/useColors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../constants/theme';
import { FOODS, FoodItem, CATEGORY_LABELS } from '../../constants/foods';
import { RecipeIngredient } from '../../constants/recipes';
import { AgeStage, PantryCategory } from '../../types';

// ===== TİPLER =====

export type PostCategory = 'recipe' | 'question' | 'experience' | 'tip';

interface PostCategoryOption {
  key: PostCategory;
  emoji: string;
  label: string;
  description: string;
}

const POST_CATEGORIES: PostCategoryOption[] = [
  { key: 'recipe', emoji: '🍽', label: 'Tarif', description: 'Tarif paylaş (malzeme & adımlarla)' },
  { key: 'question', emoji: '❓', label: 'Soru', description: 'Topluluktan yardım iste' },
  { key: 'experience', emoji: '⭐', label: 'Deneyim', description: 'Bebeğinizle deneyiminizi paylaşın' },
  { key: 'tip', emoji: '💡', label: 'İpucu', description: 'Faydalı bir bilgi paylaşın' },
];

const UNIT_OPTIONS = [
  'kaşık', 'bardak', 'adet', 'gram', 'ml',
  'küçük', 'orta', 'büyük', 'demet', 'dilim', 'tutam',
];

const AGE_OPTIONS: { key: AgeStage; label: string }[] = [
  { key: '6m', label: '6+ ay' },
  { key: '8m', label: '8+ ay' },
  { key: '12m+', label: '12+ ay' },
];

const DIFFICULTY_OPTIONS = [
  { key: 'easy' as const, label: 'Kolay', emoji: '🟢' },
  { key: 'medium' as const, label: 'Orta', emoji: '🟡' },
  { key: 'hard' as const, label: 'Zor', emoji: '🔴' },
];

// ===== PROPS =====

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => void;
}

export interface CreatePostData {
  category: PostCategory;
  content: string;
  photos: string[];
  recipe?: {
    title: string;
    servings: number;
    ageGroup: AgeStage;
    difficulty: 'easy' | 'medium' | 'hard';
    prepTime: number;
    ingredients: RecipeIngredient[];
    steps: string[];
  };
}

// ===== BİLEŞEN =====

export function CreatePostModal({ visible, onClose, onSubmit }: CreatePostModalProps) {
  const colors = useColors();
  const [step, setStep] = useState<'type' | 'content' | 'recipe'>('type');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [servings, setServings] = useState(1);
  const [ageGroup, setAgeGroup] = useState<AgeStage>('6m');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [prepTime, setPrepTime] = useState('15');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [showIngredientPicker, setShowIngredientPicker] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [showCustomIngredient, setShowCustomIngredient] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🥄');
  const [selectedAmount, setSelectedAmount] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState('adet');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = useMemo(() => {
    if (!ingredientSearch.trim()) return FOODS;
    const q = ingredientSearch.toLowerCase();
    return FOODS.filter((f) =>
      f.name.toLowerCase().includes(q) || f.emoji.includes(q)
    );
  }, [ingredientSearch]);

  const groupedFoods = useMemo(() => {
    const groups: Record<string, FoodItem[]> = {};
    for (const food of filteredFoods) {
      if (!groups[food.category]) groups[food.category] = [];
      groups[food.category].push(food);
    }
    return groups;
  }, [filteredFoods]);

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 4 - photos.length,
    });
    if (!result.canceled && result.assets) {
      const newUris = result.assets.map((a) => a.uri).slice(0, 4 - photos.length);
      setPhotos((prev) => [...prev, ...newUris].slice(0, 4));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setStep('type');
    setSelectedCategory(null);
    setContent('');
    setPhotos([]);
    setRecipeTitle('');
    setServings(1);
    setAgeGroup('6m');
    setDifficulty('easy');
    setPrepTime('15');
    setIngredients([]);
    setSteps(['']);
    setShowIngredientPicker(false);
    setShowCustomIngredient(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCategorySelect = (cat: PostCategory) => {
    setSelectedCategory(cat);
    setStep('content');
  };

  const handleContentNext = () => {
    if (selectedCategory === 'recipe') {
      setStep('recipe');
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory || !content.trim()) return;

    // İçerik moderasyonu — sakıncalı içerik kontrolü
    const moderationResult = moderatePost(
      content.trim(),
      selectedCategory === 'recipe' ? recipeTitle.trim() : undefined,
      selectedCategory === 'recipe' ? steps.filter((s) => s.trim()) : undefined,
    );
    if (moderationResult) {
      Alert.alert('İçerik Uyarısı', moderationResult);
      return;
    }

    const data: CreatePostData = {
      category: selectedCategory,
      content: content.trim(),
      photos,
    };

    if (selectedCategory === 'recipe' && recipeTitle.trim()) {
      data.recipe = {
        title: recipeTitle.trim(),
        servings,
        ageGroup,
        difficulty,
        prepTime: parseInt(prepTime) || 15,
        ingredients,
        steps: steps.filter((s) => s.trim()),
      };
    }

    onSubmit(data);
    handleClose();
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    setSelectedAmount('1');
    setSelectedUnit('adet');
    setShowCustomIngredient(false);
  };

  const confirmIngredient = () => {
    if (selectedFood) {
      const ing: RecipeIngredient = {
        name: selectedFood.name,
        emoji: selectedFood.emoji,
        amount: parseFloat(selectedAmount) || 1,
        unit: selectedUnit,
        isAllergen: selectedFood.allergens.length > 0,
      };
      setIngredients((prev) => [...prev, ing]);
    } else if (showCustomIngredient && customName.trim()) {
      const ing: RecipeIngredient = {
        name: customName.trim(),
        emoji: customEmoji || '🥄',
        amount: parseFloat(selectedAmount) || 1,
        unit: selectedUnit,
      };
      setIngredients((prev) => [...prev, ing]);
    }
    setSelectedFood(null);
    setShowCustomIngredient(false);
    setCustomName('');
    setCustomEmoji('🥄');
    setSelectedAmount('1');
    setSelectedUnit('adet');
    setShowIngredientPicker(false);
    setIngredientSearch('');
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addStep = () => { setSteps((prev) => [...prev, '']); };
  const updateStep = (index: number, text: string) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? text : s)));
  };
  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== RENDER ADIM 1: TİP SEÇİMİ =====
  const renderTypeStep = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepTitle, { color: colors.textDark }]}>Ne paylaşmak istiyorsunuz?</Text>
      <View style={styles.categoryGrid}>
        {POST_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryCard, { backgroundColor: colors.white }]}
            onPress={() => handleCategorySelect(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: colors.textDark }]}>{cat.label}</Text>
            <Text style={[styles.categoryDesc, { color: colors.textLight }]}>{cat.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ===== RENDER ADIM 2: İÇERİK GİRİŞİ =====
  const renderContentStep = () => {
    const catInfo = POST_CATEGORIES.find((c) => c.key === selectedCategory);
    const placeholder =
      selectedCategory === 'recipe' ? 'Tarif hakkında kısa bir açıklama yazın...'
      : selectedCategory === 'question' ? 'Sorunuzu detaylı yazın...'
      : selectedCategory === 'experience' ? 'Deneyiminizi anlatın...'
      : 'İpucunuzu paylaşın...';

    return (
      <View style={styles.stepContent}>
        <View style={[styles.contentTypeTag, { backgroundColor: colors.sagePale }]}>
          <Text style={styles.contentTypeEmoji}>{catInfo?.emoji}</Text>
          <Text style={[styles.contentTypeLabel, { color: colors.sage }]}>{catInfo?.label}</Text>
        </View>

        <TextInput
          style={[styles.contentInput, { color: colors.textDark, backgroundColor: colors.white }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          multiline
          value={content}
          onChangeText={setContent}
          autoFocus
        />

        <View style={styles.photoSection}>
          {photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoPreviewRow}>
              {photos.map((uri, idx) => (
                <View key={idx} style={styles.photoPreviewItem}>
                  <Image source={{ uri }} style={styles.photoPreviewImage} />
                  <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => removePhoto(idx)}>
                    <Text style={[styles.photoRemoveText, { color: colors.white }]}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
          {photos.length < 4 && (
            <TouchableOpacity style={[styles.addPhotoBtn, { backgroundColor: colors.white, borderColor: colors.creamDark }]} onPress={pickPhotos}>
              <Text style={styles.addPhotoIcon}>📷</Text>
              <Text style={[styles.addPhotoText, { color: colors.textLight }]}>
                Fotoğraf Ekle {photos.length > 0 ? `(${photos.length}/4)` : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.sage }, !content.trim() && styles.nextButtonDisabled]}
          onPress={handleContentNext}
          disabled={!content.trim()}
        >
          <Text style={[styles.nextButtonText, { color: colors.white }]}>
            {selectedCategory === 'recipe' ? 'Devam — Tarif Bilgileri →' : 'Paylaş'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ===== RENDER ADIM 3: TARİF FORMU =====
  const renderRecipeStep = () => (
    <ScrollView contentContainerStyle={styles.recipeForm} showsVerticalScrollIndicator={false}>
      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>🍽 Tarif Adı</Text>
        <TextInput
          style={[styles.formInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
          placeholder="Ör: Havuçlu Patates Püresi"
          placeholderTextColor={colors.textLight}
          value={recipeTitle}
          onChangeText={setRecipeTitle}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>🍽 Porsiyon Sayısı</Text>
        <View style={styles.chipRow}>
          {[1, 2, 3, 4].map((n) => (
            <TouchableOpacity
              key={n}
              style={[styles.chip, { backgroundColor: colors.white, borderColor: colors.creamDark }, servings === n && { backgroundColor: colors.sage, borderColor: colors.sage }]}
              onPress={() => setServings(n)}
            >
              <Text style={[styles.chipText, { color: colors.textMid }, servings === n && { color: colors.white }]}>{n}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>👶 Yaş Grubu</Text>
        <View style={styles.chipRow}>
          {AGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.chip, { backgroundColor: colors.white, borderColor: colors.creamDark }, ageGroup === opt.key && { backgroundColor: colors.sage, borderColor: colors.sage }]}
              onPress={() => setAgeGroup(opt.key)}
            >
              <Text style={[styles.chipText, { color: colors.textMid }, ageGroup === opt.key && { color: colors.white }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>📊 Zorluk</Text>
        <View style={styles.chipRow}>
          {DIFFICULTY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.chip, { backgroundColor: colors.white, borderColor: colors.creamDark }, difficulty === opt.key && { backgroundColor: colors.sage, borderColor: colors.sage }]}
              onPress={() => setDifficulty(opt.key)}
            >
              <Text style={[styles.chipText, { color: colors.textMid }, difficulty === opt.key && { color: colors.white }]}>{opt.emoji} {opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>⏱ Hazırlık Süresi (dk)</Text>
        <TextInput
          style={[styles.formInput, { width: 100, color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
          placeholder="15"
          placeholderTextColor={colors.textLight}
          value={prepTime}
          onChangeText={setPrepTime}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <View style={styles.formLabelRow}>
          <Text style={[styles.formLabel, { color: colors.textDark }]}>🥕 Malzemeler</Text>
          <Text style={[styles.formCount, { color: colors.textLight }]}>{ingredients.length} malzeme</Text>
        </View>

        {ingredients.map((ing, idx) => (
          <View key={idx} style={[styles.ingredientRow, { backgroundColor: colors.white }]}>
            <Text style={styles.ingredientEmoji}>{ing.emoji}</Text>
            <Text style={[styles.ingredientName, { color: colors.textDark }]}>{ing.name}</Text>
            <Text style={[styles.ingredientAmount, { color: colors.textLight }]}>{ing.amount} {ing.unit}</Text>
            <TouchableOpacity onPress={() => removeIngredient(idx)}>
              <Text style={[styles.ingredientRemove, { color: colors.heart }]}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.addIngredientBtn, { borderColor: colors.sage }]}
          onPress={() => setShowIngredientPicker(true)}
        >
          <Text style={[styles.addIngredientText, { color: colors.sage }]}>+ Malzeme Ekle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textDark }]}>📝 Yapılışı</Text>
        {steps.map((stepText, idx) => (
          <View key={idx} style={styles.stepRow}>
            <View style={[styles.stepNumber, { backgroundColor: colors.sage }]}>
              <Text style={[styles.stepNumberText, { color: colors.white }]}>{idx + 1}</Text>
            </View>
            <TextInput
              style={[styles.stepInput, { color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
              placeholder={`Adım ${idx + 1}...`}
              placeholderTextColor={colors.textLight}
              value={stepText}
              onChangeText={(t) => updateStep(idx, t)}
              multiline
            />
            {steps.length > 1 && (
              <TouchableOpacity onPress={() => removeStep(idx)}>
                <Text style={[styles.stepRemoveBtn, { color: colors.heart }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
        <TouchableOpacity style={[styles.addStepBtn, { borderColor: colors.sage }]} onPress={addStep}>
          <Text style={[styles.addStepText, { color: colors.sage }]}>+ Adım Ekle</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: colors.sage },
          (!recipeTitle.trim() || ingredients.length === 0) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!recipeTitle.trim() || ingredients.length === 0}
      >
        <Text style={[styles.submitButtonText, { color: colors.white }]}>🍽 Tarifi Paylaş</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  // ===== MALZEME SEÇİCİ MODAL =====
  const renderIngredientPicker = () => (
    <Modal
      visible={showIngredientPicker}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowIngredientPicker(false)}
    >
      <SafeAreaView style={[styles.pickerContainer, { backgroundColor: colors.cream }]}>
        <View style={[styles.pickerHeader, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
          <TouchableOpacity onPress={() => { setShowIngredientPicker(false); setSelectedFood(null); setShowCustomIngredient(false); }}>
            <Text style={[styles.pickerClose, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.pickerTitle, { color: colors.textDark }]}>Malzeme Seç</Text>
          <View style={{ width: 28 }} />
        </View>

        {(selectedFood || showCustomIngredient) ? (
          <View style={styles.amountSection}>
            <View style={[styles.selectedFoodRow, { borderBottomColor: colors.creamDark }]}>
              <Text style={{ fontSize: 28 }}>{selectedFood?.emoji || customEmoji}</Text>
              {showCustomIngredient ? (
                <TextInput
                  style={[styles.customNameInput, { color: colors.textDark, borderBottomColor: colors.sage }]}
                  placeholder="Malzeme adı"
                  placeholderTextColor={colors.textLight}
                  value={customName}
                  onChangeText={setCustomName}
                  autoFocus
                />
              ) : (
                <Text style={[styles.selectedFoodName, { color: colors.textDark }]}>{selectedFood?.name}</Text>
              )}
            </View>

            {showCustomIngredient && (
              <View style={styles.formGroup}>
                <Text style={[styles.formLabelSmall, { color: colors.textLight }]}>Emoji (opsiyonel)</Text>
                <View style={styles.emojiRow}>
                  {['🥄', '🧀', '🥩', '🫘', '🥬', '🍶', '🧂', '📦'].map((e) => (
                    <TouchableOpacity
                      key={e}
                      style={[styles.emojiOption, { backgroundColor: colors.white, borderColor: colors.creamDark }, customEmoji === e && { borderColor: colors.sage, backgroundColor: colors.sagePale }]}
                      onPress={() => setCustomEmoji(e)}
                    >
                      <Text style={{ fontSize: 20 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={[styles.formLabelSmall, { color: colors.textLight }]}>Miktar</Text>
              <TextInput
                style={[styles.formInput, { width: 100, color: colors.textDark, backgroundColor: colors.white, borderColor: colors.creamDark }]}
                value={selectedAmount}
                onChangeText={setSelectedAmount}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.formLabelSmall, { color: colors.textLight }]}>Birim</Text>
              <View style={styles.unitGrid}>
                {UNIT_OPTIONS.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitChip, { backgroundColor: colors.white, borderColor: colors.creamDark }, selectedUnit === u && { backgroundColor: colors.sage, borderColor: colors.sage }]}
                    onPress={() => setSelectedUnit(u)}
                  >
                    <Text style={[styles.unitChipText, { color: colors.textMid }, selectedUnit === u && { color: colors.white, fontFamily: FontFamily.semiBold }]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={[styles.confirmIngredientBtn, { backgroundColor: colors.sage }]} onPress={confirmIngredient}>
              <Text style={[styles.confirmIngredientText, { color: colors.white }]}>
                ✓ {selectedFood?.name || customName || 'Malzeme'} Ekle
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={[styles.searchBar, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={[styles.searchInput, { color: colors.textDark }]}
                placeholder="Malzeme ara..."
                placeholderTextColor={colors.textLight}
                value={ingredientSearch}
                onChangeText={setIngredientSearch}
              />
            </View>

            <ScrollView contentContainerStyle={styles.foodList} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.customFoodBtn, { backgroundColor: colors.sagePale, borderColor: colors.sage }]}
                onPress={() => { setShowCustomIngredient(true); setSelectedFood(null); }}
              >
                <Text style={[styles.customFoodIcon, { color: colors.sage }]}>＋</Text>
                <View>
                  <Text style={[styles.customFoodTitle, { color: colors.sage }]}>Diğer — Özel Malzeme</Text>
                  <Text style={[styles.customFoodDesc, { color: colors.textLight }]}>Listede olmayan malzemeyi elle ekle</Text>
                </View>
              </TouchableOpacity>

              {Object.entries(groupedFoods).map(([catKey, foods]) => {
                const catLabel = CATEGORY_LABELS[catKey as PantryCategory];
                if (!catLabel) return null;
                return (
                  <View key={catKey}>
                    <Text style={[styles.foodCategoryTitle, { color: colors.textLight }]}>
                      {catLabel.emoji} {catLabel.label}
                    </Text>
                    {foods.map((food) => (
                      <TouchableOpacity
                        key={food.id}
                        style={[styles.foodItem, { backgroundColor: colors.white }]}
                        onPress={() => handleFoodSelect(food)}
                      >
                        <Text style={styles.foodEmoji}>{food.emoji}</Text>
                        <Text style={[styles.foodName, { color: colors.textDark }]}>{food.name}</Text>
                        {food.allergens.length > 0 && <Text style={styles.foodAllergen}>⚠️</Text>}
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
  );

  // ===== ANA RENDER =====
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.header, { backgroundColor: colors.white, borderBottomColor: colors.creamDark }]}>
            <TouchableOpacity onPress={step === 'type' ? handleClose : () => setStep(step === 'recipe' ? 'content' : 'type')}>
              <Text style={[styles.headerBack, { color: colors.textLight }]}>{step === 'type' ? '✕' : '←'}</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textDark }]}>
              {step === 'type' ? 'Yeni Gönderi' : step === 'content' ? POST_CATEGORIES.find((c) => c.key === selectedCategory)?.label || '' : '🍽 Tarif Bilgileri'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, { backgroundColor: colors.creamDark }, step === 'type' && { backgroundColor: colors.sage, width: 12, height: 12, borderRadius: 6 }]} />
            <View style={[styles.stepLine, { backgroundColor: colors.creamDark }, (step === 'content' || step === 'recipe') && { backgroundColor: colors.sage }]} />
            <View style={[styles.stepDot, { backgroundColor: colors.creamDark }, step === 'content' && { backgroundColor: colors.sage, width: 12, height: 12, borderRadius: 6 }]} />
            {selectedCategory === 'recipe' && (
              <>
                <View style={[styles.stepLine, { backgroundColor: colors.creamDark }, step === 'recipe' && { backgroundColor: colors.sage }]} />
                <View style={[styles.stepDot, { backgroundColor: colors.creamDark }, step === 'recipe' && { backgroundColor: colors.sage, width: 12, height: 12, borderRadius: 6 }]} />
              </>
            )}
          </View>

          {step === 'type' && renderTypeStep()}
          {step === 'content' && renderContentStep()}
          {step === 'recipe' && renderRecipeStep()}
        </KeyboardAvoidingView>
      </SafeAreaView>

      {renderIngredientPicker()}
    </Modal>
  );
}

// ===== STİLLER =====

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, borderBottomWidth: 1,
  },
  headerBack: { fontSize: 20, width: 28, textAlign: 'center' },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },

  stepIndicator: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md, gap: 0,
  },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 40, height: 2 },

  stepContent: { flex: 1, padding: Spacing.xl, gap: Spacing.xl },
  stepTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, textAlign: 'center' },

  categoryGrid: { gap: Spacing.md },
  categoryCard: {
    borderRadius: BorderRadius.xl, padding: Spacing.xl,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, ...Shadow.soft,
  },
  categoryEmoji: { fontSize: 32 },
  categoryLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.lg, flex: 0 },
  categoryDesc: { fontFamily: FontFamily.medium, fontSize: FontSize.sm, flex: 1 },

  contentTypeTag: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round, gap: Spacing.xs,
  },
  contentTypeEmoji: { fontSize: 16 },
  contentTypeLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  contentInput: {
    fontFamily: FontFamily.medium, fontSize: FontSize.lg, lineHeight: 26, minHeight: 150,
    textAlignVertical: 'top', padding: Spacing.lg, borderRadius: BorderRadius.xl, ...Shadow.soft,
  },
  photoSection: { gap: Spacing.sm },
  photoPreviewRow: { flexDirection: 'row' },
  photoPreviewItem: { width: 80, height: 80, borderRadius: BorderRadius.lg, marginRight: Spacing.sm, overflow: 'hidden' },
  photoPreviewImage: { width: 80, height: 80 },
  photoRemoveBtn: {
    position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center',
  },
  photoRemoveText: { fontSize: 12, fontFamily: FontFamily.bold },
  addPhotoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
    borderWidth: 1, borderStyle: 'dashed',
  },
  addPhotoIcon: { fontSize: 18 },
  addPhotoText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },

  nextButton: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center' },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },

  recipeForm: { padding: Spacing.xl, gap: Spacing.xl },
  formGroup: { gap: Spacing.sm },
  formLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  formLabelSmall: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  formLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  formCount: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  formInput: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderWidth: 1,
  },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round, borderWidth: 1 },
  chipText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },

  ingredientRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, gap: Spacing.sm, ...Shadow.soft,
  },
  ingredientEmoji: { fontSize: 18, width: 28, textAlign: 'center' },
  ingredientName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md, flex: 1 },
  ingredientAmount: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  ingredientRemove: { fontFamily: FontFamily.bold, fontSize: 14, padding: 4 },
  addIngredientBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: BorderRadius.lg, paddingVertical: Spacing.lg, alignItems: 'center' },
  addIngredientText: { fontFamily: FontFamily.bold, fontSize: FontSize.md },

  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  stepNumber: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  stepNumberText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
  stepInput: {
    flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md,
    borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderWidth: 1, minHeight: 44,
  },
  stepRemoveBtn: { fontFamily: FontFamily.bold, fontSize: 14, padding: 8, marginTop: 4 },
  addStepBtn: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, alignItems: 'center' },
  addStepText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },

  submitButton: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },

  pickerContainer: { flex: 1 },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, borderBottomWidth: 1,
  },
  pickerClose: { fontSize: 20, width: 28, textAlign: 'center' },
  pickerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', margin: Spacing.xl,
    borderRadius: BorderRadius.xl, paddingHorizontal: Spacing.lg, gap: Spacing.sm, borderWidth: 1,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontFamily: FontFamily.medium, fontSize: FontSize.md, paddingVertical: Spacing.md },
  foodList: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, paddingBottom: 40 },
  customFoodBtn: {
    flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg, padding: Spacing.lg,
    gap: Spacing.md, marginBottom: Spacing.md, borderWidth: 1.5, borderStyle: 'dashed',
  },
  customFoodIcon: { fontFamily: FontFamily.bold, fontSize: 22, width: 32, textAlign: 'center' },
  customFoodTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.md },
  customFoodDesc: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  foodCategoryTitle: {
    fontFamily: FontFamily.bold, fontSize: FontSize.sm,
    marginTop: Spacing.lg, marginBottom: Spacing.xs, letterSpacing: 0.5,
  },
  foodItem: {
    flexDirection: 'row', alignItems: 'center', borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, gap: Spacing.md, marginBottom: 4,
  },
  foodEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  foodName: { fontFamily: FontFamily.medium, fontSize: FontSize.md, flex: 1 },
  foodAllergen: { fontSize: 14 },

  amountSection: { padding: Spacing.xl, gap: Spacing.xl },
  selectedFoodRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1,
  },
  selectedFoodName: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  customNameInput: { flex: 1, fontFamily: FontFamily.bold, fontSize: FontSize.xl, borderBottomWidth: 1, paddingVertical: Spacing.xs },
  emojiRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  emojiOption: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  unitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  unitChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.round, borderWidth: 1 },
  unitChipText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  confirmIngredientBtn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center', marginTop: Spacing.md },
  confirmIngredientText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
});
