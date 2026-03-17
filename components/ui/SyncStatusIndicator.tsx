/**
 * Kaşık — Sync Status Indicator
 * Shows sync status badge when offline or pending writes exist.
 * Hidden when fully synced.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSyncStore, SyncStatus } from '../../stores/syncStore';
import { useColors } from '../../hooks/useColors';

export default function SyncStatusIndicator() {
  const colors = useColors();
  const { status, pendingCount } = useSyncStore();

  if (status === 'synced') return null;

  const STATUS_CONFIG: Record<Exclude<SyncStatus, 'synced'>, { label: string; bg: string; text: string; icon: string }> = {
    offline: {
      label: 'Çevrimdışı',
      bg: colors.dangerBg,
      text: colors.dangerDark,
      icon: '📡',
    },
    pending: {
      label: 'bekliyor',
      bg: colors.warningBg,
      text: colors.warningDark,
      icon: '🔄',
    },
  };

  const config = STATUS_CONFIG[status];
  const label = status === 'pending' ? `${pendingCount} ${config.label}` : config.label;

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={[styles.text, { color: config.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 4,
  },
  icon: {
    fontSize: 12,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
