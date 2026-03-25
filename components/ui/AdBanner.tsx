/**
 * Kaşık — Ad Banner Component
 * Shows real AdMob ads for non-premium users
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useColors } from '../../hooks/useColors';
import { FontFamily, BorderRadius, Spacing } from '../../constants/theme';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

const BANNER_ID = __DEV__
  ? TestIds.BANNER
  : (process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || 'ca-app-pub-8099877386187148/1351741816');

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  showUpgrade?: boolean;
}

const sizeMap: Record<string, BannerAdSize> = {
  banner: BannerAdSize.BANNER,
  largeBanner: BannerAdSize.LARGE_BANNER,
  mediumRectangle: BannerAdSize.MEDIUM_RECTANGLE,
};

export const AdBanner: React.FC<AdBannerProps> = ({
  size = 'banner',
  showUpgrade = true,
}) => {
  const colors = useColors();
  const { canAccess } = useSubscriptionStore();
  const [adError, setAdError] = useState(false);

  // Premium users don't see ads
  if (canAccess('ad_free')) return null;

  return (
    <View style={styles.container}>
      {!adError ? (
        <BannerAd
          unitId={BANNER_ID}
          size={sizeMap[size] || BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(error) => {
            console.log('Ad failed to load:', error);
            setAdError(true);
          }}
        />
      ) : (
        <View style={[styles.placeholder, styles[size], { backgroundColor: colors.creamMid, borderColor: colors.creamDark }]}>
          <Text style={[styles.placeholderText, { color: colors.textLight }]}>Reklam Alanı</Text>
        </View>
      )}

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
