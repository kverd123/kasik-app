/**
 * Kaşık — SwipeableRow
 * Sola kaydırarak silme aksiyonu sunan satır bileşeni
 * react-native-gesture-handler + react-native-reanimated kullanır
 * Web'de kaydırma yerine görünür silme butonu gösterir
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing, BorderRadius } from '../../constants/theme';
import { haptics } from '../../lib/haptics';

interface SwipeableRowProps {
  onDelete: () => void;
  children: React.ReactNode;
  deleteLabel?: string;
}

// Web fallback — no swipe, show visible delete button
function SwipeableRowWeb({ onDelete, children, deleteLabel = 'Sil' }: SwipeableRowProps) {
  const colors = useColors();

  return (
    <View style={webStyles.container}>
      <View style={webStyles.content}>{children}</View>
      <TouchableOpacity
        style={[webStyles.deleteBtn, { backgroundColor: colors.creamDark }]}
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Sil"
      >
        <Text style={webStyles.deleteBtnText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

// Native — swipeable with gesture handler
function SwipeableRowNative({ onDelete, children, deleteLabel = 'Sil' }: SwipeableRowProps) {
  const colors = useColors();

  // Lazy imports to avoid web bundling issues
  const {
    Gesture,
    GestureDetector,
  } = require('react-native-gesture-handler');
  const Animated = require('react-native-reanimated');
  const {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
  } = Animated;

  const DELETE_THRESHOLD = -80;
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e: any) => {
      // Only allow left swipe
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -120);
      }
    })
    .onEnd((e: any) => {
      if (e.translationX < DELETE_THRESHOLD) {
        // Keep open showing delete button
        translateX.value = withSpring(-100, { damping: 20, stiffness: 200 });
        runOnJS(haptics.medium)();
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleDelete = () => {
    haptics.warning();
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    onDelete();
  };

  return (
    <View style={nativeStyles.container}>
      {/* Delete action behind */}
      <View style={nativeStyles.deleteAction}>
        <TouchableOpacity
          style={[nativeStyles.deleteBtn, { backgroundColor: colors.heart }]}
          onPress={handleDelete}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sil"
        >
          <Text style={nativeStyles.deleteIcon}>🗑️</Text>
          <Text style={[nativeStyles.deleteText, { color: colors.white }]}>{deleteLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Swipeable content */}
      <GestureDetector gesture={panGesture}>
        <Animated.default.View style={[nativeStyles.content, { backgroundColor: colors.cream }, animatedStyle]}>
          {children}
        </Animated.default.View>
      </GestureDetector>
    </View>
  );
}

// Export the right version based on platform
export function SwipeableRow(props: SwipeableRowProps) {
  if (Platform.OS === 'web') {
    return <SwipeableRowWeb {...props} />;
  }
  return <SwipeableRowNative {...props} />;
}

// Web styles
const webStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  deleteBtnText: {
    fontSize: 14,
  },
});

// Native styles
const nativeStyles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: BorderRadius.lg,
  },
  deleteAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    gap: 2,
  },
  deleteIcon: {
    fontSize: 18,
  },
  deleteText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
  },
  content: {},
});
