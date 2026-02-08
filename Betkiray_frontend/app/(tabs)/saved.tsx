import { useAppState } from "@/contexts/AppStateContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import api from "@/config/api";

const { width } = Dimensions.get("window");
const COLUMN_count = 2;
const CARD_GAP = 12;
const CARD_WIDTH = (width - 40 - (CARD_GAP * (COLUMN_count - 1))) / COLUMN_count;

const CATEGORIES = ["All", "House", "Apartment", "Office"];

export default function SavedScreen() {
  const { savedProperties, toggleSaved } = useAppState();
  const { theme, isDark, colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const API_BASE_URL = api.defaults.baseURL;

  const filteredProperties = savedProperties.filter((p) => {
    if (selectedCategory === "All") return true;
    return p.propertyType?.toUpperCase() === selectedCategory.toUpperCase();
  });

  const getImageUrl = (imageVal: string | number | undefined) => {
    if (typeof imageVal === 'number') return imageVal;
    if (typeof imageVal === 'string' && imageVal.startsWith('http')) return { uri: imageVal };
    if (typeof imageVal === 'string') return { uri: `http://10.0.2.2:3000${imageVal}` }; // Fallback for relative
    return { uri: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" };
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = getImageUrl(item.image || item.media?.[0]?.mediaUrl);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push(`/property/${item.id}`)}
      >
        <Image source={imageUrl} style={styles.cardImage} contentFit="cover" transition={500} />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />

        {/* Top Badges */}
        <View style={styles.cardHeader}>
          <TouchableOpacity style={styles.heartButton} onPress={() => toggleSaved(item.id)}>
            <Ionicons name="heart" size={18} color="#FF3B30" />
          </TouchableOpacity>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.propertyType || "Apartment"}</Text>
          </View>
        </View>

        {/* Bottom Content */}
        <View style={styles.cardContent}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{Number(item.price).toLocaleString()}/month</Text>
          </View>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#ddd" />
            <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>

      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Favorites</Text>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={CATEGORIES}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item;
            // Map icons similarly if needed, for now using simple mapping
            let iconName = "grid-outline";
            if (item === "House") iconName = "home-outline";
            if (item === "Apartment") iconName = "business-outline";
            if (item === "Office") iconName = "briefcase-outline";

            return (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                  { backgroundColor: isActive ? (isDark ? '#fff' : '#000') : (isDark ? colors.secondary : '#fff') }
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <View style={[styles.categoryIconCircle,
                { backgroundColor: isActive ? (isDark ? '#000' : '#333') : (isDark ? '#333' : '#E0E0E0') }
                ]}>
                  <Ionicons name={iconName as any} size={16} color={isActive ? "#fff" : (isDark ? '#fff' : '#000')} />
                </View>
                <Text style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                  { color: isActive ? (isDark ? '#000' : '#fff') : colors.text }
                ]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Favorites Grid */}
      {savedProperties.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-dislike-outline" size={64} color={colors.muted} />
          <Text style={[styles.emptyText, { color: colors.muted }]}>No favorites yet.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          numColumns={COLUMN_count}
          columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" }, // Match Home bg
  header: {
    paddingTop: 40, paddingHorizontal: 20, paddingBottom: 10, backgroundColor: "#F8F8F8"
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },

  categoryContainer: {
    marginTop: 10, marginBottom: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 30, // Pill shape
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: "#000",
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconCircleInactive: {
    backgroundColor: '#E0E0E0',
  },
  categoryIconCircleActive: {
    backgroundColor: '#333',
  },
  categoryChipText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
    marginRight: 12,
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#fff",
  },

  card: {
    width: CARD_WIDTH,
    height: 240,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    overflow: 'hidden'
  },
  cardImage: { width: '100%', height: '100%' },
  cardGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%' },

  cardHeader: {
    position: 'absolute', top: 12, left: 12, right: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
  },
  heartButton: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
  },
  categoryBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)', // Glassy look
    overflow: 'hidden'
  },
  categoryText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  cardContent: {
    position: 'absolute', bottom: 12, left: 12, right: 12
  },
  pricePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginBottom: 6,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  priceText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: '#ddd', fontSize: 10 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#888', marginTop: 10, fontSize: 16 }
});