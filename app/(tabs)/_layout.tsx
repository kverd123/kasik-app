/**
 * Kasik — Tab Navigation Layout
 * 5 tabs: Plan · Tarifler · Dolap · Topluluk · Profil
 */

import { Tabs } from 'expo-router';
import { Text, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../hooks/useColors';
import { FontFamily, Spacing } from '../../constants/theme';
import { analytics } from '../../lib/analytics';
import SyncStatusIndicator from '../../components/ui/SyncStatusIndicator';
import { useEffect, useRef } from 'react';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  iconName: IoniconsName;
  iconNameFocused: IoniconsName;
  label: string;
  focused: boolean;
}

function TabIcon({ iconName, iconNameFocused, label, focused }: TabIconProps) {
  const colors = useColors();
  const scaleX = useRef(new Animated.Value(focused ? 1.27 : 1)).current;
  const bgOpacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleX, {
        toValue: focused ? 1.27 : 1,
        useNativeDriver: true,
        speed: 16,
        bounciness: 4,
      }),
      Animated.timing(bgOpacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={styles.tabItem}>
      <Animated.View
        style={[
          styles.iconWrap,
          {
            transform: [{ scaleX }],
          },
        ]}
      >
        {/* Background pill — fades in/out */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: colors.sagePale,
              borderRadius: 16,
              opacity: bgOpacity,
            },
          ]}
        />
        <Ionicons
          name={focused ? iconNameFocused : iconName}
          size={22}
          color={focused ? colors.sageDark : colors.textLight}
        />
      </Animated.View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
        style={[
          styles.tabLabel,
          { color: colors.textLight },
          focused && { fontFamily: FontFamily.semiBold, color: colors.sageDark },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const colors = useColors();
  return (
    <>
      <SyncStatusIndicator />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.white,
              borderTopColor: colors.creamDark,
            },
          ],
          tabBarShowLabel: false,
        }}
        screenListeners={{
          tabPress: (e) => {
            const screenName = e.target?.split('-')[0] || 'unknown';
            analytics.screenView(screenName);
          },
        }}
      >
        <Tabs.Screen
          name="plan"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                iconName="calendar-outline"
                iconNameFocused="calendar"
                label="Plan"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="recipes"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                iconName="book-outline"
                iconNameFocused="book"
                label="Tarifler"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="pantry"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                iconName="basket-outline"
                iconNameFocused="basket"
                label="Dolap"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                iconName="people-outline"
                iconNameFocused="people"
                label="Topluluk"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                iconName="person-outline"
                iconNameFocused="person"
                label="Profil"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 84,
    paddingTop: 6,
    paddingBottom: 20,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
    minWidth: 60,
  },
  iconWrap: {
    height: 32,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
  },
});
