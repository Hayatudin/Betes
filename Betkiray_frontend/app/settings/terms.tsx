import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function TermsScreen() {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Terms & Conditions</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Introduction</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Welcome to Betkiray. By using our app, you agree to these terms. Please read them carefully.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>2. Use of Services</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        You must be at least 18 years old to use this app. You agree not to use our services for any illegal activities.
                        {"\n\n"}
                        We reserve the right to suspend your account if you violate these rules.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>3. User Content</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Any content you post (photos, descriptions) remains your property, but you grant us a license to display it.
                        You are responsible for the accuracy of your listings.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Bookings & Payments</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        All payments are processed securely. Cancellations are subject to the host's policy selected at booking.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Limitation of Liability</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Betkiray is not liable for any damages arising from your use of the app or any rental agreements made through it.
                    </Text>

                    <Text style={[styles.footerText, { color: colors.muted }]}>
                        Last updated: January 2026
                    </Text>
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
    content: { padding: 20, paddingBottom: 40 },
    card: {
        borderRadius: 20,
        padding: 24,
    },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
    text: { fontSize: 15, lineHeight: 24, opacity: 0.8 },
    footerText: { fontSize: 13, marginTop: 40, textAlign: 'center', fontStyle: 'italic' }
});
