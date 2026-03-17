/**
 * Kaşık — Ad Banner Component
 * Shows ads only for non-premium users
 * Wraps Google AdMob banner
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, BorderRadius, Spacing } from '../../constants/theme';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  showUpgrade?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  size = 'banner',
  showUpgrade = true,
}) => {
  const colors = useColors();
  const { canAccess } = useSubscriptionStore();

  // Phase 1: 'ad_free' is the only active premium feature
  // Premium users don't see ads
  if (canAccess('ad_free')) return null;

  return (
    <View style={styles.container}>
      {/* TODO: Replace with actual AdMob component */}
      {/* <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize[size.toUpperCase()]}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      /> */}

      {/* Placeholder for development */}
      <View style={[styles.placeholder, styles[size], { backgroundColor: colors.creamMid, borderColor: colors.creamDark }]}>
        <Text style={[styles.placeholderText, { color: colors.textLight }]}>Reklam Alanı</Text>
      </View>

      {showUpgrade && (
        <TouchableOpacity style={styles.upgradeHint}>
          <Text style={[styles.upgradeText, { color: colors.sage }]}>✨ Reklamsız deneyim için Premium'a geç</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  placeholder: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  banner: {
    width: 320,
    height: 50,
  },
  largeBanner: {
    width: 320,
    height: 100,
  },
  mediumRectangle: {
    width: 300,
    height: 250,
  },
  placeholderText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  upgradeHint: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  upgradeText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
  },
});
