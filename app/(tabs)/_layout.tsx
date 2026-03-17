/**
 * Kasik — Tab Navigation Layout
 * 5 tabs: Plan · Tarifler · Dolap · Topluluk · Profil
 */

import { Tabs } from 'expo-router';
import { Text, StyleSheet, View } from 'react-native';
import { useColors } from '../../hooks/useColors';
import { FontFamily, FontSize, Spacing } from '../../constants/theme';
import { analytics } from '../../lib/analytics';
import SyncStatusIndicator from '../../components/ui/SyncStatusIndicator';

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && { backgroundColor: colors.sagePale }]}>
        <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      </View>
      <Text
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
        tabBarStyle: [styles.tabBar, { backgroundColor: colors.white, borderTopColor: colors.creamDark }],
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
            <TabIcon icon="📋" label="Plan" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="📖" label="Tarifler" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="🗄️" label="Dolap" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👥" label="Topluluk" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon="👤" label="Profil" focused={focused} />
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
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
  },
});
