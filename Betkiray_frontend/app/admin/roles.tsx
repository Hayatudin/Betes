import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";

// Mock Roles Data
const ROLES = [
    {
        id: "owner",
        title: "Property Owner",
        description: "Can list properties, manage availability, and view analytics.",
        permissions: ["List Properties", "Manage Availability", "View Analytics"],
    },
    {
        id: "renter",
        title: "Renter",
        description: "Can search properties, save favorites, and contact owners.",
        permissions: ["Search Properties", "Contact Owners", "Rate Stays"],
    },
    {
        id: "admin",
        title: "Administrator",
        description: "Full access to manage users, content, and system settings.",
        permissions: ["Manage Users", "Approve Listings", "System Settings", "Ban Accounts"],
    }
];

export default function RolesPermissionsScreen() {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title="Roles & Permissions"
                headerLeft={
                    <TouchableOpacity onPress={() => router.navigate("/admin/settings")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.description, { color: colors.muted }]}>
                    Define default permissions for different user roles within the platform.
                </Text>

                {ROLES.map((role) => (
                    <View key={role.id} style={[styles.roleCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                        <View style={styles.roleHeader}>
                            <View style={styles.roleIconContainer}>
                                <Ionicons
                                    name={role.id === 'admin' ? "shield-checkmark" : role.id === 'owner' ? "business" : "person"}
                                    size={24}
                                    color={isDark ? '#fff' : '#000'}
                                />
                            </View>
                            <View style={styles.roleTitleContainer}>
                                <Text style={[styles.roleTitle, { color: colors.text }]}>{role.title}</Text>
                                <Text style={[styles.roleDesc, { color: colors.muted }]}>{role.description}</Text>
                            </View>
                        </View>

                        <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />

                        <View style={styles.permissionsList}>
                            {role.permissions.map((perm, index) => (
                                <View key={index} style={styles.permItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                    <Text style={[styles.permText, { color: colors.text }]}>{perm}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.editBtn} onPress={() => router.push({ pathname: "/admin/edit-role", params: { roleId: role.id } })}>
                            <Text style={styles.editBtnText}>Edit Permissions</Text>
                        </TouchableOpacity>
                    </View>
                ))}

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
    description: {
        fontSize: 14,
        marginBottom: 24,
        lineHeight: 20,
    },
    roleCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    roleHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    roleIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    roleTitleContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    roleDesc: {
        fontSize: 13,
        lineHeight: 18,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    permissionsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    permItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.03)',
    },
    permText: {
        fontSize: 12,
        fontWeight: '500',
    },
    editBtn: {
        alignSelf: 'flex-start',
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
    },
    editBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
