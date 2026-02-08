import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";
import { router } from "expo-router";

// Mock Pending Approvals
const PENDING_APPROVALS = [
    {
        id: "1",
        title: "Modern Apartment in Bole",
        owner: "Abebe Kebede",
        price: "$1,200/mo",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww",
        location: "Bole, Addis Ababa",
        date: "2 hours ago",
        status: "Pending"
    },
    {
        id: "2",
        title: "Cozy Studio near Piaza",
        owner: "Sara Tadesse",
        price: "$450/mo",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXBhcnRtZW50fGVufDB8fDB8fHww",
        location: "Piaza, Addis Ababa",
        date: "5 hours ago",
        status: "Pending"
    },
    {
        id: "3",
        title: "Luxury Villa in CMC",
        owner: "Dawit Alemu",
        price: "$3,500/mo",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww",
        location: "CMC, Addis Ababa",
        date: "1 day ago",
        status: "Pending"
    }
];

export default function ApprovalsScreen() {
    const { colors, isDark } = useTheme();
    const [approvals, setApprovals] = useState(PENDING_APPROVALS);

    const handleAction = (id: string, action: 'Approve' | 'Reject') => {
        Alert.alert(
            `Confirm ${action}`,
            `Are you sure you want to ${action.toLowerCase()} this listing?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: action,
                    style: action === 'Reject' ? 'destructive' : 'default',
                    onPress: () => {
                        setApprovals(prev => prev.filter(item => item.id !== id));
                        // In real app, call API here
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <AdminHeader
                title="Pending Approvals"
                headerLeft={
                    <TouchableOpacity onPress={() => router.navigate("/admin")} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                        <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
                    </TouchableOpacity>
                }
            />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {approvals.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-done-circle-outline" size={80} color={colors.muted} />
                        <Text style={[styles.emptyText, { color: colors.muted }]}>No pending approvals</Text>
                    </View>
                ) : (
                    approvals.map((item) => (
                        <View key={item.id} style={[styles.approvalCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: `/property/${item.id}`, params: { adminMode: 'true' } })}
                                activeOpacity={0.9}
                            >
                                <Image source={{ uri: item.image }} style={styles.cardImage} />

                                <View style={styles.cardContent}>
                                    <View style={styles.cardHeader}>
                                        <View>
                                            <Text style={[styles.propertyTitle, { color: colors.text }]}>{item.title}</Text>
                                            <Text style={[styles.propertyLocation, { color: colors.muted }]}>
                                                <Ionicons name="location-outline" size={12} color={colors.muted} /> {item.location}
                                            </Text>
                                        </View>
                                        <View style={[styles.priceTag, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
                                            <Text style={[styles.priceText, { color: colors.text }]}>{item.price}</Text>
                                        </View>
                                    </View>

                                    <View style={[styles.ownerInfo, { marginBottom: 16 }]}>
                                        <View style={styles.ownerAvatar}>
                                            <Text style={styles.ownerInitials}>{item.owner.charAt(0)}</Text>
                                        </View>
                                        <View>
                                            <Text style={[styles.ownerName, { color: colors.text }]}>{item.owner}</Text>
                                            <Text style={[styles.dateText, { color: colors.muted }]}>Submitted {item.date}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Action Buttons */}
                            <View style={styles.actionButtonsContainer}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => handleAction(item.id, 'Reject')}
                                >
                                    <Text style={styles.rejectBtnText}>Reject</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => handleAction(item.id, 'Approve')}
                                >
                                    <Text style={styles.approveBtnText}>Approve</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
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
        paddingBottom: 40,
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
    approvalCard: {
        borderRadius: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        maxWidth: 200,
    },
    propertyLocation: {
        fontSize: 12,
    },
    priceTag: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    priceText: {
        fontSize: 14,
        fontWeight: '700',
    },
    ownerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    ownerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ownerInitials: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    ownerName: {
        fontSize: 14,
        fontWeight: '600',
    },
    dateText: {
        fontSize: 11,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    actionButtons: { // Keeping for backward compatibility if used, otherwise can remove
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rejectBtn: {
        backgroundColor: '#ffe5e5',
    },
    rejectBtnText: {
        color: '#d93025',
        fontWeight: '600',
    },
    approveBtn: {
        backgroundColor: '#000',
    },
    approveBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
});
