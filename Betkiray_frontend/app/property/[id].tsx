import { useAppState } from "@/contexts/AppStateContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from "@/contexts/ThemeContext";

const { width, height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.45;

export default function PropertyDetailScreen() {
  const { id, adminMode } = useLocalSearchParams<{ id: string, adminMode?: string }>();
  const { getPropertyById, toggleSaved, isSaved, isLoading } = useAppState();
  const { theme, isDark, colors } = useTheme();

  const property = getPropertyById(Number(id));

  // Handle Loading & Not Found
  if (isLoading && !property) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Property not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = () => {
    const phoneNumber = property.phone || "0911000000"; // Fallback phone
    const scheme = Platform.OS === 'android' ? 'tel:' : 'telprompt:';
    Linking.openURL(`${scheme}${phoneNumber}`);
  };

  const images = property.media?.length
    ? property.media.filter(m => m.mediaType === 'IMAGE').map(m => `https://your-api-base-url${m.mediaUrl}`)
    : [property.image]; // Fallback to main image

  const handleApprove = () => {
    Alert.alert("Success", "Property has been approved successfully.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  const handleReject = () => {
    Alert.alert("Reject Property", "Are you sure you want to reject this property?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          // In real app, call API
          router.back();
        }
      }
    ]);
  };

  // Mock Agent Data (since it might be missing in some property objects)
  const agent = {
    name: property.owner?.name || "Orhan Jemal",
    role: "Owner",
    image: property.owner?.image, // legitimate image or null
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header Buttons (Fixed) */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          <Ionicons name="arrow-back" size={24} color={isDark ? colors.text : "#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSaved(property.id)} style={[styles.iconButton, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          <Ionicons name={isSaved(property.id) ? "heart" : "heart-outline"} size={24} color={isSaved(property.id) ? "#FF3B30" : (isDark ? colors.text : "#000")} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top Image Slider Area */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: (typeof property.image === 'string' && property.image.startsWith('http')) ? property.image : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" }}
            style={styles.mainImage}
            contentFit="cover"
            transition={500}
          />
          <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent']} style={styles.topGradient} />

          {/* Pagination Dots (Mock) */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Curved Content Sheet */}
        <View style={[styles.sheetContainer, { backgroundColor: colors.background }]}>

          {/* Title & Video */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>{property.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color={colors.muted} />
                <Text style={[styles.locationText, { color: colors.muted }]}>{property.subCity || "Ayat"}, {property.city}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.playButton, { backgroundColor: isDark ? colors.secondary : '#000' }]}>
              <Ionicons name="play" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Listing Agent */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Listing Agent</Text>
          <View style={styles.agentRow}>
            <Image source={agent.image ? { uri: agent.image } : { uri: "https://i.pravatar.cc/150?u=orhan" }} style={styles.agentAvatar} />
            <View style={styles.agentInfo}>
              <Text style={[styles.agentName, { color: colors.text }]}>{agent.name}</Text>
              <Text style={[styles.agentRole, { color: colors.muted }]}>{agent.role}</Text>
            </View>
            <View style={styles.agentActions}>
              <TouchableOpacity style={[styles.agentActionBtn, { backgroundColor: isDark ? colors.secondary : '#f2f2f7' }]}>
                <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.muted} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.agentActionBtn, { backgroundColor: isDark ? colors.secondary : '#f2f2f7' }]} onPress={handleCall}>
                <Ionicons name="call-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.muted }]}>
            {property.description || "A beautifully designed apartment perfect for students and families. Located just 5 minutes walk from main road with all amenities included."}
          </Text>

          {/* Features */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Features</Text>
          <View style={styles.featuresRow}>
            <FeatureItem icon="bed-outline" label={`${property.bedrooms} Bedroom`} isDark={isDark} colors={colors} />
            <FeatureItem icon="water-outline" label={`${property.bathrooms} Bathroom`} isDark={isDark} colors={colors} />
            <FeatureItem icon="resize-outline" label={`${property.areaSqm || 65} m²`} isDark={isDark} colors={colors} />
            <FeatureItem icon="library-outline" label={property.isFurnished ? "Furnished" : "Not Furnished"} isDark={isDark} colors={colors} />
          </View>

          {/* Reviews */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
            <Text style={[styles.sectionHeader, { marginBottom: 0, marginTop: 0, color: colors.text }]}>Reviews</Text>
            <TouchableOpacity style={[styles.addReviewButton, { backgroundColor: isDark ? colors.secondary : '#000' }]}>
              <Ionicons name="add" size={12} color="#fff" />
              <Text style={styles.addReviewText}>Add Review</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.reviewCard, { backgroundColor: isDark ? colors.secondary : '#f5f6fa' }]}>
            <Image source={{ uri: "https://i.pravatar.cc/150?u=mubarek" }} style={styles.reviewerAvatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.reviewerName, { color: colors.text }]}>Mubarek H.</Text>
                <Text style={styles.reviewDate}>2 days ago</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map(i => <Ionicons key={i} name="star" size={12} color="#FFD700" />)}
              </View>
              <Text style={[styles.reviewText, { color: colors.text }]}>Perfect location and the landlord is very responsive. Water is always available!</Text>
            </View>
          </View>

          <View style={[styles.reviewCard, { backgroundColor: isDark ? colors.secondary : '#f5f6fa' }]}>
            <Image source={{ uri: "https://i.pravatar.cc/150?u=nagi" }} style={styles.reviewerAvatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.reviewerName, { color: colors.text }]}>Nagi S.</Text>
                <Text style={styles.reviewDate}>1 week ago</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map(i => <Ionicons key={i} name="star" size={12} color="#FFD700" />)}
              </View>
              <Text style={[styles.reviewText, { color: colors.text }]}>Great place for students. Very close to campus and well-maintained.</Text>
            </View>
          </View>

          {/* Location Map Placeholder */}
          <Text style={[styles.sectionHeader, { color: colors.text }]}>Location</Text>
          <View style={[styles.mapPlaceholder, { backgroundColor: isDark ? colors.secondary : '#eee' }]}>
            <Image source={{ uri: "https://mt1.google.com/vt/lyrs=m&x=1&y=1&z=1" }} style={{ width: '100%', height: '100%', opacity: 0.8 }} contentFit="cover" />
            <View style={styles.mapOverlay}>
              <Ionicons name="location" size={30} color="#007AFF" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <BlurView intensity={isDark ? 50 : 90} tint={isDark ? "dark" : "light"} style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={[styles.price, { color: colors.text }]}>
              {property.price
                ? Number(property.price.toString().replace(/[^0-9.]/g, '')).toLocaleString()
                : "0"}
              /month
            </Text>
          </View>

          {adminMode ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={handleReject}
                style={[styles.chatNowBtn, { backgroundColor: '#ffe5e5', paddingHorizontal: 20 }]}
              >
                <Text style={[styles.chatNowText, { color: '#d93025' }]}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApprove}
                style={[styles.chatNowBtn, { backgroundColor: '#000' }]}
              >
                <Text style={[styles.chatNowText, { color: '#fff' }]}>Approve</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={[styles.chatNowBtn, { backgroundColor: isDark ? colors.text : '#000' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={isDark ? colors.background : "#fff"} style={{ marginRight: 8 }} />
              <Text style={[styles.chatNowText, { color: isDark ? colors.background : '#fff' }]}>Chat now</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </View>
  );
}

const FeatureItem = ({ icon, label, isDark, colors }: { icon: any, label: string, isDark: boolean, colors: any }) => (
  <View style={[styles.featureItem, { backgroundColor: isDark ? colors.secondary : '#f5f6fa' }]}>
    <Ionicons name={icon} size={24} color={colors.text} />
    <Text style={[styles.featureLabel, { color: colors.text }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "#666", marginBottom: 20 },
  backBtn: { padding: 10, backgroundColor: "#000", borderRadius: 8 },
  backBtnText: { color: "#fff" },

  // Image is now part of ScrollView
  imageContainer: {
    height: IMAGE_HEIGHT,
    width: width,
    position: 'relative',
    backgroundColor: '#f0f0f0' // Placeholder color
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  topGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 100
  },

  // Header Buttons fixed on screen
  headerRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100 // High z-index to stay on top
  },
  iconButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3
  },

  pagination: {
    position: 'absolute', bottom: 40, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center', gap: 8
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  activeDot: { backgroundColor: '#fff', width: 24 },

  sheetContainer: {
    marginTop: -30, // Overlap the image
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 20
  },
  scrollContent: {
    // Padding handled in sheetContainer
  },

  titleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 4, width: '80%' },
  playButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#000',
    justifyContent: 'center', alignItems: 'center'
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: '#666', fontSize: 14 },

  sectionHeader: { fontSize: 18, fontWeight: '700', marginBottom: 16, marginTop: 8 },

  agentRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24
  },
  agentAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  agentInfo: { flex: 1 },
  agentName: { fontWeight: 'bold', fontSize: 16 },
  agentRole: { color: '#666', fontSize: 12 },
  agentActions: { flexDirection: 'row', gap: 12 },
  agentActionBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#f2f2f7',
    justifyContent: 'center', alignItems: 'center'
  },

  description: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 24 },

  featuresRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24
  },
  featureItem: {
    width: (width - 48 - 36) / 4,
    aspectRatio: 1,
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    gap: 6
  },
  featureLabel: { fontSize: 10, color: '#333', textAlign: 'center', fontWeight: '500' },

  addReviewButton: {
    backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4
  },
  addReviewText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  reviewCard: {
    flexDirection: 'row', padding: 16, backgroundColor: '#f5f6fa',
    borderRadius: 16, alignItems: 'flex-start', gap: 12, marginBottom: 16
  },
  reviewerAvatar: { width: 40, height: 40, borderRadius: 20 },
  reviewerName: { fontWeight: '700', marginBottom: 2, fontSize: 14 },
  reviewDate: { fontSize: 10, color: '#999' },
  reviewText: { fontSize: 12, color: '#444', marginTop: 4, lineHeight: 18 },

  mapPlaceholder: {
    height: 200, borderRadius: 16, overflow: 'hidden', backgroundColor: '#eee', position: 'relative', justifyContent: 'center', alignItems: 'center'
  },
  mapOverlay: { position: 'absolute' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 0, borderTopRightRadius: 0
  },
  bottomBarContent: {
    paddingHorizontal: 24, paddingVertical: 20,
    paddingBottom: 34,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.01)' // Almost transparent to let blur show
  },
  price: { fontSize: 24, fontWeight: 'bold' },
  chatNowBtn: {
    backgroundColor: '#000',
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 30
  },
  chatNowText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
