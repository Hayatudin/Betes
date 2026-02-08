import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function ChangePasswordScreen() {
    const { colors, isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const handleChangePassword = () => {
        if (!currentPass || !newPass || !confirmPass) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        if (newPass !== confirmPass) {
            Alert.alert("Error", "New passwords do not match");
            return;
        }
        if (newPass.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Your password has been updated successfully", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }, 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Change Password</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.description, { color: colors.muted }]}>
                    Your new password must be different from previous used passwords.
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.secondary : '#fff', borderColor: isDark ? colors.border : '#E0E0E0' }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter current password"
                                placeholderTextColor={colors.muted}
                                secureTextEntry
                                value={currentPass}
                                onChangeText={setCurrentPass}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.secondary : '#fff', borderColor: isDark ? colors.border : '#E0E0E0' }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter new password"
                                placeholderTextColor={colors.muted}
                                secureTextEntry
                                value={newPass}
                                onChangeText={setNewPass}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: isDark ? colors.secondary : '#fff', borderColor: isDark ? colors.border : '#E0E0E0' }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Confirm new password"
                                placeholderTextColor={colors.muted}
                                secureTextEntry
                                value={confirmPass}
                                onChangeText={setConfirmPass}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: isDark ? '#fff' : '#000', opacity: loading ? 0.7 : 1 }]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={isDark ? '#000' : '#fff'} />
                        ) : (
                            <Text style={[styles.submitBtnText, { color: isDark ? '#000' : '#fff' }]}>Update Password</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    content: { padding: 20 },
    description: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12
    },
    input: { flex: 1, fontSize: 16 },
    submitBtn: {
        height: 56,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    submitBtnText: { fontSize: 16, fontWeight: 'bold' }
});
