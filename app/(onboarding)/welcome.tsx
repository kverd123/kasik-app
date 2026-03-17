/**
 * Kaşık — Welcome / Onboarding Screen 1
 * Greeting mascot + feature highlights
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius, Typography } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

const FEATURES = [
  { emoji: '📋', title: 'Beslenme Planı', desc: 'Günlük, haftalık ve aylık planlar' },
  { emoji: '🥕', title: 'Akıllı Tarifler', desc: 'Dolabınıza göre tarif önerileri' },
  { emoji: '⚠️', title: 'Alerjen Takibi', desc: 'Güvenli besin tanıtımı' },
  { emoji: '👥', title: 'Topluluk', desc: 'Deneyimlerinizi paylaşın' },
];

export default function WelcomeScreen() {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={styles.content}>
        {/* Mascot */}
        <View style={styles.mascotContainer}>
          <Text style={styles.mascotEmoji}>🥄</Text>
          <View style={[styles.speechBubble, { backgroundColor: colors.white, shadowColor: colors.sage }]}>
            <Text style={[styles.speechText, { color: colors.textMid }]}>
              Merhaba! Ben Kaşık.{'\n'}Bebeğinizin ek gıda{'\n'}yolculuğunda yanınızdayım!
            </Text>
          </View>
        </View>

        {/* App Title */}
        <Text style={[styles.title, { color: colors.sage }]}>Kaşık'a Hoş Geldiniz!</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>Ek Gıda Rehberi</Text>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={styles.featureItem}>
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <View style={styles.featureText}>
                <Text style={[styles.featureTitle, { color: colors.textDark }]}>{feature.title}</Text>
                <Text style={[styles.featureDesc, { color: colors.textLight }]}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <Button
            title="Başlayalım →"
            onPress={() => router.push('/(onboarding)/baby-info')}
            fullWidth
            size="lg"
          />
          <Text style={[styles.ctaSubtext, { color: colors.textLight }]}>
            Kurulum sadece 2 dakika sürecek
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxxl,
  },
  mascotContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  mascotEmoji: { fontSize: 72 },
  speechBubble: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxWidth: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  speechText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
  features: {
    gap: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  featureEmoji: { fontSize: 28 },
  featureText: { flex: 1 },
  featureTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
  featureDesc: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  ctaContainer: {
    gap: Spacing.md,
    marginTop: Spacing.xxl,
  },
  ctaSubtext: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});
