// app/(admin)/properties.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Modal,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import api from "@/config/api";
import AdminHeader from "@/components/AdminHeader";


const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.4:3000";

// Mock Data
const SAMPLE_PROPERTIES = [
  {
    id: '1',
    title: 'Cozy studio Apartment',
    owner: { name: 'Esayas Tesfaye' },
    price: 18000,
    status: 'PENDING',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: '2',
    title: 'Luxury Apartment',
    owner: { name: 'Mubarek Hassen' },
    price: 20000,
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=735&q=80',
  },
  {
    id: '3',
    title: '1 Room Apartment',
    owner: { name: 'Chupapi Megnegno' },
    price: 9000,
    status: 'PENDING',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2280&q=80',
  },
  {
    id: '4',
    title: 'Apartments for Rent',
    owner: { name: 'Levi Ackermen' },
    price: 13000,
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: '5',
    title: 'Apartments for Rent',
    owner: { name: 'Levi Ackermen' },
    price: 13000,
    status: 'APPROVED',
    image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
  },
  {
    id: '6',
    title: 'Luxury 2BHK Apartment',
    owner: { name: 'Levi Ackermen' },
    price: 13000,
    status: 'PENDING',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

type FilterType = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const FILTERS: FilterType[] = [
  { id: "All", label: "All", icon: "business" },
  { id: "Pending", label: "Pending", icon: "time" },
  { id: "Approved", label: "Approved", icon: "checkmark-circle" },
  { id: "Rejected", label: "Rejected", icon: "close-circle" },
];

export default function ManagePropertiesScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState("All");
  const [properties, setProperties] = useState(SAMPLE_PROPERTIES);
  const [isLoading, setIsLoading] = useState(true);

  // Action Sheet State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);

  const fetchProperties = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/properties");
      if (response.data && response.data.length > 0) {
        setProperties(response.data);
      } else {
        setProperties(SAMPLE_PROPERTIES);
      }
    } catch (error) {
      console.log("Failed to fetch properties, using sample data");
      setProperties(SAMPLE_PROPERTIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const filteredProperties = properties.filter(p => {
    if (filter === "All") return true;
    if (filter === "Pending") return p.status === 'PENDING';
    if (filter === "Approved") return p.status === 'APPROVED';
    if (filter === "Rejected") return p.status === 'REJECTED';
    return true;
  });

  const getPropertyImage = (item: any) => {
    // 1. Check for media array (API data)
    if (item.media && item.media.length > 0) {
      const mediaUrl = item.media[0].mediaUrl;
      if (mediaUrl) {
        if (mediaUrl.startsWith("http")) {
          return mediaUrl;
        }
        return `${API_URL}${mediaUrl}`;
      }
    }
    // 2. Check for image property (Mock data)
    if (item.image && typeof item.image === 'string') {
      return item.image;
    }

    return null;
  };

  const handleOpenActionSheet = (id: string) => {
    setSelectedPropertyId(id);
    setIsActionSheetVisible(true);
  };

  const handleCloseActionSheet = () => {
    setIsActionSheetVisible(false);
    setSelectedPropertyId(null);
  };

  const handleDeleteProperty = () => {
    if (selectedPropertyId) {
      Alert.alert(
        "Deleting Property",
        "Are you sure you want to delete this property?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                // Check if it's a sample property
                const isSample = SAMPLE_PROPERTIES.some(p => p.id === selectedPropertyId);
                if (!isSample) {
                  await api.delete(`/admin/properties/${selectedPropertyId}`);
                }
                setProperties(prev => prev.filter(p => p.id !== selectedPropertyId));
              } catch (error) {
                Alert.alert("Error", "Failed to delete property");
              } finally {
                handleCloseActionSheet();
              }
            }
          }
        ]
      );
    } else {
      handleCloseActionSheet();
    }
  };

  const handleViewDetails = () => {
    if (selectedPropertyId) {
      router.push(`/property/${selectedPropertyId}`);
    }
    handleCloseActionSheet();
  };

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = getPropertyImage(item);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: isDark ? colors.secondary : '#FFF' }]}
        onPress={() => router.push(`/property/${item.id}`)}
      >
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, { backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="image-outline" size={32} color="#999" />
          </View>
        )}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity onPress={() => handleOpenActionSheet(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.cardOwner, { color: colors.muted }]}>by {item.owner?.name || "Unknown"}</Text>
          <Text style={[styles.cardPrice, { color: colors.text }]}>
            ETB {Number(item.price).toLocaleString()} <Text style={[styles.perMonth, { color: colors.muted }]}>/month</Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <AdminHeader title="Properties" />

        {/* Filter Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {FILTERS.map((tab) => {
              const isActive = filter === tab.id;
              // In dark mode, inactive tab should be dark secondary, active can stay primary (white or specific)
              // Design: Active = Black bg (white text), Inactive = White bg (black text)
              // Dark Mode adaptation: Active = White bg (black text), Inactive = Dark Secondary (white text) OR keep brand logic

              // Let's invert for dark mode specifically so 'Active' stands out
              const activeBg = isDark ? '#FFF' : '#000';
              const activeText = isDark ? '#000' : '#FFF';
              const inactiveBg = isDark ? colors.secondary : '#FFF';
              const inactiveText = isDark ? '#FFF' : '#000';
              const activeIconColor = isDark ? '#000' : '#FFF';
              const inactiveIconColor = isDark ? '#FFF' : '#000'; // or muted

              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.tab, { backgroundColor: isActive ? activeBg : inactiveBg }]}
                  onPress={() => setFilter(tab.id)}
                >
                  <View style={[
                    styles.iconCircle,
                    { backgroundColor: isActive ? (isDark ? '#E0E0E0' : '#333') : (isDark ? '#333' : '#E0E0E0') }
                  ]}>
                    <Ionicons name={tab.icon} size={16} color={isActive ? activeIconColor : inactiveIconColor} />
                  </View>
                  <Text style={[styles.tabText, { color: isActive ? activeText : inactiveText }]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* List */}
        <FlatList
          data={filteredProperties}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()} // Ensure string key
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color: colors.muted }}>No properties found</Text>
            </View>
          }
        />

        {/* FAB */}
        <TouchableOpacity style={[styles.fab, { backgroundColor: isDark ? '#FFF' : '#000' }]} onPress={() => router.push({ pathname: '/(tabs)/add', params: { returnTo: '/admin/properties' } })}>
          <Ionicons name="add" size={32} color={isDark ? '#000' : '#FFF'} />
        </TouchableOpacity>

        {/* Custom iOS Style Action Sheet Modal */}
        <Modal
          visible={isActionSheetVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCloseActionSheet}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={handleCloseActionSheet} activeOpacity={1}>
            <View style={styles.actionSheetContainer}>
              <View style={[styles.actionSheetGroup, { backgroundColor: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,255,0.9)' }]}>
                <TouchableOpacity style={[styles.actionSheetOption, { backgroundColor: 'transparent' }]} onPress={handleViewDetails}>
                  <Text style={styles.actionSheetText}>Property Detail</Text>
                </TouchableOpacity>
                <View style={[styles.divider, { backgroundColor: isDark ? '#444' : '#E5E5E5' }]} />
                <TouchableOpacity style={[styles.actionSheetOption, { backgroundColor: 'transparent' }]} onPress={handleDeleteProperty}>
                  <Text style={[styles.actionSheetText, styles.destructiveText]}>Remove Property</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableOpacity>
        </Modal>

      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  tabsWrapper: {
    marginBottom: 20,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 12, // Gap between pills
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    paddingRight: 16,
    borderRadius: 30,
    gap: 8,
    height: 44,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#EEE',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    height: 80,
    paddingVertical: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  cardOwner: {
    fontSize: 12,
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 'auto',
  },
  perMonth: {
    fontSize: 13,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  // Action Sheet Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  actionSheetGroup: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 8,
  },
  actionSheetOption: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
  },
  actionSheetText: {
    fontSize: 18,
    color: '#007AFF', // iOS Blue
    fontWeight: '400',
  },
  destructiveText: {
    color: '#FF3B30', // iOS Red
  },
  boldText: {
    fontWeight: '600',
  },
});
