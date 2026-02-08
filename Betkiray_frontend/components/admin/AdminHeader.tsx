import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

interface AdminHeaderProps {
    title?: string;
    showAvatar?: boolean;
    userImage?: string;
    rightAction?: React.ReactNode;
    headerLeft?: React.ReactNode;
}

export default function AdminHeader({ title, showAvatar = false, userImage, rightAction, headerLeft }: AdminHeaderProps) {
    const { colors, isDark } = useTheme();
    const router = useRouter();

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
                {/* Left Content OR Centered Title */}
                {headerLeft ? (
                    <View style={styles.leftContainer}>
                        {headerLeft}
                    </View>
                ) : (
                    <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                )}

                {/* Right Side Actions */}
                <View style={styles.rightContainer}>
                    <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? colors.secondary : '#FFF' }]}>
                        <Ionicons name="notifications-outline" size={24} color={colors.text} />
                    </TouchableOpacity>

                    {showAvatar && (
                        <Image
                            source={{ uri: userImage || "https://i.pravatar.cc/150?img=12" }}
                            style={styles.avatar}
                        />
                    )}

                    {rightAction}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        justifyContent: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center title by default relative to the row
        position: 'relative',
        height: 44,
    },
    leftContainer: {
        position: 'absolute',
        left: 0,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    rightContainer: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        // Slight shadow for depth if needed, matching previous styles
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 44, // Match icon button size
        height: 44,
        borderRadius: 22,
    },
});
