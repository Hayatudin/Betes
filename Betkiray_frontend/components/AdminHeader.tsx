import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

import { router } from "expo-router";

interface AdminHeaderProps {
    title?: string;
    headerLeft?: React.ReactNode;
    showAvatar?: boolean;
    userImage?: string | null;
}

export default function AdminHeader({ title, headerLeft, showAvatar, userImage }: AdminHeaderProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={styles.content}>
                {headerLeft ? (
                    headerLeft
                ) : (
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                )}

                <View style={styles.rightContainer}>
                    <TouchableOpacity
                        style={[styles.notificationBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]}
                        onPress={() => router.push("/admin/notifications")}
                    >
                        <Ionicons name="notifications-outline" size={24} color={colors.text} />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    {showAvatar && (
                        <Image
                            source={{ uri: userImage || "https://i.pravatar.cc/150?img=12" }}
                            style={styles.avatar}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 40 : 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    content: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30', // Red dot
        borderWidth: 1,
        borderColor: '#fff',
    },
});
