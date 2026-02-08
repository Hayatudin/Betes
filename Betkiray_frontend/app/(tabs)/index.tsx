import { useAppState } from "@/contexts/AppStateContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BANNER_IMAGES } from '@/data/mockData';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "@/config/api";
import { Property } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const cities = ["Addis Ababa", "Nekemt", "Jijiga", "Hawassa", "Shashemene", "Arba Minch", "Hosaina", "Jimma", "Mekele"] as const;
const citySubCities: Record<string, readonly string[]> = {
  "Addis Ababa": ["All", "Arada", "Bole", "Gullele", "Yeka", "Akaky Kaliti", "Kirkos", "Lideta", "Nifas Silk-Lafto", "Kolfe Keranio", "Lemi Kura"],
  "Nekemt": ["All", "Center", "Market Area", "University Area"],
  "Jijiga": ["All", "Kebelle 01", "Kebelle 02", "Kebelle 03"],
  "Hawassa": ["All", "Tabor", "Piazza", "Industry Zone"],
  "Shashemene": ["All", "Main Road", "Market"],
  "Arba Minch": ["All", "Secha", "Sikela"],
  "Hosaina": ["All", "Area 1", "Area 2"],
  "Jimma": ["All", "Ginjo", "Mendera", "University"],
  "Mekele": ["All", "Kedamay Weyane", "Adi Haki", "Quiha"]
};

// Category icons mapping
const categoryIcons: { [key: string]: { name: string; library: 'ionicons' | 'material' } } = {
  'ALL': { name: 'grid-outline', library: 'ionicons' }, // Changed to grid-outline to match '4 squares' look better or apps
  'HOUSE': { name: 'home-outline', library: 'ionicons' },
  'APARTMENT': { name: 'business-outline', library: 'ionicons' },
  'OFFICE': { name: 'briefcase-outline', library: 'ionicons' },
  'MARKETPLACE': { name: 'storefront-outline', library: 'ionicons' },
  'RETAIL': { name: 'storefront-outline', library: 'ionicons' },
  'STUDIO': { name: 'cube-outline', library: 'ionicons' },
  'WAREHOUSE': { name: 'archive-outline', library: 'ionicons' },
};

// Hero slider data
const heroSlides = [
  {
    id: '1',
    title: 'Find Your Next Rental,\nInstantly',
    subtitle: 'Browse trusted local listings at your fingertips',
    gradient: ['#1a1a2e', '#16213e'],
  },
  {
    id: '2',
    title: 'Discover Your\nList Your Space',
    subtitle: 'Find tenants fast with our easy listing tools',
    gradient: ['#1a1a2e', '#16213e'],
  },
];

