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
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function ForgotPasswordScreen() {
  const colors = useColors();
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
      <View style={[styles.container, { backgroundColor: colors.cream }]}>
        <View style={styles.content}>
          <View style={[styles.successIconCircle, { backgroundColor: colors.sagePale }]}>
            <Ionicons name="mail" size={48} color={colors.sage} />
          </View>
          <Text style={[styles.successTitle, { color: colors.sage }]}>E-posta Gönderildi!</Text>
          <Text style={[styles.successText, { color: colors.textMid }]}>
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
    <View style={[styles.container, { backgroundColor: colors.cream }]}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backRow}>
            <Ionicons name="arrow-back" size={20} color={colors.sage} />
            <Text style={[styles.backText, { color: colors.sage }]}>Geri</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.iconCircle, { backgroundColor: colors.sagePale }]}>
          <Ionicons name="key-outline" size={40} color={colors.sage} />
        </View>
        <Text style={styles.title}>Şifre Sıfırlama</Text>
        <Text style={[styles.subtitleText, { color: colors.textLight }]}>
          E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
        </Text>

        {error && (
          <View style={[styles.errorBanner, { backgroundColor: colors.warningBg }]}>
            <Ionicons name="warning-outline" size={18} color={colors.warningDark} />
            <Text style={[styles.errorText, { color: colors.warningDark }]}> {error}</Text>
          </View>
        )}

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
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  content: {
    gap: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    ...Typography.h2,
    textAlign: 'center',
  },
  subtitleText: {
    ...Typography.bodySmall,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBanner: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    flex: 1,
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
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  successTitle: {
    ...Typography.h2,
    textAlign: 'center',
  },
  successText: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
});
