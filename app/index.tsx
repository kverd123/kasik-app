/**
 * Kaşık — Ana Yönlendirme
 * Kullanıcı durumuna göre doğru ekrana yönlendir
 */

import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useColors } from '../hooks/useColors';

export default function Index() {
  const colors = useColors();
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const baby = require('../stores/babyStore').useBabyStore((s: any) => s.baby);
  const [timeout, setTimeoutReached] = useState(false);

  // 5 saniye sonra hâlâ yükleniyorsa zorla login'e yönlendir
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading && !timeout) return;

    if (isAuthenticated && user) {
      // Onboarding tamamlanmışsa veya bebek profili varsa → ana ekrana git
      const onboardingDone = user.onboardingCompleted || baby?.name;
      if (!onboardingDone) {
        router.replace('/(onboarding)/welcome');
      } else {
        router.replace('/(tabs)/plan');
      }
    } else {
      router.replace('/(auth)/login');
    }
  }, [user, isLoading, isAuthenticated, timeout]);

  return (
    <View style={[styles.container, { backgroundColor: colors.cream }]}>
      <Text style={styles.logo}>🥄</Text>
      <Text style={[styles.title, { color: colors.sageDark }]}>Kaşık</Text>
      <ActivityIndicator size="large" color={colors.sage} style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
});
