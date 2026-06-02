import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';
import { Text } from 'react-native';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 21, opacity: focused ? 1 : 0.55 }}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: 'rgba(8,145,178,0.12)',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSoft,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ focused }) => <TabIcon emoji="💧" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
