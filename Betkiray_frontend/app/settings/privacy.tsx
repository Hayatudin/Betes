import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function PrivacyScreen() {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Information We Collect</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        We collect information you provide directly to us, such as when you create an account, list a property, or communicate with other users. This may include your name, email, phone number, and payment info.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>2. How We Use Your Data</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        - To facilitate bookings and payments.{'\n'}
                        - To improve our services and support.{'\n'}
                        - To communicate with you about updates or offers.{'\n'}
                        - To prevent fraud and ensure safety.
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>3. Data Sharing</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        We do not sell your personal data. We may share data with hosts/guests only as necessary to complete a booking, or with third-party service providers (e.g., payment processors).
                    </Text>

                    <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Security</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        We implement reasonable security measures to protect your information, though no method of transmission is 100% secure.
                    </Text>

                    <Text style={[styles.footerText, { color: colors.muted }]}>
                        Contact us at privacy@betkiray.com
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
