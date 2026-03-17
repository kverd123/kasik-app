/**
 * Kaşık — Forgot Password Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/colors';
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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { forgotPassword, isLoading, error } = useAuthStore();

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      // Error handled in store
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.successEmoji}>📧</Text>
          <Text style={styles.successTitle}>E-posta Gönderildi!</Text>
          <Text style={styles.successText}>
            Şifre sıfırlama bağlantısı {email} adresine gönderildi.
            Lütfen gelen kutunuzu kontrol edin.
          </Text>
          <Button
            title="Giriş Sayfasına Dön"
            onPress={() => router.replace('/(auth)/login')}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>

        <Text style={styles.emoji}>🔑</Text>
        <Text style={styles.title}>Şifre Sıfırlama</Text>
        <Text style={styles.subtitle}>
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </Text>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>E-posta</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@email.com"
              placeholderTextColor={Colors.border}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <Button
          title="Sıfırlama Bağlantısı Gönder"
          onPress={handleReset}
          loading={isLoading}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  content: {
    gap: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.sage,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: '#FFF0E0',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.warningDark,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    color: Colors.textMid,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.creamDark,
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
    color: Colors.textDark,
  },
  successEmoji: {
    fontSize: 56,
    textAlign: 'center',
  },
  successTitle: {
    ...Typography.h2,
    textAlign: 'center',
    color: Colors.sage,
  },
  successText: {
    ...Typography.body,
    color: Colors.textMid,
    textAlign: 'center',
    lineHeight: 24,
  },
});
