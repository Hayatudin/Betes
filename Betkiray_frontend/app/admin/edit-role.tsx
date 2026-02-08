import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router, useLocalSearchParams } from "expo-router";
import CustomSwitch from "@/components/ui/CustomSwitch";

const PERMISSIONS_LIST = [
    { id: "1", label: "Access Dashboard" },
    { id: "2", label: "Manage Users" },
    { id: "3", label: "Approve Listings" },
    { id: "4", label: "Delete Content" },
    { id: "5", label: "View Analytics" },
    { id: "6", label: "Manage Settings" },
];

export default function EditRoleScreen() {
    const { colors, isDark } = useTheme();
    // In a real app we'd fetch role data based on ID
    const { roleId } = useLocalSearchParams();
    const displayTitle = roleId ? `${roleId.toString().charAt(0).toUpperCase() + roleId.toString().slice(1)}` : "Role";

    const [permissions, setPermissions] = useState<string[]>(["1", "3", "5"]);

    const togglePermission = (id: string) => {
        if (permissions.includes(id)) {
            setPermissions(permissions.filter(p => p !== id));
        } else {
            setPermissions([...permissions, id]);
        }
    };

    const handleSave = () => {
        Alert.alert("Success", "Permissions updated successfully", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title={`Edit ${displayTitle}`}
                headerLeft={
                    <TouchableOpacity onPress={() => router.navigate("/admin/roles")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={[styles.infoCard, { backgroundColor: isDark ? colors.secondary : '#E3F2FD' }]}>
                    <Ionicons name="information-circle-outline" size={24} color="#2196F3" />
                    <Text style={[styles.infoText, { color: isDark ? '#ddd' : '#1976D2' }]}>
                        Updating permissions will affect all users assigned to this role immediately.
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.muted }]}>PERMISSIONS</Text>
                <View style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    {PERMISSIONS_LIST.map((perm, index) => (
                        <View key={perm.id}>
                            <View style={styles.permRow}>
                                <Text style={[styles.permLabel, { color: colors.text }]}>{perm.label}</Text>
                                <CustomSwitch
                                    value={permissions.includes(perm.id)}
                                    onValueChange={() => togglePermission(perm.id)}
                                    scale={0.9} // Slight scale down if needed
                                />
                            </View>
                            {index < PERMISSIONS_LIST.length - 1 && (
                                <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]} />
                            )}
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>

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
    infoCard: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        gap: 12,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 30,
    },
    permRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    permLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        width: '100%',
    },
    saveBtn: {
        backgroundColor: '#000',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
