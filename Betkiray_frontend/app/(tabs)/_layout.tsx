import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Platform, UIManager, Dimensions, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get("window");
// 4 tabs + 1 middle button space = 5 items distributed? 
// Actually the previous design had 5 tabs including 'add'.
// If 'add' is a special button, we treat it as an index but maybe skip the slider for it?
// Let's assume the slider jumps over it or we treat it as 5 equal slots.
const TAB_BAR_WIDTH_PERCENT = 0.9; // 90%
const TAB_BAR_WIDTH = width * TAB_BAR_WIDTH_PERCENT; // 20 20 margins
const TAB_ITEM_WIDTH = (TAB_BAR_WIDTH - 20) / 5; // 5 items

const CustomTabBarButton = ({ onPress, children, isDark, colors }: any) => (
  <TouchableOpacity style={styles.customTabButton} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.customTabButtonInner, { backgroundColor: isDark ? colors.text : "#000000" }]}>
      {children}
    </View>
  </TouchableOpacity>
);

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { isDark, colors } = useTheme();
  // Filter out any hidden routes if necessary, but here we assume standard 5
  // index, saved, add, messages, profile
  const visibleRoutes = state.routes;
  const activeIndex = state.index;

  const translateX = useSharedValue(0);

  useEffect(() => {
    // Determine target position based on activeIndex
    // index 0 -> 0 * width
    // index 1 -> 1 * width
    // index 2 (add) -> 2 * width (but we might want to hide pill here?)
    // index 3 -> 3 * width
    // index 4 -> 4 * width
    translateX.value = withSpring(activeIndex * TAB_ITEM_WIDTH, {
      damping: 15,
      stiffness: 100,
    });
  }, [activeIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Hide tab bar on Add Property screen if needed, though usually handled by route options
  if (visibleRoutes[activeIndex]?.name === 'add') {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      <BlurView
        intensity={90}
        tint={isDark ? "dark" : "light"}
        style={[styles.tabBar, {
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
          backgroundColor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
          overflow: 'hidden', // Ensure blur doesn't bleed, but might clip shadows. 
          // To fix "low opacity box" at edges, we ensure borderRadius matches and no outer container bg.
          borderRadius: 40,
        }]}
      >
        {/* Animated Pill Indicator */}
        {visibleRoutes[activeIndex].name !== 'add' && (
          <Animated.View
            style={[
              styles.activeIndicatorContainer,
              {
                width: TAB_ITEM_WIDTH,
              },
              animatedStyle
            ]}
          >
            {/* Inner "Glass" Pill */}
            <View style={[
              styles.activeIndicator,
              {
                backgroundColor: isDark ? "rgba(255,255,255,0.15)" : "#FFFFFF",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }
            ]}>
              {/* Optional: Add a subtle BlurView inside if we really want "glass" see-through 
                  but user image looks like solid white lifted card on light mode. 
                  Let's stick to "Premium Glass/Plastic" look: 
                  Light: Solid White + Shadow
                  Dark: Translucent White + Shadow
              */}
            </View>
          </Animated.View>
        )}

        {visibleRoutes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
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

          if (route.name === 'add') {
            return (
              <View key={route.key} style={[styles.tabItem, { width: TAB_ITEM_WIDTH }]}>
                <CustomTabBarButton
                  onPress={onPress}
                  isDark={isDark}
                  colors={colors}
                >
                  <Ionicons name="add" size={26} color={isDark ? colors.background : "#ffffff"} />
                </CustomTabBarButton>
              </View>
            );
          }

          const iconName =
            route.name === 'index' ? 'home' :
              route.name === 'saved' ? 'heart' :
                route.name === 'messages' ? 'chatbubble-ellipses' :
                  'person';

          const label =
            route.name === 'index' ? 'Home' :
              route.name === 'saved' ? 'Favorite' :
                route.name === 'messages' ? 'Chat' :
                  'Profile';

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
                color={isFocused ? (isDark ? "#fff" : "#000") : (isDark ? "#999" : "#888")}
                style={{ marginBottom: 4 }}
              />
              {/* <Text style={{
                fontSize: 10,
                fontWeight: '600',
                color: isFocused ? (isDark ? "#fff" : "#000") : (isDark ? "#999" : "#888")
              }}>
                {label}
              </Text> */}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

export default function TabLayout() {
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
          title: "Home",
          tabBarLabel: "Home"
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Favorite",
          tabBarLabel: "Favorite"
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Chat",
          tabBarLabel: "Chat"
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile"
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
    // Removed margins that caused artifacts?
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '100%',
    height: 70,
    alignItems: 'center',
    borderWidth: 1, // subtle border
    // Shadow for the whole bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  activeIndicatorContainer: {
    position: 'absolute',
    height: 50,
    zIndex: 1,
    left: 10, // Match padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIndicator: {
    width: '90%', // Slightly narrower than item
    height: '100%',
    borderRadius: 30,
    borderWidth: 1,
    // Soft Shadow for Glass Effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, // Subtle
    shadowRadius: 8,
    elevation: 4,
  },
  customTabButton: {
    justifyContent: "center",
    alignItems: "center",
    // top: -15, // Removed to center in nav bar as requested
  },
  customTabButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

