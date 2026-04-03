/**
 * Kasik — GuestBanner Component
 * Shows a registration prompt banner for guest users on restricted screens.
 * Also provides a full-screen overlay for fully restricted tabs.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { useAuthStore } from '../../stores/authStore';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../constants/theme';

/**
 * Persistent banner shown at the top of partially restricted screens.
 * Tapping navigates to login.
 */
export function GuestBanner() {
  const colors = useColors();
  const { exitGuestMode } = useAuthStore();

  const handlePress = async () => {
    await exitGuestMode();
    router.replace('/(auth)/login');
  };

  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: colors.sage }]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <Ionicons name="person-add-outline" size={16} color={colors.white} />
      <Text style={[styles.bannerText, { color: colors.white }]}>
        Tam erisim icin kayit olun
      </Text>
      <Ionicons name="arrow-forward" size={16} color={colors.white} />
    </TouchableOpacity>
  );
}

interface GuestBlockScreenProps {
  /** Title shown on the blocked screen */
  title: string;
  /** Description of what the user is missing */
  description: string;
  /** Emoji icon */
  icon: string;
}

/**
 * Full-screen overlay for tabs that are completely blocked for guest users.
 * Shows an icon, description and a "Kayit Ol" button.
 */
export function GuestBlockScreen({ title, description, icon }: GuestBlockScreenProps) {
  const colors = useColors();
  const { exitGuestMode } = useAuthStore();

  const handleRegister = async () => {
    await exitGuestMode();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.blockContainer, { backgroundColor: colors.cream }]}>
      <View style={styles.blockContent}>
        <Text style={styles.blockEmoji}>{icon}</Text>
        <Text style={[styles.blockTitle, { color: colors.textDark }]}>{title}</Text>
        <Text style={[styles.blockDescription, { color: colors.textLight }]}>
          {description}
        </Text>

        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: colors.sage }]}
          onPress={handleRegister}
          activeOpacity={0.7}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.white} />
          <Text style={[styles.registerButtonText, { color: colors.white }]}>
            Kayit Ol
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={handleRegister}
          activeOpacity={0.7}
        >
          <Text style={[styles.loginLinkText, { color: colors.sage }]}>
            Zaten hesabim var — Giris Yap
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Banner styles
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadow.soft,
  },
  bannerText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },

  // Block screen styles
  blockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  blockEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  blockTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    textAlign: 'center',
  },
  blockDescription: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
  },
  registerButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },
  loginLink: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  loginLinkText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
});
