import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";
import CustomSwitch from "@/components/ui/CustomSwitch";

// Mock Login Activity
const LOGIN_ACTIVITY = [
    { device: "iPhone 13 Pro", location: "Addis Ababa, ET", time: "Active now", icon: "phone-portrait-outline" },
    { device: "Chrome on Windows", location: "Addis Ababa, ET", time: "2 hours ago", icon: "laptop-outline" },
    { device: "Safari on Mac", location: "Nekemte, ET", time: "3 days ago", icon: "desktop-outline" },
];

export default function SecurityScreen() {
    const { colors, isDark } = useTheme();
    const [twoFactor, setTwoFactor] = useState(false);
    const [biometric, setBiometric] = useState(true);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title="Security"
                headerLeft={
                    <TouchableOpacity onPress={() => router.navigate("/admin/settings")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionTitle}>LOGIN SECURITY</Text>
                <View style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>

                    {/* Change Password */}
                    <TouchableOpacity style={styles.itemRow} onPress={() => router.push("/admin/change-password")}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="key-outline" size={20} color="#2196F3" />
                            </View>
                            <Text style={[styles.rowText, { color: colors.text }]}>Change Password</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />

                    {/* 2FA */}
                    <View style={styles.itemRow}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                                <Ionicons name="shield-checkmark-outline" size={20} color="#4CAF50" />
                            </View>
                            <View>
                                <Text style={[styles.rowText, { color: colors.text }]}>2-Step Verification</Text>
                                <Text style={[styles.subText, { color: colors.muted }]}>Extra layer of security</Text>
                            </View>
                        </View>
                        <CustomSwitch
                            value={twoFactor}
                            onValueChange={setTwoFactor}
                            scale={0.8}
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />

                    {/* Biometric */}
                    <View style={styles.itemRow}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="finger-print-outline" size={20} color="#9C27B0" />
                            </View>
                            <View>
                                <Text style={[styles.rowText, { color: colors.text }]}>Face ID / Touch ID</Text>
                                <Text style={[styles.subText, { color: colors.muted }]}>Fast and secure login</Text>
                            </View>
                        </View>
                        <CustomSwitch
                            value={biometric}
                            onValueChange={setBiometric}
                            scale={0.8}
                        />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>WHERE YOU'RE LOGGED IN</Text>
                <View style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    {LOGIN_ACTIVITY.map((session, index) => (
                        <View key={index}>
                            <View style={styles.sessionRow}>
                                <View style={[styles.deviceIcon, { backgroundColor: isDark ? '#333' : '#f5f5f5' }]}>
                                    <Ionicons name={session.icon as any} size={24} color={colors.text} />
                                </View>
                                <View style={styles.sessionInfo}>
                                    <Text style={[styles.deviceName, { color: colors.text }]}>{session.device}</Text>
                                    <Text style={[styles.deviceLocation, { color: colors.muted }]}>{session.location} • {session.time}</Text>
                                </View>
                                <TouchableOpacity>
                                    <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
                                </TouchableOpacity>
                            </View>
                            {index < LOGIN_ACTIVITY.length - 1 && (
                                <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#f0f0f0', marginLeft: 56 }]} />
                            )}
                        </View>
                    ))}
                </View>

            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 40,
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
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        marginBottom: 12,
        marginTop: 20,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowText: {
        fontSize: 16,
        fontWeight: '600',
    },
    subText: {
        fontSize: 12,
        marginTop: 2,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    deviceIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sessionInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 15,
        fontWeight: '600',
    },
    deviceLocation: {
        fontSize: 12,
        marginTop: 2,
    },
});
