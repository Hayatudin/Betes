import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Helper to get dates
const getRelativeDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

// Mock data with Date objects for filtering
const ALL_TRANSACTIONS = [
    { id: "1", user: "Property List Fee", amount: "+$25.00", date: getRelativeDate(0), type: "Listing", icon: "home", color: "#FFD700" }, // Today
    { id: "2", user: "Premium Sub", amount: "+$100.00", date: getRelativeDate(0), type: "Subscription", icon: "star", color: "#FF4081" }, // Today
    { id: "3", user: "Commission", amount: "+$55.00", date: getRelativeDate(1), type: "Fee", icon: "cash", color: "#00B0FF" }, // Yesterday (This Week)
    { id: "4", user: "Property List Fee", amount: "+$25.00", date: getRelativeDate(3), type: "Listing", icon: "home", color: "#FFD700" }, // 3 days ago (This Week)
    { id: "5", user: "Withdrawal", amount: "-$150.00", date: getRelativeDate(10), type: "Transfer", icon: "arrow-up", color: "#000000" }, // 10 days ago (This Month)
    { id: "6", user: "Premium Sub", amount: "+$100.00", date: getRelativeDate(20), type: "Subscription", icon: "star", color: "#FF4081" }, // 20 days ago (This Month)
    { id: "7", user: "Commission", amount: "+$240.00", date: getRelativeDate(45), type: "Fee", icon: "cash", color: "#00B0FF" }, // 45 days ago (This Year)
    { id: "8", user: "Property List Fee", amount: "+$25.00", date: getRelativeDate(200), type: "Listing", icon: "home", color: "#FFD700" }, // 200 days ago (This Year)
    { id: "9", user: "Commission", amount: "+$120.00", date: getRelativeDate(400), type: "Fee", icon: "cash", color: "#00B0FF" }, // > 1 year (All Time)
];

const TIME_FILTERS = ["Today", "This Week", "This Month", "This Year", "All Time"];

