import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
  Dimensions, ImageBackground, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';
import ActionSheet from "@/components/ActionSheet";

const { width } = Dimensions.get("window");

// Mock Data
const MOCK_USER = {
  name: "Hamza Safi",
  image: "https://i.pravatar.cc/300?img=11",
  stats: {
    properties: 12,
    views: "1.2K",
    saved: 8
  }
};

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "1 Room with attached Bathroom",
    location: "Ayat, Addis Ababa",
    price: "10,000",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    status: "Available"
  },
  {
    id: "2",
    title: "1 Room with attached Bathroom",
    location: "Ayat, Addis Ababa",
    price: "10,000",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    status: "Available"
  },
  {
    id: "3",
    title: "1 Room with attached Bathroom",
    location: "Ayat, Addis Ababa",
    price: "10,000",
    image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    status: "Available"
  },
  {
    id: "4",
    title: "1 Room with attached Bathroom",
    location: "Ayat, Addis Ababa",
    price: "10,000",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    status: "Available"
  }
];

export default function ProfileScreen() {
  const { theme, isDark, colors } = useTheme();
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<typeof MOCK_LISTINGS[0] | null>(null);

  const handleAction = (item: typeof MOCK_LISTINGS[0]) => {
    setSelectedProperty(item);
    setShowActionSheet(true);
  };

  const handleEdit = () => {
    if (selectedProperty) {
      router.push(`/property/edit/${selectedProperty.id}`);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete", "Are you sure you want to delete this property?", [
      { text: "cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => console.log("Deleted") }
    ]);
  };

  const handleUnavailable = () => {
    if (selectedProperty) {
      setListings(prev => prev.map(item =>
        item.id === selectedProperty.id
          ? { ...item, status: item.status === "Available" ? "Unavailable" : "Available" }
          : item
      ));
    }
    setShowActionSheet(false);
  };

  const renderListingCard = (item: typeof MOCK_LISTINGS[0]) => (
    <TouchableOpacity key={item.id} style={styles.cardContainer}>
      <ImageBackground source={{ uri: item.image }} style={styles.cardImage} imageStyle={styles.cardImageRadius}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />

        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#ccc" />
            <Text style={styles.cardLocation}>{item.location}</Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.pricePill}>
              <Text style={styles.priceText}>{item.price}/month</Text>
            </View>
            <TouchableOpacity onPress={() => handleAction(item)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: MOCK_USER.image }} style={styles.avatar} contentFit="cover" transition={1000} />
          </View>

          <View style={styles.nameRow}>
            <Text style={[styles.userName, { color: colors.text }]}>{MOCK_USER.name}</Text>
            <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.text }]}>{MOCK_USER.stats.properties}</Text>
              <Text style={styles.statLabel}>Properties</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.text }]}>{MOCK_USER.stats.views}</Text>
              <Text style={styles.statLabel}>Total Views</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.text }]}>{MOCK_USER.stats.saved}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            {/* Edit Profile: Black in Light, White in Dark */}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: isDark ? '#fff' : '#000' }]}
              onPress={() => router.push('/profile/edit')}
            >
              <Ionicons name="create-outline" size={20} color={isDark ? '#000' : '#fff'} style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnText, { color: isDark ? '#000' : '#fff' }]}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Admin Panel: White in Light, Secondary (Dark Gray) in Dark */}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]}
              onPress={() => router.push('/admin')}
            >
              <Ionicons name="settings-outline" size={20} color={isDark ? '#fff' : '#000'} style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnText, { color: isDark ? '#fff' : '#000' }]}>Admin Panel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Listings Section */}
        <View style={[styles.listingsSection, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>My Listings</Text>
          <View style={styles.grid}>
            {listings.map(renderListingCard)}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Sheet */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title={selectedProperty?.title || "Property Options"}
        options={[
          { label: 'Edit', onPress: handleEdit },
          {
            label: selectedProperty?.status === 'Available' ? 'Mark as Unavailable' : 'Mark as Available',
            onPress: handleUnavailable
          },
          { label: 'Delete', onPress: handleDelete, isDestructive: true },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" }, // Light gray bg like screenshot
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 0 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#000' },
  settingsBtn: { width: 44, height: 44, backgroundColor: '#fff', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { paddingBottom: 40 },

  profileInfo: { alignItems: 'center', marginTop: 10 },
  avatarWrapper: { marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#ddd' }, // Circular

  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  userName: { fontSize: 22, fontWeight: '700', color: '#000' },

  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '700', color: '#000' },
  statLabel: { fontSize: 13, color: '#888' },

  actionButtonsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', paddingVertical: 12, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontWeight: '600', fontSize: 14 },

  listingsSection: { marginTop: 20, paddingHorizontal: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 24, minHeight: 500 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 20 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardContainer: { width: (width - 52) / 2, height: 220, marginBottom: 16, borderRadius: 20 }, // Rounded corners
  cardImage: { flex: 1, justifyContent: 'space-between' },
  cardImageRadius: { borderRadius: 20 },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },

  badgeContainer: { alignItems: 'flex-end', padding: 12 },
  badge: { backgroundColor: 'rgba(255,255,255,0.3)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '600' },

  cardContent: { padding: 12 },
  cardTitle: { color: '#fff', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  cardLocation: { color: '#ddd', fontSize: 10 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pricePill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  priceText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});