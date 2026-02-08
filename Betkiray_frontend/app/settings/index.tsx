import React, { useState } from "react";
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import CustomSwitch from "@/components/ui/CustomSwitch";

// Mock User Data
const USER = {
    name: "Hamza Safi",
    email: "hamzasafi@gmail.com",
    image: "https://i.pravatar.cc/300?img=11",
};

export default function SettingsScreen() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const { theme, toggleTheme, isDark, colors } = useTheme();

    const renderSettingItem = (icon: any, label: string, type: 'toggle' | 'link' | 'value' = 'link', value?: any, onValueChange?: (val: boolean) => void) => (
        <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => {
                if (type === 'link') {
                    if (label === 'Language') router.push('/settings/language');
                    if (label === 'Terms & Conditions') router.push('/settings/terms');
                    if (label === 'Privacy Policy') router.push('/settings/privacy');
                    if (label === 'Community Guidelines') router.push('/settings/community');
                    if (label === 'Change Password') router.push('/settings/change-password');
                    if (label === 'Feedback') router.push('/settings/feedback');
                } else if (type === 'toggle' && onValueChange && value !== undefined) {
                    onValueChange(!value);
                }
            }}
        >
            <View style={styles.settingLeft}>
                <Ionicons name={icon} size={22} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
            </View>

            {type === 'toggle' && (
                <View pointerEvents="none">
                    <CustomSwitch
                        value={value}
                        onValueChange={onValueChange || (() => { })}
                        scale={0.8}
                    />
                </View>
            )}

            {type === 'link' && (
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Profile Card */}
                <TouchableOpacity style={[styles.profileCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.push('/profile/edit')}>
                    <Image source={{ uri: USER.image }} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text style={[styles.profileName, { color: colors.text }]}>{USER.name}</Text>
                        <Text style={styles.profileEmail}>{USER.email}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                </TouchableOpacity>

                {/* Group 1 */}
                <View style={[styles.sectionCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    {renderSettingItem("notifications-outline", "Push Notifications", "toggle", pushEnabled, setPushEnabled)}
                    <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />
                    {renderSettingItem("moon-outline", "Dark mode", "toggle", isDark, toggleTheme)}
                    <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />
                    {renderSettingItem("text-outline", "Language", "link")}
                </View>

                {/* Group 2 */}
                <View style={[styles.sectionCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    {renderSettingItem("information-circle-outline", "Terms & Conditions", "link")}
                    <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />
                    {renderSettingItem("shield-checkmark-outline", "Privacy Policy", "link")}
                    <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />
                    {renderSettingItem("people-outline", "Community Guidelines", "link")}
                </View>

                {/* Group 3 */}
                <View style={[styles.sectionCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    {renderSettingItem("lock-closed-outline", "Change Password", "link")}
                    <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />
                    {renderSettingItem("chatbox-ellipses-outline", "Feedback", "link")}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                    <TouchableOpacity style={styles.logoutBtn}>
                        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F2F2F2" },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    profileCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20
    },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ddd' },
    profileInfo: { flex: 1, marginLeft: 16 },
    profileName: { fontSize: 16, fontWeight: '700', color: '#000' },
    profileEmail: { fontSize: 13, color: '#888', marginTop: 2 },

    sectionCard: {
        backgroundColor: '#fff', borderRadius: 20, paddingVertical: 8, marginBottom: 20
    },
    settingRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20
    },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingIcon: { width: 24 },
    settingLabel: { fontSize: 15, fontWeight: '600', color: '#000' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 56, marginRight: 20 },

    // switch: { transform: [{ scale: 0.8 }] }, // Removed as scaling is handled in component

    footer: { alignItems: 'center', marginTop: 20 },
    versionText: { color: '#888', marginBottom: 20 },
    logoutBtn: {
        flexDirection: 'row', backgroundColor: '#000', borderRadius: 30, width: '100%', paddingVertical: 16, justifyContent: 'center', alignItems: 'center'
    },
    logoutText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});
