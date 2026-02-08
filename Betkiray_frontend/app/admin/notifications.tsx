import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";

// Mock Notification Types
type NotificationType = "alert" | "info" | "success" | "message";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    time: string;
    type: NotificationType;
    read: boolean;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: "1",
        title: "New Property Listed",
        message: "A new 3-bedroom apartment in Bole has been submitted for approval.",
        time: "2m ago",
        type: "info",
        read: false,
    },
    {
        id: "2",
        title: "User Reported",
        message: "User 'Mikasa' has been reported for suspicious activity.",
        time: "15m ago",
        type: "alert",
        read: false,
    },
    {
        id: "3",
        title: "Payment Received",
        message: "Monthly subscription payment received from 'Esayas'.",
        time: "1h ago",
        type: "success",
        read: true,
    },
    {
        id: "4",
        title: "System Update",
        message: "The admin dashboard has been successfully updated to v2.0.",
        time: "1d ago",
        type: "info",
        read: true,
    },
    {
        id: "5",
        title: "New Message",
        message: "You have a new support message from 'Mubarek'.",
        time: "2d ago",
        type: "message",
        read: true,
    }
];

export default function AdminNotificationsScreen() {
    const { colors, isDark } = useTheme();
    const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "alert": return { name: "warning", color: "#FF3B30", bg: "rgba(255, 59, 48, 0.1)" };
            case "success": return { name: "checkmark-circle", color: "#34C759", bg: "rgba(52, 199, 89, 0.1)" };
            case "message": return { name: "chatbubble-ellipses", color: "#007AFF", bg: "rgba(0, 122, 255, 0.1)" };
            case "info":
            default: return { name: "notifications", color: "#FF9500", bg: "rgba(255, 149, 0, 0.1)" };
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const iconData = getIcon(item.type);

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    { backgroundColor: isDark ? colors.secondary : '#fff' },
                    !item.read && { borderLeftWidth: 4, borderLeftColor: iconData.color }
                ]}
                onPress={() => markAsRead(item.id)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
                    <Ionicons name={iconData.name as any} size={24} color={iconData.color} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, { color: colors.text, fontWeight: item.read ? '600' : '800' }]}>{item.title}</Text>
                        <Text style={[styles.time, { color: colors.muted }]}>{item.time}</Text>
                    </View>
                    <Text style={[styles.message, { color: isDark ? '#ccc' : '#666' }]} numberOfLines={2}>
                        {item.message}
                    </Text>
                </View>
                {!item.read && <View style={styles.dot} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title="Notifications"
                headerLeft={
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={48} color={colors.muted} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>No notifications</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'flex-start',
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
    },
    message: {
        fontSize: 14,
        lineHeight: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF3B30',
        position: 'absolute',
        top: 16,
        right: 16,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    backText: {
        fontSize: 18,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
});
