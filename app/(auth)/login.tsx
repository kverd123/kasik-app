/**
 * Kaşık — Login Screen
 * Email/password login with Google & Apple Sign-In options
 */

import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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

// Configure Google Sign-In
GoogleSignin.configure({
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export default function LoginScreen() {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

  const { login, loginWithGoogle, loginWithApple, continueAsGuest, isLoading, error, clearError, user } = useAuthStore();

  // Race condition düzeltmesi: user state değişince navigasyon yap
  useEffect(() => {
    if (pendingNavigation && user) {
      setPendingNavigation(false);
      if (!user.onboardingCompleted) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)/plan');
      }
    }
  }, [pendingNavigation, user]);

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;
      if (!idToken) {
        Alert.alert('Hata', 'Google giriş başarısız oldu.');
        return;
      }
      await loginWithGoogle(idToken);
      analytics.login('google');
      setPendingNavigation(true);
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
        Alert.alert('Hata', 'Google ile giriş yapılamadı.');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // Kriptografik olarak güvenli nonce (Apple gereksinimleri)
      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const nonce = Array.from(new Uint8Array(randomBytes), b => b.toString(16).padStart(2, '0')).join('');
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        Alert.alert('Hata', 'Apple giriş başarısız oldu.');
        return;
      }

      await loginWithApple(credential.identityToken, nonce, credential.fullName ?? undefined);
      analytics.login('apple');
      setPendingNavigation(true);
    } catch (error: any) {
      if (error.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Hata', 'Apple ile giriş yapılamadı.');
      }
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Hata', 'E-posta ve şifre alanları boş bırakılamaz.');
      return;
    }

    try {
      await login(email.trim(), password);
      analytics.login('email');
      setPendingNavigation(true);
    } catch {
      // Error is set in the store
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
        {/* Header with mascot */}
        <View style={styles.header}>
          <Text style={styles.mascotEmoji}>🥄</Text>
          <Text style={[styles.title, { color: colors.sage }]}>Kaşık</Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>Ek Gıda Rehberi</Text>
        </View>

        {/* Welcome text */}
        <Text style={styles.welcomeText}>Tekrar hoş geldiniz!</Text>
        <Text style={[styles.welcomeSubtext, { color: colors.textLight }]}>
          Hesabınıza giriş yaparak devam edin.
        </Text>

        {/* Error message */}
        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.warningBg }]}>
            <Ionicons name="warning-outline" size={18} color={colors.warningDark} />
            <Text style={[styles.errorText, { color: colors.warningDark }]}> {error}</Text>
            <TouchableOpacity onPress={clearError} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={18} color={colors.warningDark} />
            </TouchableOpacity>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textMid }]}>E-posta</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.creamDark }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textLight} style={styles.inputIconStyle} />
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
              <Ionicons name="lock-closed-outline" size={18} color={colors.textLight} style={styles.inputIconStyle} />
              <TextInput
                style={[styles.input, { color: colors.textDark }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Şifrenizi girin"
                placeholderTextColor={colors.border}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showPassword}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textLight}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.sage }]}>Şifremi unuttum</Text>
            </TouchableOpacity>
          </Link>

          {/* Login Button */}
          <Button
            title="Giriş Yap"
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="lg"
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.creamDark }]} />
            <Text style={[styles.dividerText, { color: colors.textLight }]}>veya</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.creamDark }]} />
          </View>

          {/* Social Login Buttons */}
          <Button
            title="Google ile Giriş Yap"
            onPress={handleGoogleSignIn}
            variant="outline"
            fullWidth
            size="lg"
            icon={<Ionicons name="logo-google" size={20} color={colors.textMid} />}
          />

          <View style={{ height: Spacing.md }} />

          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={{ width: '100%', height: 52 }}
              onPress={handleAppleSignIn}
            />
          )}
        </View>

        {/* Register Link */}
        <View style={styles.registerRow}>
          <Text style={[styles.registerText, { color: colors.textLight }]}>Hesabınız yok mu? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={[styles.registerLink, { color: colors.sage }]}>Kayıt Ol</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Guest Mode */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={async () => {
            await continueAsGuest();
            analytics.login('guest');
            router.replace('/(tabs)/recipes');
          }}
        >
          <Ionicons name="eye-outline" size={18} color={colors.textLight} />
          <Text style={[styles.guestButtonText, { color: colors.textLight }]}>
            Misafir olarak devam et
          </Text>
        </TouchableOpacity>
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  mascotEmoji: {
    fontSize: 56,
    marginBottom: Spacing.sm,
  },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.xxxl,
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
  welcomeText: {
    ...Typography.h2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  welcomeSubtext: {
    ...Typography.bodySmall,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  errorBanner: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    flex: 1,
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
  inputIconStyle: {
    marginRight: Spacing.md,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
  },
  showPassword: {
    padding: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
  },
  forgotPasswordText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    marginHorizontal: Spacing.lg,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxxl,
  },
  registerText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
  },
  registerLink: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.md,
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  guestButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.md,
  },
});
