// app/(admin)/_layout.tsx
import { useUser } from "@/contexts/UserContext";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, Platform, UIManager, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from 'expo-blur';
import { useTheme } from "@/contexts/ThemeContext";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");
// Admin has 4 visible tabs usually: Dashboard, Properties, Users, Settings
const TAB_BAR_WIDTH_PERCENT = 0.9;
const TAB_BAR_WIDTH = width * TAB_BAR_WIDTH_PERCENT; // Matches container width approx if logic similar
// Actually logic in Admin was slightly different, let's look at styles.
// styles.tabBar width is '100%'. Container has 20 left/right margin.
// So Width is width - 40.
const ADMIN_TAB_BAR_WIDTH = width - 40;
// We have 4 items.
const TAB_ITEM_WIDTH = ADMIN_TAB_BAR_WIDTH / 4;

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { colors, isDark } = useTheme();

  // Check if current route should hide tab bar
  const activeRoute = state.routes[state.index];
  const { options } = descriptors[activeRoute.key];
  if ((options.tabBarStyle as any)?.display === "none") {
    return null;
  }

  // Filter out hidden routes
  const hiddenRoutes = ['feedback', 'notifications', 'roles', 'security', 'change-password', 'edit-role', 'approvals', 'earnings'];
  const visibleRoutes = state.routes.filter((route: any) => !hiddenRoutes.includes(route.name));

  const activeIndex = visibleRoutes.findIndex((r: any) => r.key === activeRoute.key);

  const translateX = useSharedValue(0);

  useEffect(() => {
    // Only animate if valid index (e.g. didn't navigate to hidden route)
    if (activeIndex !== -1) {
      translateX.value = withSpring(activeIndex * TAB_ITEM_WIDTH, {
        damping: 15,
        stiffness: 100,
      });
    }
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.tabBarContainer}>
      <BlurView
        intensity={80}
        tint={isDark ? "dark" : "light"}
        style={[styles.tabBar, {
          backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.3)',
          borderRadius: 40, // Ensure radius
        }]}
      >
        {/* Animated Pill Indicator */}
        {activeIndex !== -1 && (
          <Animated.View
            style={[
              styles.activeIndicatorContainer,
              {
                width: TAB_ITEM_WIDTH,
              },
              animatedStyle
            ]}
          >
            <View style={[
              styles.activeIndicator,
              {
                backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }
            ]} />
          </Animated.View>
        )}

        {visibleRoutes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = activeIndex === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const iconName = route.name === 'index' ? 'home' :
            route.name === 'properties' ? 'business' :
              route.name === 'users' ? 'people' : 'settings';

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tabItem, { width: TAB_ITEM_WIDTH }]}
            >
              <Ionicons
                name={isFocused ? iconName : `${iconName}-outline` as any}
                size={22}
                color={isFocused ? (isDark ? "#FFF" : "#000") : (isDark ? "#AAA" : "#999")}
              />
              {/* <Text style={[styles.tabLabel, {
                opacity: isFocused ? 1 : 0.7,
                color: isFocused ? (isDark ? "#FFF" : "#000") : (isDark ? "#AAA" : "#999")
              }]}>
                {label}
              </Text> */}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

export default function AdminLayout() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: "Properties",
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
      {/* Hidden tabs / Detail Pages */}
      <Tabs.Screen
        name="feedback"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="roles"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="edit-role"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="approvals"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 40,
    paddingVertical: 10, // Changed to vertical padding to match user nav style
    paddingHorizontal: 0, // Reset horizontal padding as we calculate widths exactly
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
    // justifyContent: 'space-between', // Removed for absolute positioning logic
    alignItems: 'center', // Align items center
    overflow: 'hidden',
    borderWidth: 1,
    height: 70, // Fixed height similar to user nav
  },
  tabItem: {
    // flex: 1, // Removed flex 1
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    gap: 4
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeIndicatorContainer: {
    position: 'absolute',
    height: 50,
    zIndex: 1,
    left: 0, // Start from left edge of container (adjust if there's padding in container)
    // Actually, if we have no padding in container, this is fine.
    // If we want to be safe, we should check padding.
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    width: '85%', // Slightly narrower than item
    height: '100%',
    borderRadius: 30,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
