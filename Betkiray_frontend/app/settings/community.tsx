import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const GUIDELINES = [
    { icon: 'heart-outline', title: 'Be Respectful', desc: 'Treat everyone with respect. Discrimination or harassment is not tolerated.' },
    { icon: 'shield-checkmark-outline', title: 'Stay Safe', desc: 'Keep communication and payments within the app to stay protected.' },
    { icon: 'images-outline', title: 'Accurate Listings', desc: 'Photos and descriptions must accurately reflect the property.' },
    { icon: 'time-outline', title: 'Be Responsive', desc: 'Respond to booking requests and messages in a timely manner.' },
    { icon: 'home-outline', title: 'Respect Property', desc: 'Guests should leave properties in the condition they found them.' },
];

export default function CommunityScreen() {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Community Guidelines</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.intro}>
                    <Text style={[styles.subText, { color: colors.muted }]}>
                        We built Betkiray to create a trusted community for renters and hosts. Please follow these guidelines.
                    </Text>
                </View>

                {GUIDELINES.map((item, index) => (
                    <View key={index} style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                        <View style={[styles.iconBox, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
                            <Ionicons name={item.icon as any} size={28} color={colors.text} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
                            <Text style={[styles.cardDesc, { color: colors.muted }]}>{item.desc}</Text>
                        </View>
                    </View>
                ))}
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
    intro: { marginBottom: 20 },
    subText: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
    card: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 20,
        marginBottom: 16,
        alignItems: 'center'
    },
    iconBox: {
        width: 56, height: 56, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center',
        marginRight: 16
    },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4 },
    cardDesc: { fontSize: 14, lineHeight: 20 }
});
