/**
 * Kaşık — Register Screen
 * New user registration with email/password
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useColors } from '../../hooks/useColors';
import {
  FontFamily,
  FontSize,
  Spacing,
  BorderRadius,
  Shadow,
  Typography,
} from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { analytics } from '../../lib/analytics';

export default function RegisterScreen() {
  const colors = useColors();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, isLoading, error, clearError } = useAuthStore();

  const handleRegister = async () => {
    if (!displayName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    try {
      await register(email.trim(), password, displayName.trim());
      analytics.register('email');
      // Kayıt başarılı — onboarding'e yönlendir
      router.replace('/(onboarding)/welcome');
    } catch {
      // Error handled in store
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.cream }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={[styles.backText, { color: colors.sage }]}>← Geri</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mascotEmoji}>🥄</Text>
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Bebeğinizin ek gıda yolculuğuna başlayın
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={[styles.errorText, { color: colors.warningDark }]}>⚠️ {error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={[styles.errorDismiss, { color: colors.warningDark }]}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMid }]}>Adınız</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={[styles.input, { color: colors.textDark }]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Adınızı girin"
                placeholderTextColor={colors.border}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMid }]}>E-posta</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={[styles.input, { color: colors.textDark }]}
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@email.com"
                placeholderTextColor={colors.border}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMid }]}>Şifre</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, { color: colors.textDark }]}
                value={password}
                onChangeText={setPassword}
                placeholder="En az 6 karakter"
                placeholderTextColor={colors.border}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMid }]}>Şifre Tekrar</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, { color: colors.textDark }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={colors.border}
                secureTextEntry={!showPassword}
              />
            </View>
          </View>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <View style={styles.strengthRow}>
              <View
                style={[
                  styles.strengthBar,
                  {
                    width: `${Math.min(password.length * 15, 100)}%`,
                    backgroundColor:
                      password.length < 6
                        ? colors.heart
                        : password.length < 10
                        ? colors.warning
                        : colors.sage,
                  },
                ]}
              />
              <Text style={[styles.strengthText, { color: colors.textLight }]}>
                {password.length < 6
                  ? 'Zayıf'
                  : password.length < 10
                  ? 'Orta'
                  : 'Güçlü'}
              </Text>
            </View>
          )}

          {/* Register Button */}
          <Button
            title="Kayıt Ol"
            onPress={handleRegister}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          {/* Terms */}
          <Text style={[styles.terms, { color: colors.textLight }]}>
            Kayıt olarak{' '}
            <Text
              style={[styles.termsLink, { color: colors.sage }]}
              onPress={() => Linking.openURL('https://kverd123.github.io/kasik-app/terms.html')}
            >
              Kullanım Koşulları
            </Text>
            {' '}ve{' '}
            <Text
              style={[styles.termsLink, { color: colors.sage }]}
              onPress={() => Linking.openURL('https://kverd123.github.io/kasik-app/privacy.html')}
            >
              Gizlilik Politikası
            </Text>
            'nı kabul etmiş olursunuz.
          </Text>
        </View>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: colors.textLight }]}>Zaten hesabınız var mı? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={[styles.loginLink, { color: colors.sage }]}>Giriş Yap</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  backText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  mascotEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  errorBanner: {
    backgroundColor: '#FFF0E0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    flex: 1,
  },
  errorDismiss: {
    fontSize: 16,
    paddingLeft: Spacing.md,
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    height: 52,
    ...Shadow.soft,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: -Spacing.sm,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  terms: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    fontFamily: FontFamily.semiBold,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  loginText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
  },
  loginLink: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
});