export default function EarningsScreen() {
    const { colors, isDark } = useTheme();
    const [selectedFilter, setSelectedFilter] = useState("This Week");
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Modern "Increasing Rate"
    const increasingRate = 12.5;

    // Filter Logic
    const filteredTransactions = ALL_TRANSACTIONS.filter(item => {
        const itemDate = item.date;
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (selectedFilter === "All Time") return true;

        if (selectedFilter === "Today") {
            return itemDate >= startOfDay;
        }

        if (selectedFilter === "This Week") {
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay()); // Sunday as start
            return itemDate >= startOfWeek;
        }

        if (selectedFilter === "This Month") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return itemDate >= startOfMonth;
        }

        if (selectedFilter === "This Year") {
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return itemDate >= startOfYear;
        }

        return true;
    });

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) return `Today, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        if (diffDays === 2) return `Yesterday`;
        return date.toLocaleDateString();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title="Earnings"
                headerLeft={
                    <TouchableOpacity onPress={() => router.navigate("/admin")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Premium Card Section */}
                <View style={styles.cardContainer}>
                    <LinearGradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.premiumCard}
                    >
                        <View style={styles.cardTop}>
                            <Text style={styles.cardLabel}>Total Balance</Text>
                            {/* Modern Rate Indicator */}
                            <View style={styles.rateContainer}>
                                <Ionicons name="trending-up" size={14} color="#4CAF50" />
                                <Text style={styles.rateText}>+{increasingRate}%</Text>
                            </View>
                        </View>

                        <Text style={styles.cardBalance}>$8,465 USD</Text>

                        <View style={styles.cardBottom}>
                            <Text style={styles.cardNumber}>**** 4568</Text>
                            <View style={styles.cardChip}>
                                <Ionicons name="card-outline" size={24} color="rgba(255,255,255,0.8)" />
                            </View>
                        </View>

                        {/* Abstract Shapes for "Glass" effect */}
                        <View style={styles.abstractShape1} />
                        <View style={styles.abstractShape2} />
                    </LinearGradient>
                </View>

                {/* Bottom Sheet Style History List */}
                <View style={[styles.historyContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
                    <View style={styles.historyHeader}>
                        <Text style={[styles.historyTitle, { color: colors.text }]}>Transactions</Text>

                        {/* Dropdown Trigger */}
                        <TouchableOpacity
                            style={[styles.filterDropdownBtn, { backgroundColor: isDark ? '#333' : '#f5f5f5' }]}
                            onPress={() => setFilterModalVisible(true)}
                        >
                            <Text style={[styles.filterDropdownText, { color: colors.text }]}>{selectedFilter}</Text>
                            <Ionicons name="chevron-down" size={14} color={colors.muted} />
                        </TouchableOpacity>
                    </View>

                    {filteredTransactions.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.muted }]}>No transactions found for {selectedFilter}</Text>
                        </View>
                    ) : (
                        filteredTransactions.map((item, index) => (
                            <View key={item.id} style={styles.transactionWrapper}>
                                <View style={styles.transactionItem}>
                                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                                        <Ionicons name={item.icon as any} size={24} color="#fff" />
                                    </View>
                                    <View style={styles.txDetails}>
                                        <Text style={[styles.txName, { color: colors.text }]}>{item.user}</Text>
                                        <Text style={[styles.txType, { color: colors.muted }]}>{item.type}</Text>
                                    </View>
                                    <View style={styles.txRight}>
                                        <Text style={[styles.txAmount, { color: item.amount.includes("-") ? colors.text : '#4CAF50' }]}>
                                            {item.amount}
                                        </Text>
                                        <Text style={[styles.txDate, { color: colors.muted }]}>{formatDate(item.date)}</Text>
                                    </View>
                                </View>
                                {index < filteredTransactions.length - 1 && (
                                    <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#f5f5f5' }]} />
                                )}
                            </View>
                        ))
                    )}

                    <View style={{ height: 40 }} />
                </View>

            </ScrollView>

            {/* Simple Modal for Dropdown Selection */}
            <Modal
                visible={filterModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
                    <View style={[styles.dropdownMenu, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                        {TIME_FILTERS.map((filter) => (
                            <TouchableOpacity
                                key={filter}
                                style={[
                                    styles.dropdownItem,
                                    selectedFilter === filter && { backgroundColor: isDark ? '#333' : '#f0f0f0' }
                                ]}
                                onPress={() => {
                                    setSelectedFilter(filter);
                                    setFilterModalVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.dropdownItemText,
                                    { color: colors.text },
                                    selectedFilter === filter && { fontWeight: '700' }
                                ]}>
                                    {filter}
                                </Text>
                                {selectedFilter === filter && (
                                    <Ionicons name="checkmark" size={18} color="#4CAF50" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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

    // Card Styles
    cardContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    premiumCard: {
        height: 200,
        borderRadius: 24,
        padding: 24,
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        shadowColor: "#3b5998",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 16,
        fontWeight: '500',
    },
    rateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    rateText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4CAF50',
    },
    cardBalance: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '700',
        zIndex: 2,
        marginVertical: 10,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 2,
    },
    cardNumber: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 1,
    },
    cardChip: {
        opacity: 0.8,
    },
    abstractShape1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: 1,
    },
    abstractShape2: {
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)', // Slightly increased opacity for better visibility
        zIndex: 1,
    },

    // History List Styles
    historyContainer: {
        flex: 1,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingTop: 30,
        minHeight: 400,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    filterDropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    filterDropdownText: {
        fontSize: 13,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    transactionWrapper: {
        marginBottom: 0,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    txDetails: {
        flex: 1,
    },
    txName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    txType: {
        fontSize: 13,
    },
    txRight: {
        alignItems: 'flex-end',
    },
    txAmount: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    txDate: {
        fontSize: 12,
    },
    divider: {
        height: 1,
        width: '100%',
        marginLeft: 64,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownMenu: {
        width: width * 0.8,
        padding: 10,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
    },
    dropdownItemText: {
        fontSize: 16,
    },
});
