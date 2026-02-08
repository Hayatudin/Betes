import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const LANGUAGES = [
    { code: 'en', name: 'English (US)', native: 'English' },
    { code: 'am', name: 'Amharic', native: 'አማርኛ' },
    { code: 'om', name: 'Oromo', native: 'Afaan Oromoo' },
    { code: 'ti', name: 'Tigrinya', native: 'ትግርኛ' },
    { code: 'so', name: 'Somali', native: 'Soomaali' },
];

export default function LanguageScreen() {
    const { colors, isDark } = useTheme();
    // Mock state for now, ideally persistent
    const [selectedLang, setSelectedLang] = useState('en');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#fff', borderColor: isDark ? '#333' : '#f0f0f0' }]}>
                    {LANGUAGES.map((lang, index) => (
                        <React.Fragment key={lang.code}>
                            <TouchableOpacity
                                style={styles.row}
                                onPress={() => setSelectedLang(lang.code)}
                            >
                                <View>
                                    <Text style={[styles.langName, { color: colors.text }]}>{lang.name}</Text>
                                    <Text style={styles.langNative}>{lang.native}</Text>
                                </View>
                                {selectedLang === lang.code && (
                                    <Ionicons name="checkmark" size={24} color={isDark ? '#fff' : '#000'} />
                                )}
                            </TouchableOpacity>
                            {index < LANGUAGES.length - 1 && (
                                <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />
                            )}
                        </React.Fragment>
                    ))}
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
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    langName: { fontSize: 16, fontWeight: '600' },
    langNative: { fontSize: 14, color: '#888', marginTop: 2 },
    divider: { height: 1, marginLeft: 16 },
});
