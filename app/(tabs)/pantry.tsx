/**
 * Kasik — Pantry Management Screen (Dolabim Tab)
 * Zustand pantryStore ile yonetilir.
 * Liste layout + swipe-to-delete + duzenleme modali
 * + First-use onboarding overlay + Expiring items section
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  Modal,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { ThemeColors } from '../../constants/colors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
  Typography,
} from '../../constants/theme';
import { CATEGORY_LABELS, FOODS, FoodItem } from '../../constants/foods';
import { AdBanner } from '../../components/ui/AdBanner';
import { AIRecipeModal } from '../../components/recipe/AIRecipeModal';
import { PantryItem, PantryCategory } from '../../types';
import { usePantryStore, PantryEntry } from '../../stores/pantryStore';
import { getDefaultFreshnessDays, isDryGood } from '../../constants/freshness';
import { SwipeableRow } from '../../components/ui/SwipeableRow';
import ScreenHeader from '../../components/ui/ScreenHeader';
import { haptics } from '../../lib/haptics';
import { analytics } from '../../lib/analytics';
import { EmptyState } from '../../components/ui/EmptyState';

// ===== BIRIM SECENEKLERI =====
const UNIT_OPTIONS = ['adet', 'gram', 'ml', 'bardak', 'kasik', 'dilim', 'demet', 'porsiyon'];

const ONBOARDING_KEY = '@kasik_pantry_onboarding_done';

// ===== HAZIR DOLAP DEFAULT ITEMS =====
// ~18 common baby food pantry items covering all categories
const DEFAULT_PANTRY_FOOD_IDS = [
  // Sebzeler (5)
  'havuc', 'patates', 'kabak', 'brokoli', 'tatli_patates',
  // Meyveler (4)
  'muz', 'elma', 'armut', 'avokado',
  // Protein (4)
  'tavuk', 'yumurta_sarisi', 'mercimek', 'somon',
  // Tahillar (3)
  'pirinc', 'yulaf', 'bulgur',
  // Sut Urunleri (2)
  'yogurt', 'tereyagi',
];

function getDefaultAmountAndUnit(food: FoodItem): { amount: number; unit: string } {
  switch (food.category) {
    case 'tahil':
      return { amount: 500, unit: 'gram' };
    case 'sut_urunleri':
      if (food.id === 'tereyagi') return { amount: 200, unit: 'gram' };
      return { amount: 2, unit: 'bardak' };
    case 'protein':
      if (food.id === 'mercimek') return { amount: 500, unit: 'gram' };
      if (food.id === 'yumurta_sarisi') return { amount: 6, unit: 'adet' };
      return { amount: 2, unit: 'adet' };
    case 'meyve':
      return { amount: 3, unit: 'adet' };
    case 'sebze':
      return { amount: 3, unit: 'adet' };
    default:
      return { amount: 1, unit: 'adet' };
  }
}

// GestureHandlerRootView wrapper (native only)
function GestureWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
  const { GestureHandlerRootView } = require('react-native-gesture-handler');
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {children}
    </GestureHandlerRootView>
  );
}

export default function PantryScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const items = usePantryStore((s) => s.items);
  const isLoaded = usePantryStore((s) => s.isLoaded);
  const addItem = usePantryStore((s) => s.addItem);
  const removeItem = usePantryStore((s) => s.removeItem);
  const updateItem = usePantryStore((s) => s.updateItem);
  const getItemsByCategory = usePantryStore((s) => s.getItemsByCategory);
  const getExpiringItems = usePantryStore((s) => s.getExpiringItems);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loadPantry = usePantryStore((s) => s.loadFromStorage);

  // Onboarding overlay state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (!done && isLoaded && items.length === 0) {
          setShowOnboarding(true);
        }
      } catch (e) {
        console.warn('Onboarding check failed:', e);
      } finally {
        setOnboardingChecked(true);
      }
    };
    if (isLoaded) {
      checkOnboarding();
    }
  }, [isLoaded, items.length]);

  const dismissOnboarding = useCallback(async () => {
    setShowOnboarding(false);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.warn('Failed to save onboarding state:', e);
    }
  }, []);

  const handleReadyPantry = useCallback(async () => {
    // Add default items from FOODS constant
    for (const foodId of DEFAULT_PANTRY_FOOD_IDS) {
      const food = FOODS.find((f) => f.id === foodId);
      if (!food) continue;
      const { amount, unit } = getDefaultAmountAndUnit(food);
      const freshDays = getDefaultFreshnessDays(food.name);
      addItem({
        name: food.name,
        emoji: food.emoji,
        category: food.category,
        amount,
        unit,
        daysLeft: freshDays === 0 ? 7 : freshDays,
      });
    }
    haptics.selection();
    await dismissOnboarding();
  }, [addItem, dismissOnboarding]);

  const handleFillManually = useCallback(async () => {
    await dismissOnboarding();
    router.replace('/(tabs)/plan');
  }, [dismissOnboarding]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadPantry();
    } finally {
      setRefreshing(false);
    }
  };

  // Kategorilere gore grupla
  const groupedItems = useMemo(() => getItemsByCategory(), [items]);

  // Convert pantry items to PantryItem[] for the AI modal
  const pantryItemsForAI: PantryItem[] = useMemo(() => {
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      emoji: item.emoji,
      category: item.category,
      addedDate: item.addedDate,
    }));
  }, [items]);

  // Arama filtresi
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedItems;
    const q = searchQuery.toLowerCase().trim();
    const filtered: Record<string, PantryEntry[]> = {};
    for (const [cat, catItems] of Object.entries(groupedItems)) {
      const matching = catItems.filter((i) =>
        i.name.toLowerCase().includes(q)
      );
      if (matching.length > 0) filtered[cat] = matching;
    }
    return filtered;
  }, [groupedItems, searchQuery]);

  const totalItems = items.length;
  const expiringItems = useMemo(() => getExpiringItems(3), [items]);
  const expiringCount = expiringItems.length;

  const getFreshnessColor = (daysLeft?: number) => {
    if (daysLeft === undefined || daysLeft === -1) return colors.sage;
    if (daysLeft <= 2) return colors.heart;
    if (daysLeft <= 5) return colors.warning;
    return colors.sage;
  };

  const getFreshnessLabel = (daysLeft?: number) => {
    if (daysLeft === undefined) return '';
    if (daysLeft === -1) return 'Kuru Gida';
    if (daysLeft <= 0) return 'Suresi Doldu!';
    if (daysLeft === 1) return 'Son 1 gun';
    return `${daysLeft} gun`;
  };

  const categoryOrder: PantryCategory[] = [
    'sebze', 'meyve', 'protein', 'tahil', 'sut_urunleri', 'baharat', 'diger',
  ];

  return (
    <GestureWrapper>
      <View style={styles.container}>
        <ScreenHeader
          title="Dolabim"
          emoji="🗄️"
          rightActions={[
            { icon: '➕', onPress: () => setShowAddModal(true) },
          ]}
        />

        {/* Stats bar */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalItems}</Text>
            <Text style={styles.statLabel}>Malzeme</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                expiringCount > 0 && { color: colors.heart },
              ]}
            >
              {expiringCount}
            </Text>
            <Text style={styles.statLabel}>Taze Tuketin</Text>
          </View>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setShowAIModal(true)}
          >
            <Text style={[styles.statNumber, { color: colors.sage }]}>🤖</Text>
            <Text
              style={[
                styles.statLabel,
                { color: colors.sage, fontFamily: FontFamily.semiBold },
              ]}
            >
              AI Tarif
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Malzeme ara..."
              placeholderTextColor={colors.border}
              accessibilityLabel="Malzeme ara"
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.sage}
              colors={[colors.sage]}
            />
          }
        >
          {/* ===== EXPIRING ITEMS SECTION ===== */}
          {expiringItems.length > 0 && (
            <View style={styles.expiringSection}>
              <View style={styles.expiringSectionHeader}>
                <Text style={styles.expiringSectionTitle}>⚠️ Bayatlayacak Urunler</Text>
              </View>
              {expiringItems.map((item) => (
                <View key={item.id} style={styles.expiringItemRow}>
                  <Text style={styles.expiringItemEmoji}>{item.emoji}</Text>
                  <Text style={styles.expiringItemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.expiringItemDays}>
                    {item.daysLeft !== undefined && item.daysLeft <= 0
                      ? 'Suresi doldu!'
                      : `${item.daysLeft} gun kaldi`}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {categoryOrder.map((category) => {
            const catItems = filteredGroups[category];
            if (!catItems || catItems.length === 0) return null;
            const catInfo = CATEGORY_LABELS[category] || {
              label: category,
              emoji: '📦',
            };

            return (
              <View key={category} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionEmoji}>{catInfo.emoji}</Text>
                  <Text style={styles.sectionTitle}>{catInfo.label}</Text>
                  <Text style={styles.sectionCount}>{catItems.length}</Text>
                </View>

                <View style={styles.itemList}>
                  {catItems.map((item) => (
                    <SwipeableRow
                      key={item.id}
                      onDelete={() => removeItem(item.id)}
                    >
                      <TouchableOpacity
                        style={styles.itemRow}
                        onPress={() => setEditingItem(item)}
                        activeOpacity={0.7}
                      >
                        {/* Emoji */}
                        <Text style={styles.itemEmoji}>{item.emoji}</Text>

                        {/* Isim + Miktar */}
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemQuantity}>
                            {item.amount} {item.unit}
                          </Text>
                        </View>

                        {/* Tazelik badge */}
                        {item.daysLeft !== undefined && (
                          <View
                            style={[
                              styles.freshnessBadge,
                              { backgroundColor: getFreshnessColor(item.daysLeft) + '18' },
                            ]}
                          >
                            <View
                              style={[
                                styles.freshnessDot,
                                { backgroundColor: getFreshnessColor(item.daysLeft) },
                              ]}
                            />
                            <Text
                              style={[
                                styles.freshnessText,
                                { color: getFreshnessColor(item.daysLeft) },
                              ]}
                            >
                              {getFreshnessLabel(item.daysLeft)}
                            </Text>
                          </View>
                        )}

                        {/* Chevron */}
                        <Text style={styles.chevron}>›</Text>
                      </TouchableOpacity>
                    </SwipeableRow>
                  ))}
                </View>
              </View>
            );
          })}

          {items.length === 0 && isLoaded && (
            <EmptyState
              emoji="🗄️"
              title="Dolabiniz bos"
              subtitle="Bebeginiz icin malzeme ekleyerek baslayin!"
              ctaLabel="Malzeme Ekle"
              onCtaPress={() => setShowAddModal(true)}
            />
          )}

          <AdBanner />
        </ScrollView>

        {/* First-use Onboarding Overlay */}
        <Modal
          visible={showOnboarding}
          animationType="fade"
          transparent
          onRequestClose={dismissOnboarding}
        >
          <View style={styles.onboardingOverlay}>
            <View style={styles.onboardingCard}>
              <Text style={styles.onboardingEmoji}>🧊</Text>
              <Text style={styles.onboardingTitle}>Dolabinda neler var?</Text>
              <Text style={styles.onboardingSubtitle}>
                Bebeginizin beslenme planini olusturmak icin dolabin icini bilmemiz lazim.
              </Text>

              <TouchableOpacity
                style={styles.onboardingBtnPrimary}
                onPress={handleReadyPantry}
                activeOpacity={0.8}
              >
                <Text style={styles.onboardingBtnPrimaryEmoji}>✨</Text>
                <View style={styles.onboardingBtnTextWrap}>
                  <Text style={styles.onboardingBtnPrimaryText}>Hazir Dolap</Text>
                  <Text style={styles.onboardingBtnPrimarySubtext}>
                    Temel malzemelerle doldur
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.onboardingBtnSecondary}
                onPress={handleFillManually}
                activeOpacity={0.8}
              >
                <Text style={styles.onboardingBtnSecondaryEmoji}>➕</Text>
                <View style={styles.onboardingBtnTextWrap}>
                  <Text style={styles.onboardingBtnSecondaryText}>Dolduralim</Text>
                  <Text style={styles.onboardingBtnSecondarySubtext}>
                    Kendim eklemek istiyorum
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Add Pantry Item Modal */}
        <AddPantryItemModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={(item) => {
            haptics.selection();
            addItem(item);
            analytics.pantryItemAdd(item.name, item.category);
            setShowAddModal(false);
          }}
        />

        {/* Edit Pantry Item Modal */}
        <EditPantryItemModal
          visible={!!editingItem}
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(id, updates) => {
            updateItem(id, updates);
            setEditingItem(null);
          }}
          onDelete={(id) => {
            haptics.warning();
            const item = items.find((i) => i.id === id);
            removeItem(id);
            if (item) analytics.pantryItemRemove(item.name);
            setEditingItem(null);
          }}
        />

        {/* AI Recipe Modal */}
        <AIRecipeModal
          visible={showAIModal}
          onClose={() => setShowAIModal(false)}
          pantryItems={pantryItemsForAI}
          babyAgeStage="8m"
          knownAllergens={[]}
          babyName="Elif"
          onSaveRecipe={(recipe) => {
            if (Platform.OS === 'web') {
              window.alert(`"${recipe.title}" tariflerinize eklendi.`);
            } else {
              const { Alert } = require('react-native');
              Alert.alert('Tarif Kaydedildi!', `"${recipe.title}" tariflerinize eklendi.`);
            }
          }}
        />
      </View>
    </GestureWrapper>
  );
}

