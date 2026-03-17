/**
 * Kaşık — Haptic Feedback Utility
 * Semantik dokunsal geri bildirim fonksiyonları
 * Web'de no-op (expo-haptics sadece native)
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const isNative = Platform.OS !== 'web';

export const haptics = {
  /** Like/unlike, bookmark toggle */
  light: () => {
    if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  /** Swipe threshold reached */
  medium: () => {
    if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },
  /** Button press, tab select */
  selection: () => {
    if (isNative) Haptics.selectionAsync();
  },
  /** Meal completed, success action */
  success: () => {
    if (isNative) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  /** Delete/remove action */
  warning: () => {
    if (isNative) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
};
