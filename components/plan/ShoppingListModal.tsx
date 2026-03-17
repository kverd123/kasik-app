/**
 * Kaşık — Alışveriş Listesi Modal
 * Haftalık yemek planından otomatik oluşturulan alışveriş listesi
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
  Platform,
  Share,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../constants/theme';
import { Meal, MealSlot } from '../../types';
import {
  generateShoppingList,
  shoppingListToText,
  ShoppingCategory,
  ShoppingItem,
} from '../../lib/shoppingList';
import {
  getSeasonalProduce,
  getSeasonalLabel,
  MONTH_NAMES_TR,
  SeasonalStatus,
} from '../../constants/seasonal';

interface ShoppingListModalProps {
  visible: boolean;
  onClose: () => void;
  weekMeals: Record<number, Record<MealSlot, Meal[]>>;
  pantryItems?: { name: string; emoji?: string; amount: number; unit: string; daysLeft?: number }[];
}

export function ShoppingListModal({
  visible,
  onClose,
  weekMeals,
  pantryItems = [],
}: ShoppingListModalProps) {
  const colors = useColors();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const categories = useMemo(
    () => generateShoppingList(weekMeals, pantryItems),
    [weekMeals, pantryItems]
  );

  const toBuyCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => !i.inPantry),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories]);

  const inPantryCategories = useMemo(() => {
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => i.inPantry),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories]);

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const inPantryCount = categories.reduce(
    (sum, c) => sum + c.items.filter((i) => i.inPantry).length,
    0
  );
  const checkedCount = checkedItems.size;
  const needToBuy = totalItems - inPantryCount;

  const currentMonth = new Date().getMonth() + 1;
  const monthName = MONTH_NAMES_TR[currentMonth];
  const seasonalPeakItems = useMemo(() => {
    const peakProduce = getSeasonalProduce(currentMonth)
      .filter((p) => p.months[currentMonth] === 'peak')
      .slice(0, 5);
    return peakProduce.map((p) => `${p.emoji} ${p.name}`).join(', ');
  }, [currentMonth]);

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleShare = async () => {
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      items: cat.items.map((item) => ({
        ...item,
        checked: checkedItems.has(item.id),
      })),
    }));

    const text = shoppingListToText(updatedCategories);

    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(text);
        window.alert('Alışveriş listesi kopyalandı!');
      } catch {
        window.alert(text);
      }
    } else {
      try {
        await Share.share({ message: text, title: 'Kaşık Alışveriş Listesi' });
      } catch (e) {
        console.error('Paylaşım hatası:', e);
      }
    }
  };

  const renderItem = (item: ShoppingItem) => {
    const isChecked = checkedItems.has(item.id) || item.inPantry;
    const hasPantryPartial = !item.inPantry && item.pantryAmount > 0 && item.toBuyAmount > 0;
    const isExpiringWarning = item.pantryExpiring && item.pantryDaysLeft !== undefined;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.itemRow,
          { backgroundColor: colors.white },
          isChecked && { backgroundColor: colors.sagePale, opacity: 0.85 },
        ]}
        onPress={() => !item.inPantry && toggleItem(item.id)}
        activeOpacity={item.inPantry ? 1 : 0.6}
      >
        <View style={[
          styles.itemCheck,
          { borderColor: colors.border, backgroundColor: colors.white },
          isChecked && { backgroundColor: colors.sage, borderColor: colors.sage },
        ]}>
          {isChecked && <Text style={[styles.itemCheckMark, { color: colors.white }]}>✓</Text>}
        </View>

        <Text style={styles.itemEmoji}>{item.emoji}</Text>

        <View style={styles.itemInfo}>
          <Text style={[
            styles.itemName,
            { color: colors.textDark },
            isChecked && { textDecorationLine: 'line-through', color: colors.textLight },
          ]}>
            {item.name}
          </Text>

          {!item.inPantry && item.toBuyAmount > 0 && (
            <Text style={[styles.itemAmount, { color: colors.textLight }]}>
              {item.toBuyAmount} {item.unit} alınacak
              {hasPantryPartial && ` (dolapta ${item.pantryAmount} var)`}
            </Text>
          )}

          {item.inPantry && item.pantryAmount > 0 && (
            <Text style={[styles.itemAmount, { color: colors.textLight }]}>
              {item.pantryAmount} {item.unit} (yeterli)
            </Text>
          )}

          {isExpiringWarning && (
            <Text style={[styles.itemExpiring, { color: colors.warning }]}>
              ⚠️ {item.pantryDaysLeft! <= 2 ? 'Bayatlayacak!' : `${item.pantryDaysLeft} gün kaldı`}
            </Text>
          )}

          <View style={styles.badgeRow}>
            {item.seasonalStatus && item.seasonalStatus !== 'available' && (() => {
              const label = getSeasonalLabel(item.seasonalStatus);
              return (
                <View style={[styles.seasonalBadge, { backgroundColor: label.bgColor }]}>
                  <Text style={[styles.seasonalBadgeText, { color: label.color }]}>
                    {item.seasonalStatus === 'peak' ? '🌿' : item.seasonalStatus === 'limited' ? '🟠' : '🔴'} {label.text}
                  </Text>
                </View>
              );
            })()}
            {item.isOrganic && (
              <View style={[styles.organicBadge, { backgroundColor: colors.successBg }]}>
                <Text style={[styles.organicBadgeText, { color: colors.success }]}>🌿 Organik</Text>
              </View>
            )}
          </View>

          {item.seasonalAlternative && (
            <Text style={[styles.seasonalAlt, { color: colors.warningDark }]}>
              Alternatif: {item.seasonalAlternative}
            </Text>
          )}
        </View>

        {item.inPantry && (
          <View style={[styles.pantryBadge, { backgroundColor: colors.successBg }]}>
            <Text style={[styles.pantryBadgeText, { color: colors.success }]}>🏠 Dolapta</Text>
          </View>
        )}

        {!item.inPantry && item.fromRecipes.length > 0 && (
          <Text style={[styles.itemSource, { color: colors.textLight }]} numberOfLines={1}>
            {item.fromRecipes.length > 1
              ? `${item.fromRecipes.length} tarif`
              : item.fromRecipes[0]}
          </Text>
        )}
      </TouchableOpacity>
    );
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
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeBtn, { color: colors.textLight }]}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textDark }]}>🛒 Alışveriş Listesi</Text>
          <TouchableOpacity onPress={handleShare}>
            <Text style={styles.shareBtn}>📤</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.white }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.textDark }]}>{totalItems}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Toplam</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.creamDark }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.textDark }]}>{inPantryCount}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Dolapta</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.creamDark }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.sage }]}>{needToBuy}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Alınacak</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.creamDark }]} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: colors.success }]}>{checkedCount}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Alındı</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48 }}>📋</Text>
              <Text style={[styles.emptyTitle, { color: colors.textDark }]}>Liste Boş</Text>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                Haftalık planınıza tarif ekleyin, malzemeler otomatik listelensin.
              </Text>
            </View>
          ) : (
            <>
              {seasonalPeakItems.length > 0 && (
                <View style={[styles.seasonalBanner, { backgroundColor: colors.successBg, borderColor: colors.sageLight }]}>
                  <Text style={[styles.seasonalBannerTitle, { color: colors.success }]}>
                    🌿 {monthName} ayında en taze
                  </Text>
                  <Text style={[styles.seasonalBannerItems, { color: colors.success }]}>
                    {seasonalPeakItems}
                  </Text>
                </View>
              )}

              {toBuyCategories.length > 0 && (
                <View style={styles.sectionGroup}>
                  <View style={[styles.sectionGroupHeader, { borderBottomColor: colors.sage }]}>
                    <Text style={[styles.sectionGroupTitle, { color: colors.sage }]}>🛒 Alınacaklar</Text>
                    <View style={[styles.sectionGroupBadge, { backgroundColor: colors.sagePale }]}>
                      <Text style={[styles.sectionGroupBadgeText, { color: colors.sage }]}>{needToBuy}</Text>
                    </View>
                  </View>
                  {toBuyCategories.map((cat) => (
                    <View key={cat.category} style={styles.categorySection}>
                      <View style={styles.categoryHeader}>
                        <Text style={[styles.categoryTitle, { color: colors.textDark }]}>
                          {cat.emoji} {cat.label}
                        </Text>
                        <Text style={[styles.categoryCount, { color: colors.textLight, backgroundColor: colors.creamDark }]}>{cat.items.length}</Text>
                      </View>
                      {cat.items.map(renderItem)}
                    </View>
                  ))}
                </View>
              )}

              {inPantryCategories.length > 0 && (
                <View style={styles.sectionGroup}>
                  <View style={[styles.sectionGroupHeader, { borderBottomColor: colors.success, marginTop: Spacing.xl }]}>
                    <Text style={[styles.sectionGroupTitle, { color: colors.success }]}>
                      🏠 Dolapta Var
                    </Text>
                    <View style={[styles.sectionGroupBadge, { backgroundColor: colors.successBg }]}>
                      <Text style={[styles.sectionGroupBadgeText, { color: colors.success }]}>
                        {inPantryCount}
                      </Text>
                    </View>
                  </View>
                  {inPantryCategories.map((cat) => (
                    <View key={`pantry-${cat.category}`} style={styles.categorySection}>
                      <View style={styles.categoryHeader}>
                        <Text style={[styles.categoryTitle, { color: colors.textDark }]}>
                          {cat.emoji} {cat.label}
                        </Text>
                        <Text style={[styles.categoryCount, { color: colors.textLight, backgroundColor: colors.creamDark }]}>{cat.items.length}</Text>
                      </View>
                      {cat.items.map(renderItem)}
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>

        {categories.length > 0 && (
          <View style={[styles.bottomBar, { backgroundColor: colors.white, borderTopColor: colors.creamDark }]}>
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: colors.sage }]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Text style={[styles.shareButtonText, { color: colors.white }]}>
                📤 Listeyi Paylaş
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  closeBtn: { fontSize: 20, width: 32, textAlign: 'center' },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  shareBtn: { fontSize: 20, width: 32, textAlign: 'center' },

  summaryCard: {
    marginHorizontal: Spacing.xl, marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl, padding: Spacing.lg, ...Shadow.soft,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryNumber: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl },
  summaryLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: 2 },
  summaryDivider: { width: 1, height: 30 },

  listContainer: { flex: 1 },
  listContent: { padding: Spacing.xl, gap: Spacing.lg },

  sectionGroup: { gap: Spacing.lg },
  sectionGroupHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingBottom: Spacing.sm, borderBottomWidth: 1.5, marginBottom: Spacing.xs,
  },
  sectionGroupTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
  sectionGroupBadge: {
    paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.round,
  },
  sectionGroupBadgeText: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },

  categorySection: { gap: Spacing.sm },
  categoryHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: Spacing.xs,
  },
  categoryTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.base },
  categoryCount: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
    borderRadius: BorderRadius.round, overflow: 'hidden',
  },

  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: BorderRadius.lg, paddingVertical: Spacing.md, paddingHorizontal: Spacing.md,
    gap: Spacing.sm, ...Shadow.soft,
  },
  itemCheck: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1.5,
    justifyContent: 'center', alignItems: 'center',
  },
  itemCheckMark: { fontFamily: FontFamily.bold, fontSize: 13 },
  itemEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  itemInfo: { flex: 1, gap: 1 },
  itemName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.md },
  itemAmount: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  itemExpiring: { fontFamily: FontFamily.semiBold, fontSize: 10, marginTop: 1 },
  badgeRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginTop: 2 },
  seasonalBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: BorderRadius.round },
  seasonalBadgeText: { fontFamily: FontFamily.semiBold, fontSize: 9 },
  organicBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: BorderRadius.round },
  organicBadgeText: { fontFamily: FontFamily.semiBold, fontSize: 9 },
  seasonalAlt: { fontFamily: FontFamily.medium, fontSize: 9, marginTop: 1, fontStyle: 'italic' },
  seasonalBanner: {
    borderRadius: BorderRadius.xl, padding: Spacing.md, borderWidth: 1, gap: 4,
  },
  seasonalBannerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.sm },
  seasonalBannerItems: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  pantryBadge: {
    paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: BorderRadius.round,
  },
  pantryBadgeText: { fontFamily: FontFamily.semiBold, fontSize: 10 },
  itemSource: { fontFamily: FontFamily.medium, fontSize: 10, maxWidth: 80, textAlign: 'right' },

  emptyState: { alignItems: 'center', paddingVertical: Spacing.huge, gap: Spacing.md },
  emptyTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  emptyText: {
    fontFamily: FontFamily.medium, fontSize: FontSize.md,
    textAlign: 'center', lineHeight: 20, paddingHorizontal: Spacing.xxl,
  },

  bottomBar: {
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, borderTopWidth: 1,
  },
  shareButton: {
    borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center',
  },
  shareButtonText: { fontFamily: FontFamily.bold, fontSize: FontSize.lg },
});