export default function HomeScreen() {
  const { allProperties, isSaved, toggleSaved, isLoading, error } = useAppState();
  const { theme, isDark, colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<(typeof cities)[number]>("Addis Ababa");
  const [locationDropdownVisible, setLocationDropdownVisible] = useState(false);
  const [selectedSubCity, setSelectedSubCity] = useState<string>("All");
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef<FlatList>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto Scroll Logic for Banner
  useEffect(() => {
    // Start auto-scrolling
    scrollInterval.current = setInterval(() => {
      setHeroIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= BANNER_IMAGES.length) {
          heroRef.current?.scrollToIndex({ index: 0, animated: true }); // seamless-ish?
          // For essentially seamless, we'd need a duplicated list, but simple loop is usually fine for this stage
          return 0;
        } else {
          heroRef.current?.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        }
      });
    }, 4000) as any; // 4 seconds

    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, []);

  const categories = useMemo(() => {
    // Fixed list as per design requirements + User request
    return ["All", "House", "Apartment", "Office", "MarketPlace"];
  }, []);

  const filteredProperties = useMemo(() => {
    let propertiesToFilter = allProperties || [];
    let cityFiltered = propertiesToFilter.filter(p => p.city === selectedCity);

    if (selectedSubCity !== "All") {
      cityFiltered = cityFiltered.filter(p => p.subCity === selectedSubCity);
    }

    const categoryFiltered = (selectedCategory === "All" || selectedCategory === "ALL")
      ? cityFiltered
      : cityFiltered.filter(p => {
        // Map UI category names to Property Types if they differ, or just use partial matching
        const propType = p.propertyType.toUpperCase();
        const selCat = selectedCategory.toUpperCase();
        if (selCat === 'MARKETPLACE') return propType === 'RETAIL' || propType === 'MARKETPLACE';
        return propType === selCat;
      });

    if (!searchQuery.trim()) {
      return categoryFiltered;
    }
    return categoryFiltered.filter(
      p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProperties, selectedCity, selectedSubCity, selectedCategory, searchQuery]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    return allProperties.filter(
      p => p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
    );
  }, [allProperties, searchQuery]);

  const API_BASE_URL = api.defaults.baseURL;

  const getCategoryIcon = (category: string) => {
    const iconData = categoryIcons[category.toUpperCase()] || { name: 'ellipse', library: 'ionicons' };
    return <Ionicons name={iconData.name as any} size={18} color={selectedCategory.toUpperCase() === category.toUpperCase() ? '#fff' : '#000'} />;
  };

  const renderPropertyCard = (property: Property, index: number) => {
    const imageUrl = property.image || (property.media?.[0]?.mediaUrl ? `${API_BASE_URL}${property.media[0].mediaUrl}` : '');
    const isLeftColumn = index % 2 === 0;

    return (
      <TouchableOpacity
        key={property.id}
        style={[styles.propertyCard, isLeftColumn ? styles.cardLeft : styles.cardRight]}
        onPress={() => router.push(`/property/${property.id}`)}
      >
        <Image source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl} style={styles.cardImage} contentFit="cover" />

        {/* Gradient Overlay for Text Visibility */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />

        {/* Badge - Top Right */}
        <View style={styles.cardBadgeContainer}>
          <BlurView intensity={30} tint="systemThinMaterialDark" style={styles.cardBadge}>
            <Text style={styles.cardBadgeText}>{property.propertyType}</Text>
          </BlurView>
        </View>

        {/* Favorite Button - Top Left */}
        <TouchableOpacity
          style={styles.cardSaveButton}
          onPress={(e) => { e.stopPropagation(); toggleSaved(property.id); }}
        >
          <Ionicons
            name={isSaved(property.id) ? "heart" : "heart-outline"}
            size={24}
            color={isSaved(property.id) ? "#FF3B30" : "#fff"}
          />
        </TouchableOpacity>

        {/* Bottom Content */}
        <View style={styles.cardCheckContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>{property.title}</Text>
          <View style={styles.cardLocationRow}>
            <Ionicons name="location-sharp" size={12} color="#fff" />
            <Text style={styles.cardLocationText} numberOfLines={1}>{property.location}</Text>
          </View>

          {/* Blurry Price Pill */}
          <BlurView intensity={80} tint="dark" style={styles.pricePillBlur}>
            <Text style={styles.cardPrice}>{Number(property.price).toLocaleString()}/month</Text>
          </BlurView>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeroSlide = ({ item }: { item: any }) => (
    <View style={styles.heroSlide}>
      <Image source={item} style={styles.heroImage} contentFit="cover" />
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[styles.locationPill, { backgroundColor: isDark ? colors.secondary : '#000' }]}
            onPress={() => setLocationDropdownVisible(true)}
          >
            <Ionicons name="location-sharp" size={16} color="#fff" />
            <Text style={styles.locationPillText}>{selectedCity}</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: isDark ? colors.secondary : '#fff', borderColor: isDark ? colors.border : '#F0F0F0' }]} onPress={() => setSearchVisible(true)}>
          <Ionicons name="search-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTitleContainer}>

        </View>

        {/* Hero Carousel */}
        <View style={styles.heroContainer}>
          <FlatList
            ref={heroRef}
            data={BANNER_IMAGES}
            renderItem={renderHeroSlide}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={() => { }} // Fallback to avoid crash on rapid scroll
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
              setHeroIndex(index);
            }}
          />
          <View style={styles.heroPagination}>
            {BANNER_IMAGES.map((_, i) => (
              <View key={i} style={[styles.heroDot, heroIndex === i ? styles.heroDotActive : styles.heroDotInactive]} />
            ))}
          </View>
        </View>

        {/* Category Section */}
        <View style={styles.categorySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {categories.map((category) => {
              const isActive = selectedCategory.toUpperCase() === category.toUpperCase();
              const iconData = categoryIcons[category.toUpperCase()] || { name: 'ellipse', library: 'ionicons' };

              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                    { backgroundColor: isActive ? (isDark ? '#fff' : '#000') : (isDark ? colors.secondary : '#fff') }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <View style={[styles.categoryIconCircle,
                  { backgroundColor: isActive ? (isDark ? '#000' : '#333') : (isDark ? '#333' : '#E0E0E0') }
                  ]}>
                    <Ionicons name={iconData.name as any} size={16} color={isActive ? '#fff' : (isDark ? '#fff' : '#000')} />
                  </View>
                  <Text style={[
                    styles.categoryChipText,
                    isActive && styles.categoryChipTextActive,
                    { color: isActive ? (isDark ? '#000' : '#fff') : colors.text }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* Properties Grid */}
        <View style={styles.propertiesGrid}>
          {filteredProperties.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="home-outline" size={48} color={colors.muted} />
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>No properties found</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {filteredProperties.map((property, index) => renderPropertyCard(property, index))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* City & Sub-City Cascading Dropdown */}
      <Modal
        visible={locationDropdownVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setLocationDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => {
            setLocationDropdownVisible(false);
            setExpandedCity(null); // Reset expansion on close
          }}
        >
          {/* Popover Menu */}
          <View style={[
            styles.dropdownContainer,
            { backgroundColor: isDark ? '#1F1F1F' : '#ffffff', borderColor: isDark ? '#333' : '#f0f0f0' },
            (expandedCity !== null) && { width: 330 } // Expand only if city clicked
          ]}>
            <View style={styles.cascadingMenuWrapper}>

              {/* Left Column: Cities */}
              <View style={[styles.cityColumn, { backgroundColor: isDark ? '#1F1F1F' : '#fff' }]}>
                <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                  {cities.map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={[
                        styles.dropdownItem,
                        selectedCity === city && { backgroundColor: isDark ? '#333' : '#fafafa' }
                      ]}
                      onPress={() => {
                        // Expand to show subcities
                        setExpandedCity(city);
                        setSelectedCity(city);
                        // Default subcity reset if changing cities?
                        if (selectedCity !== city) setSelectedSubCity("All");
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        { color: colors.text },
                        selectedCity === city && styles.dropdownItemTextSelected
                      ]}>{city}</Text>
                      {/* Show arrow if expanded, or just always arrow to indicate further options? */}
                      <Ionicons name="chevron-forward" size={14} color={isDark ? '#666' : '#ccc'} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Vertical Divider */}
              <View style={[styles.menuDivider, { borderLeftColor: isDark ? '#333' : '#f0f0f0' }]} />

              {/* Right Column: SubCities (Visible if Expanded) */}
              {expandedCity && (
                <View style={[styles.subCityColumn, { backgroundColor: isDark ? '#1A1A1A' : '#fafafa', borderLeftColor: isDark ? '#333' : '#f0f0f0' }]}>
                  <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                    {(citySubCities[expandedCity] || ["All"]).map((subCity) => (
                      <TouchableOpacity
                        key={subCity}
                        style={[
                          styles.dropdownItem,
                          selectedSubCity === subCity && { backgroundColor: isDark ? '#333' : '#e0e0e0' }
                        ]}
                        onPress={() => {
                          setSelectedSubCity(subCity);
                          setLocationDropdownVisible(false);
                          setExpandedCity(null);
                        }}
                      >
                        <Text style={[
                          styles.dropdownItemText,
                          { color: colors.text },
                          selectedSubCity === subCity && styles.dropdownItemTextSelected
                        ]}>{subCity}</Text>
                        {selectedSubCity === subCity && <Ionicons name="checkmark" size={16} color={colors.text} />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={searchVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View style={[styles.searchModal, { backgroundColor: colors.background }]}>
          <View style={[styles.searchHeader, { borderBottomColor: isDark ? '#333' : '#E0E0E0' }]}>
            <TouchableOpacity onPress={() => { setSearchVisible(false); setSearchQuery(""); }} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.searchTitle, { color: colors.text }]}>Search</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={[styles.searchInputContainer, { backgroundColor: isDark ? '#1F1F1F' : '#f5f5f5' }]}>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView style={styles.searchResults}>
            {searchResults.map(p => (
              <TouchableOpacity key={p.id} style={[styles.searchResultItem, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]} onPress={() => { setSearchVisible(false); router.push(`/property/${p.id}`); }}>
                <Text style={[styles.searchResultTitle, { color: colors.text }]}>{p.title}</Text>
                <Text style={[styles.searchResultLocation, { color: isDark ? '#bbb' : '#666' }]}>{p.location}</Text>
              </TouchableOpacity>
            ))}
            {searchResults.length === 0 && searchQuery.length > 0 && (
              <Text style={styles.noResultsText}>No properties found</Text>
            )}
            {searchResults.length === 0 && searchQuery.length === 0 && (
              <View style={{ alignItems: 'center', marginTop: 50, opacity: 0.5 }}>
                <Ionicons name="search" size={48} color={colors.text} />
                <Text style={{ marginTop: 10, color: colors.text }}>Type to search properties</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  headerAppTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  headerTitleContainer: {
    marginTop: 10,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 4,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    gap: 6,
  },
  locationPillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: '#fff',
  },
  // Hero
  heroContainer: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    height: 200,
  },
  heroSlide: {
    width: width - 32,
    height: 200,
    backgroundColor: "#ddd",
    justifyContent: "center",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroTextOverlay: {
    position: "absolute",
    left: 20,
    top: 40,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#eee",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroPagination: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  heroDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  heroDotActive: {
    backgroundColor: "#fff",
    width: 20,
  },
  heroDotInactive: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 6,
  },
  // Category
  categorySection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  categoryList: {
    paddingRight: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 30, // Pill shape
    marginRight: 10,
    borderWidth: 0,
    // Add subtle shadow or border if needed to separate from bg? Design shows plain pills on grey bg.
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
    marginRight: 12, // Extra padding on right for text
    fontWeight: "600",
  },
  categoryChipTextActive: {
    color: "#fff",
  },
  // Properties Grid
  propertiesGrid: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  propertyCard: {
    width: CARD_WIDTH,
    height: 250, // Fixed height for consistency
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    position: 'relative',
    backgroundColor: '#fff',
  },
  cardLeft: {
    marginRight: 8,
  },
  cardRight: {
    marginLeft: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardBadgeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardBadge: {
    paddingHorizontal: 12, // slightly wider
    paddingVertical: 6,
    // positioning handled by container
  },
  cardBadgeText: {
    fontSize: 10,
    color: "#fff", // White text on dark glass
    fontWeight: "700",
    textTransform: "capitalize",
  },
  cardSaveButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },

  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%', // Covers bottom 60%
  },

  cardCheckContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },

  // Removed old cardOverlay style

  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  cardLocationText: {
    fontSize: 11,
    color: "#e0e0e0",
    flex: 1,
  },

  pricePillBlur: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 2,
  },

  // Removed old pricePill

  cardPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },

  // Empty State etc
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: "#888",
  },
  bottomSpacing: {
    height: 100,
  },

  // Modals... (omitted detailed modal styles for brevity, assume they exist or use previous if needed, but here we should keep them basic)
  // Modals
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent", // No dark overlay as per usual popover look, or faint
    // We want to position content absolute, but to catch clicks we fill screen
  },
  dropdownContainer: {
    position: 'absolute',
    top: 75, // Closer to header
    left: 20,
    width: 160, // Default single width
    maxHeight: 400,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    // paddingVertical: 8, // Moved padding to ScrollView or Columns to allow flush divider

    // Shadow
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, // Increased opacity for visibility
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0", // Slightly darker border
    overflow: 'hidden', // rounded corners clip
  },
  cascadingMenuWrapper: {
    flexDirection: 'row',
    height: 320, // Fixed height for dropdown
  },
  cityColumn: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subCityColumn: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
  },
  menuDivider: {
    width: 0, // Handled by borderLeft
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 4,
    gap: 10,
  },
  dropdownHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  dropdownScroll: {
    paddingHorizontal: 0, // List flush
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemSelected: {
    backgroundColor: "#fafafa",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#333",
  },
  dropdownItemTextSelected: {
    // color: "#000", // Removed to allow dynamic color override
    fontWeight: "600",
  },
  searchModal: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 4,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
  },
  searchResults: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchResultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchResultTitle: {
    fontWeight: "600",
    color: "#000",
    fontSize: 15,
  },
  searchResultLocation: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  }
});