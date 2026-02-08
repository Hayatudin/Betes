import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function FeedbackScreen() {
    const { colors, isDark } = useTheme();
    const [feedback, setFeedback] = useState("");
    const [category, setCategory] = useState("Suggestion");

    const handleSubmit = () => {
        if (!feedback.trim()) {
            Alert.alert("Empty", "Please enter your feedback first.");
            return;
        }
        Alert.alert("Thank You", "Your feedback has been sent successfully!", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    const CATEGORIES = ["Suggestion", "Bug Report", "Other"];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Send Feedback</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={[styles.label, { color: colors.text }]}>What kind of feedback is this?</Text>
                    <View style={styles.categories}>
                        {CATEGORIES.map(cat => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    category === cat
                                        ? { backgroundColor: isDark ? '#fff' : '#000' }
                                        : { backgroundColor: isDark ? colors.secondary : '#fff', borderWidth: 1, borderColor: isDark ? colors.border : '#e0e0e0' }
                                ]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    category === cat ? { color: isDark ? '#000' : '#fff' } : { color: colors.text }
                                ]}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.label, { color: colors.text, marginTop: 24 }]}>Tell us more</Text>
                    <View style={[styles.textAreaContainer, { backgroundColor: isDark ? colors.secondary : '#fff', borderColor: isDark ? colors.border : '#E0E0E0' }]}>
                        <TextInput
                            style={[styles.textArea, { color: colors.text }]}
                            multiline
                            placeholder="Type your feedback here..."
                            placeholderTextColor={colors.muted}
                            value={feedback}
                            onChangeText={setFeedback}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: isDark ? '#fff' : '#000' }]}
                        onPress={handleSubmit}
                    >
                        <Text style={[styles.submitBtnText, { color: isDark ? '#000' : '#fff' }]}>Send Feedback</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
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
    label: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
    categories: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    chipText: { fontWeight: '600', fontSize: 14 },
    textAreaContainer: {
        height: 200,
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        marginTop: 8
    },
    textArea: { flex: 1, fontSize: 16, lineHeight: 24 },
    submitBtn: {
        height: 56,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    submitBtnText: { fontSize: 16, fontWeight: 'bold' }
});