// ===== DUZENLEME MODALI =====

interface EditPantryItemModalProps {
  visible: boolean;
  item: PantryEntry | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<PantryEntry, 'id' | 'addedDate'>>) => void;
  onDelete: (id: string) => void;
}

function EditPantryItemModal({ visible, item, onClose, onSave, onDelete }: EditPantryItemModalProps) {
  const colors = useColors();
  const editStyles = createEditStyles(colors);
  const modalStyles = createModalStyles(colors);
  const [amount, setAmount] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('adet');
  const [freshnessDay, setFreshnessDay] = useState('');
  const [isDry, setIsDry] = useState(false);

  // Item degistiginde form'u guncelle
  React.useEffect(() => {
    if (item) {
      setAmount(String(item.amount));
      setSelectedUnit(item.unit);
      if (item.daysLeft === -1) {
        setIsDry(true);
        setFreshnessDay('');
      } else if (item.daysLeft !== undefined) {
        setIsDry(false);
        setFreshnessDay(String(item.daysLeft));
      } else {
        setIsDry(false);
        setFreshnessDay('');
      }
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    const parsedAmount = parseFloat(amount) || 1;
    const parsedDays = isDry ? -1 : parseInt(freshnessDay) || undefined;
    onSave(item.id, {
      amount: parsedAmount,
      unit: selectedUnit,
      daysLeft: parsedDays,
    });
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Bu malzemeyi dolaptan kaldirmak istiyor musunuz?')) {
        onDelete(item.id);
      }
    } else {
      const { Alert } = require('react-native');
      Alert.alert('Kaldir', 'Bu malzemeyi dolaptan kaldirmak istiyor musunuz?', [
        { text: 'Iptal', style: 'cancel' },
        { text: 'Kaldir', style: 'destructive', onPress: () => onDelete(item.id) },
      ]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={modalStyles.container}>
        {/* Header */}
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={modalStyles.title}>✏️ Duzenle</Text>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={editStyles.deleteHeaderBtn}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={modalStyles.detailsContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Secilen urun gosterimi */}
            <View style={modalStyles.selectedCard}>
              <Text style={modalStyles.selectedEmoji}>{item.emoji}</Text>
              <Text style={modalStyles.selectedName}>{item.name}</Text>
              <Text style={editStyles.categoryLabel}>
                {(CATEGORY_LABELS[item.category] || { label: item.category }).emoji}{' '}
                {(CATEGORY_LABELS[item.category] || { label: item.category }).label}
              </Text>
            </View>

            {/* Miktar */}
            <View style={modalStyles.fieldGroup}>
              <Text style={modalStyles.fieldLabel}>Miktar</Text>
              <View style={modalStyles.amountRow}>
                <TouchableOpacity
                  style={modalStyles.amountBtn}
                  onPress={() =>
                    setAmount(String(Math.max(1, (parseFloat(amount) || 1) - 1)))
                  }
                >
                  <Text style={modalStyles.amountBtnText}>−</Text>
                </TouchableOpacity>
                <TextInput
                  style={modalStyles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  textAlign="center"
                />
                <TouchableOpacity
                  style={modalStyles.amountBtn}
                  onPress={() =>
                    setAmount(String((parseFloat(amount) || 0) + 1))
                  }
                >
                  <Text style={modalStyles.amountBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Birim */}
            <View style={modalStyles.fieldGroup}>
              <Text style={modalStyles.fieldLabel}>Birim</Text>
              <View style={modalStyles.chipRow}>
                {UNIT_OPTIONS.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      modalStyles.chip,
                      selectedUnit === unit && modalStyles.chipActive,
                    ]}
                    onPress={() => setSelectedUnit(unit)}
                  >
                    <Text
                      style={[
                        modalStyles.chipText,
                        selectedUnit === unit && modalStyles.chipTextActive,
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tazelik */}
            <View style={modalStyles.fieldGroup}>
              <Text style={modalStyles.fieldLabel}>Tazelik Suresi</Text>

              <TouchableOpacity
                style={[
                  modalStyles.dryToggle,
                  isDry && modalStyles.dryToggleActive,
                ]}
                onPress={() => {
                  setIsDry(!isDry);
                  if (!isDry) setFreshnessDay('');
                }}
              >
                <Text style={modalStyles.dryToggleText}>
                  {isDry ? '✅' : '⬜'} Kuru gida (bayatlamaz)
                </Text>
              </TouchableOpacity>

              {!isDry && (
                <View style={modalStyles.freshnessRow}>
                  <TextInput
                    style={modalStyles.freshnessInput}
                    value={freshnessDay}
                    onChangeText={setFreshnessDay}
                    keyboardType="numeric"
                    placeholder="7"
                    placeholderTextColor={colors.border}
                    textAlign="center"
                  />
                  <Text style={modalStyles.freshnessUnit}>gun</Text>
                </View>
              )}
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Kaydet Butonu */}
          <View style={modalStyles.bottomBar}>
            <TouchableOpacity
              style={modalStyles.addButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.addButtonText}>
                ✅ Kaydet
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ===== URUN EKLEME MODALI =====

interface AddPantryItemModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: Omit<PantryEntry, 'id' | 'addedDate'>) => void;
}

function AddPantryItemModal({ visible, onClose, onAdd }: AddPantryItemModalProps) {
  const colors = useColors();
  const modalStyles = createModalStyles(colors);
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [amount, setAmount] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState('adet');
  const [freshnessDay, setFreshnessDay] = useState('');
  const [isDry, setIsDry] = useState(false);

  // Custom urun icin
  const [customName, setCustomName] = useState('');
  const [customEmoji, setCustomEmoji] = useState('🍽️');
  const [customCategory, setCustomCategory] = useState<PantryCategory>('diger');

  const resetAndClose = () => {
    setStep('select');
    setSearchQuery('');
    setSelectedFood(null);
    setAmount('1');
    setSelectedUnit('adet');
    setFreshnessDay('');
    setIsDry(false);
    setCustomName('');
    setCustomEmoji('🍽️');
    setCustomCategory('diger');
    onClose();
  };

  // Arama filtreleme
  const filteredFoods = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return FOODS;
    return FOODS.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.includes(q)
    );
  }, [searchQuery]);

  // Kategoriye gore grupla
  const foodsByCategory = useMemo(() => {
    const groups: Record<string, FoodItem[]> = {};
    for (const food of filteredFoods) {
      if (!groups[food.category]) groups[food.category] = [];
      groups[food.category].push(food);
    }
    return groups;
  }, [filteredFoods]);

  const selectFood = (food: FoodItem) => {
    setSelectedFood(food);
    // Varsayilan tazelik gununu oner
    const defaultDays = getDefaultFreshnessDays(food.name);
    if (defaultDays === -1) {
      setIsDry(true);
      setFreshnessDay('');
    } else if (defaultDays > 0) {
      setIsDry(false);
      setFreshnessDay(String(defaultDays));
    } else {
      setIsDry(false);
      setFreshnessDay('7'); // Bilinmiyorsa 7 gun
    }
    setStep('details');
  };

  const selectCustom = () => {
    setSelectedFood(null);
    setIsDry(false);
    setFreshnessDay('7');
    setStep('details');
  };

  const handleAdd = () => {
    const parsedAmount = parseFloat(amount) || 1;
    const parsedDays = isDry ? -1 : parseInt(freshnessDay) || undefined;

    if (selectedFood) {
      onAdd({
        name: selectedFood.name,
        emoji: selectedFood.emoji,
        category: selectedFood.category,
        amount: parsedAmount,
        unit: selectedUnit,
        daysLeft: parsedDays,
      });
    } else if (customName.trim()) {
      onAdd({
        name: customName.trim(),
        emoji: customEmoji,
        category: customCategory,
        amount: parsedAmount,
        unit: selectedUnit,
        daysLeft: parsedDays,
      });
    }
    resetAndClose();
  };

  const categoryOrder: PantryCategory[] = [
    'sebze', 'meyve', 'protein', 'tahil', 'sut_urunleri', 'baharat', 'diger',
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={resetAndClose}
    >
      <SafeAreaView style={modalStyles.container}>
        {/* Header */}
        <View style={modalStyles.header}>
          <TouchableOpacity
            onPress={step === 'details' ? () => setStep('select') : resetAndClose}
          >
            <Text style={modalStyles.closeBtn}>
              {step === 'details' ? '←' : '✕'}
            </Text>
          </TouchableOpacity>
          <Text style={modalStyles.title}>
            {step === 'select' ? '🏠 Dolaba Ekle' : '📝 Detaylar'}
          </Text>
          <View style={{ width: 32 }} />
        </View>

        {step === 'select' ? (
          /* ===== STEP 1: URUN SEC ===== */
          <>
            {/* Search */}
            <View style={modalStyles.searchContainer}>
              <View style={modalStyles.searchWrapper}>
                <Text style={modalStyles.searchIcon}>🔍</Text>
                <TextInput
                  style={modalStyles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Urun ara..."
                  placeholderTextColor={colors.border}
                  autoFocus
                />
              </View>
            </View>

            <ScrollView
              contentContainerStyle={modalStyles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Diger / Custom urun */}
              <TouchableOpacity
                style={modalStyles.customBtn}
                onPress={selectCustom}
              >
                <Text style={modalStyles.customBtnEmoji}>➕</Text>
                <Text style={modalStyles.customBtnText}>
                  Listede yoksa elle ekle
                </Text>
              </TouchableOpacity>

              {categoryOrder.map((cat) => {
                const catFoods = foodsByCategory[cat];
                if (!catFoods || catFoods.length === 0) return null;
                const catInfo = CATEGORY_LABELS[cat] || {
                  label: cat,
                  emoji: '📦',
                };

                return (
                  <View key={cat} style={modalStyles.categorySection}>
                    <Text style={modalStyles.categoryTitle}>
                      {catInfo.emoji} {catInfo.label}
                    </Text>
                    <View style={modalStyles.foodGrid}>
                      {catFoods.map((food) => (
                        <TouchableOpacity
                          key={food.id}
                          style={modalStyles.foodChip}
                          onPress={() => selectFood(food)}
                        >
                          <Text style={modalStyles.foodChipEmoji}>
                            {food.emoji}
                          </Text>
                          <Text style={modalStyles.foodChipText}>
                            {food.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}

              <View style={{ height: 60 }} />
            </ScrollView>
          </>
        ) : (
          /* ===== STEP 2: MIKTAR + TAZELIK ===== */
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={modalStyles.detailsContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Secilen urun gosterimi */}
              <View style={modalStyles.selectedCard}>
                <Text style={modalStyles.selectedEmoji}>
                  {selectedFood ? selectedFood.emoji : customEmoji}
                </Text>
                <Text style={modalStyles.selectedName}>
                  {selectedFood ? selectedFood.name : 'Ozel Urun'}
                </Text>
              </View>

              {/* Custom urun bilgileri */}
              {!selectedFood && (
                <View style={modalStyles.fieldGroup}>
                  <Text style={modalStyles.fieldLabel}>Urun Adi</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={customName}
                    onChangeText={setCustomName}
                    placeholder="Or: Kereviz"
                    placeholderTextColor={colors.border}
                  />

                  <Text style={[modalStyles.fieldLabel, { marginTop: Spacing.md }]}>
                    Kategori
                  </Text>
                  <View style={modalStyles.chipRow}>
                    {categoryOrder.map((cat) => {
                      const info = CATEGORY_LABELS[cat] || { label: cat, emoji: '📦' };
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            modalStyles.chip,
                            customCategory === cat && modalStyles.chipActive,
                          ]}
                          onPress={() => setCustomCategory(cat)}
                        >
                          <Text style={modalStyles.chipText}>
                            {info.emoji} {info.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Miktar */}
              <View style={modalStyles.fieldGroup}>
                <Text style={modalStyles.fieldLabel}>Miktar</Text>
                <View style={modalStyles.amountRow}>
                  <TouchableOpacity
                    style={modalStyles.amountBtn}
                    onPress={() =>
                      setAmount(String(Math.max(1, (parseFloat(amount) || 1) - 1)))
                    }
                  >
                    <Text style={modalStyles.amountBtnText}>−</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={modalStyles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                  <TouchableOpacity
                    style={modalStyles.amountBtn}
                    onPress={() =>
                      setAmount(String((parseFloat(amount) || 0) + 1))
                    }
                  >
                    <Text style={modalStyles.amountBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Birim */}
              <View style={modalStyles.fieldGroup}>
                <Text style={modalStyles.fieldLabel}>Birim</Text>
                <View style={modalStyles.chipRow}>
                  {UNIT_OPTIONS.map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      style={[
                        modalStyles.chip,
                        selectedUnit === unit && modalStyles.chipActive,
                      ]}
                      onPress={() => setSelectedUnit(unit)}
                    >
                      <Text
                        style={[
                          modalStyles.chipText,
                          selectedUnit === unit && modalStyles.chipTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tazelik */}
              <View style={modalStyles.fieldGroup}>
                <Text style={modalStyles.fieldLabel}>Tazelik Suresi</Text>

                <TouchableOpacity
                  style={[
                    modalStyles.dryToggle,
                    isDry && modalStyles.dryToggleActive,
                  ]}
                  onPress={() => {
                    setIsDry(!isDry);
                    if (!isDry) setFreshnessDay('');
                  }}
                >
                  <Text style={modalStyles.dryToggleText}>
                    {isDry ? '✅' : '⬜'} Kuru gida (bayatlamaz)
                  </Text>
                </TouchableOpacity>

                {!isDry && (
                  <View style={modalStyles.freshnessRow}>
                    <TextInput
                      style={modalStyles.freshnessInput}
                      value={freshnessDay}
                      onChangeText={setFreshnessDay}
                      keyboardType="numeric"
                      placeholder="7"
                      placeholderTextColor={colors.border}
                      textAlign="center"
                    />
                    <Text style={modalStyles.freshnessUnit}>gun</Text>
                    {selectedFood && (
                      <Text style={modalStyles.freshnessSuggestion}>
                        (onerilen: {getDefaultFreshnessDays(selectedFood.name) > 0
                          ? `${getDefaultFreshnessDays(selectedFood.name)} gun`
                          : 'bilinmiyor'})
                      </Text>
                    )}
                  </View>
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            {/* Ekle Butonu */}
            <View style={modalStyles.bottomBar}>
              <TouchableOpacity
                style={[
                  modalStyles.addButton,
                  (!selectedFood && !customName.trim()) && modalStyles.addButtonDisabled,
                ]}
                onPress={handleAdd}
                disabled={!selectedFood && !customName.trim()}
                activeOpacity={0.8}
              >
                <Text style={modalStyles.addButtonText}>
                  ✅ Dolaba Ekle
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
    </Modal>
  );
}

// ===== STILLER =====

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  headerTitle: { ...Typography.h3 },
  addBtn: {
    backgroundColor: colors.sage,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  addBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.soft,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: {
    width: 1,
    backgroundColor: colors.creamDark,
    marginVertical: 4,
  },
  statNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: colors.textDark,
  },
  statLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    height: 44,
    ...Shadow.soft,
  },
  searchIcon: { fontSize: 14, marginRight: Spacing.md },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  section: { marginBottom: Spacing.xxl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionEmoji: { fontSize: 18 },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: colors.textDark,
    flex: 1,
  },
  sectionCount: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: colors.textLight,
    backgroundColor: colors.creamMid,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  // Liste layout
  itemList: {
    gap: Spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.soft,
  },
  itemEmoji: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: colors.textDark,
  },
  itemQuantity: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
  },
  freshnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    gap: 4,
  },
  freshnessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  freshnessText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  chevron: {
    fontFamily: FontFamily.medium,
    fontSize: 22,
    color: colors.border,
    marginLeft: 4,
  },

  // ===== EXPIRING ITEMS SECTION =====
  expiringSection: {
    backgroundColor: colors.warningBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  expiringSectionHeader: {
    marginBottom: Spacing.md,
  },
  expiringSectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: colors.warningDark,
  },
  expiringItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  expiringItemEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  expiringItemName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: colors.textDark,
    flex: 1,
  },
  expiringItemDays: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.heart,
  },

  // ===== ONBOARDING OVERLAY =====
  onboardingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  onboardingCard: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...Shadow.soft,
  },
  onboardingEmoji: {
    fontSize: 56,
    marginBottom: Spacing.md,
  },
  onboardingTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  onboardingSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 20,
  },
  onboardingBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sage,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  onboardingBtnPrimaryEmoji: {
    fontSize: 28,
  },
  onboardingBtnTextWrap: {
    flex: 1,
  },
  onboardingBtnPrimaryText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.white,
  },
  onboardingBtnPrimarySubtext: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.white,
    opacity: 0.85,
    marginTop: 2,
  },
  onboardingBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.creamMid,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    gap: Spacing.md,
  },
  onboardingBtnSecondaryEmoji: {
    fontSize: 28,
  },
  onboardingBtnSecondaryText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.textDark,
  },
  onboardingBtnSecondarySubtext: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
});

// ===== EDIT MODAL STILLERI =====

const createEditStyles = (colors: ThemeColors) => StyleSheet.create({
  deleteHeaderBtn: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  categoryLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
});

// ===== MODAL STILLERI =====

const createModalStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.creamDark,
  },
  closeBtn: {
    fontSize: 20,
    color: colors.textLight,
    width: 32,
    textAlign: 'center',
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: colors.textDark,
  },

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    height: 44,
    ...Shadow.soft,
  },
  searchIcon: { fontSize: 14, marginRight: Spacing.md },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
  },

  // List
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 60,
    gap: Spacing.lg,
  },

  // Custom button
  customBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.sagePale,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: colors.sage,
    borderStyle: 'dashed',
  },
  customBtnEmoji: { fontSize: 22 },
  customBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: colors.sage,
  },

  // Category section
  categorySection: { gap: Spacing.sm },
  categoryTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: colors.textDark,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  foodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.round,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: 4,
    ...Shadow.soft,
  },
  foodChipEmoji: { fontSize: 16 },
  foodChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textDark,
  },

  // Details step
  detailsContent: {
    padding: Spacing.xl,
    gap: Spacing.lg,
  },

  selectedCard: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.sm,
    ...Shadow.soft,
  },
  selectedEmoji: { fontSize: 48 },
  selectedName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: colors.textDark,
  },

  // Field group
  fieldGroup: {
    backgroundColor: colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadow.soft,
  },
  fieldLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: colors.textDark,
    marginBottom: 4,
  },
  textInput: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    height: 44,
  },

  // Amount row
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  amountBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sagePale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: colors.sage,
  },
  amountInput: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    height: 48,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: colors.creamMid,
  },
  chipActive: {
    backgroundColor: colors.sage,
  },
  chipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: colors.textDark,
  },
  chipTextActive: {
    color: colors.white,
    fontFamily: FontFamily.semiBold,
  },

  // Freshness / dry toggle
  dryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dryToggleActive: {},
  dryToggleText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  freshnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  freshnessInput: {
    width: 60,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BorderRadius.md,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.textDark,
  },
  freshnessUnit: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    color: colors.textDark,
  },
  freshnessSuggestion: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: colors.textLight,
    flex: 1,
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.creamDark,
  },
  addButton: {
    backgroundColor: colors.sage,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: colors.white,
  },
});
