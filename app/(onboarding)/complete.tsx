/**
 * Kasik — Onboarding Complete Screen (Step 4)
 * Celebration screen with summary + CTA to main app
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { OnboardingProgress } from '../../components/ui/OnboardingProgress';
import { useBabyStore } from '../../stores/babyStore';

const CONFETTI = ['🎉', '🥳', '✨', '🎊', '⭐', '💚'];

const CHECKLIST = [
  { emoji: '✅', text: 'Bebek profili oluşturuldu' },
  { emoji: '✅', text: 'Alerjenler kaydedildi' },
  { emoji: '✅', text: '100+ tarif hazır' },
  { emoji: '✅', text: 'Beslenme planı aktif' },
];

export default function CompleteScreen() {
  const colors = useColors();
  const { baby } = useBabyStore();
  const babyName = baby?.name || 'Bebeğiniz';

  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Stagger animations
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 8,
        bounciness: 12,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGoToPlan = () => {
    router.replace('/(tabs)/plan');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={styles.content}>
        {/* Progress */}
        <OnboardingProgress currentStep={4} totalSteps={4} />

        {/* Confetti emoji row */}
        <Animated.View style={[styles.confettiRow, { transform: [{ scale: scaleAnim }] }]}>
          {CONFETTI.map((emoji, i) => (
            <Text key={i} style={[styles.confettiEmoji, { fontSize: 28 + (i % 3) * 8 }]}>
              {emoji}
            </Text>
          ))}
        </Animated.View>

        {/* Main celebration */}
        <Animated.View style={[styles.celebrationBlock, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.bigEmoji}>🥄</Text>
          <Text style={[styles.celebrationTitle, { color: colors.sage }]}>Harika!</Text>
          <Text style={[styles.celebrationSubtitle, { color: colors.textMid }]}>Her şey hazır.</Text>
        </Animated.View>

        {/* Personal message */}
        <Animated.View style={[styles.messageCard, { backgroundColor: colors.white, borderColor: colors.sageLight, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={[styles.messageText, { color: colors.textMid }]}>
            {babyName} için kişiselleştirilmiş beslenme planı oluşturuldu. Şimdi ek gıda yolculuğuna başlayabilirsiniz!
          </Text>
        </Animated.View>

        {/* Checklist */}
        <Animated.View style={[styles.checklist, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {CHECKLIST.map((item, i) => (
            <View key={i} style={[styles.checkItem, { backgroundColor: colors.successBg }]}>
              <Text style={styles.checkEmoji}>{item.emoji}</Text>
              <Text style={[styles.checkText, { color: colors.success }]}>{item.text}</Text>
            </View>
          ))}
        </Animated.View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title="Planıma Git →"
            onPress={handleGoToPlan}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    justifyContent: 'space-between',
  },
  confettiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  confettiEmoji: {
    fontSize: 28,
  },
  celebrationBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bigEmoji: {
    fontSize: 72,
  },
  celebrationTitle: {
    ...Typography.h1,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xl,
    textAlign: 'center',
  },
  messageCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
  },
  messageText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: 24,
    textAlign: 'center',
  },
  checklist: {
    gap: Spacing.md,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  checkEmoji: {
    fontSize: 18,
  },
  checkText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  ctaContainer: {
    gap: Spacing.md,
  },
});
