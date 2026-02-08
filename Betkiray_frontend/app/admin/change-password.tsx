import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";

export default function ChangePasswordScreen() {
    const { colors, isDark } = useTheme();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleUpdate = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }
        // Mock API Call
        setTimeout(() => {
            Alert.alert("Success", "Password updated successfully", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }, 500);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title="Change Password"
                headerLeft={
                    <TouchableOpacity onPress={() => router.navigate("/admin/security")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.secondary : '#f5f5f5' }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.muted} style={{ marginRight: 10 }} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                secureTextEntry={!showPassword}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter current password"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.secondary : '#f5f5f5' }]}>
                            <Ionicons name="key-outline" size={20} color={colors.muted} style={{ marginRight: 10 }} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                secureTextEntry={!showPassword}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.secondary : '#f5f5f5' }]}>
                            <Ionicons name="key-outline" size={20} color={colors.muted} style={{ marginRight: 10 }} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                placeholderTextColor={colors.muted}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.checkboxContainer} onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "checkbox" : "square-outline"} size={20} color={colors.text} />
                        <Text style={[styles.checkboxText, { color: colors.text }]}>Show Password</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
                        <Text style={styles.updateBtnText}>Update Password</Text>
                    </TouchableOpacity>
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
    formContainer: {
        marginTop: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        marginLeft: 4,
    },
    checkboxText: {
        marginLeft: 8,
        fontWeight: '500',
    },
    updateBtn: {
        backgroundColor: '#000',
        borderRadius: 30,
        paddingVertical: 18,
        alignItems: 'center',
    },
    updateBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
