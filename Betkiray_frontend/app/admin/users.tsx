import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "@/config/api";
import { UserData, Property } from "@/types";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.4:3000";

// Extended user type for detailed view
interface UserDetails extends UserData {
  phone?: string;
  properties: Property[];
  propertyCount: number;
}

const SAMPLE_USERS: UserData[] = [
  {
    id: "1",
    name: "Esayas Tesfaye",
    email: "esayas@example.com",
    role: "OWNER",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mubarek Hassen",
    email: "mubarek@example.com",
    role: "OWNER",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Hayatuden Jemal",
    email: "hayatuden@example.com",
    role: "RENTER",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Fuad Mahmud",
    email: "fuad@example.com",
    role: "OWNER",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Sifen Abdela",
    email: "sifen@example.com",
    role: "RENTER",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Munteha Beyan",
    email: "munteha@example.com",
    role: "OWNER",
    image: null, // Test placeholder
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Mikasa Ackerman",
    email: "mikasa@example.com",
    role: "RENTER",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    isBanned: false,
    createdAt: new Date().toISOString(),
  },
];

export default function ManageUsersScreen() {
  const { colors, isDark } = useTheme();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Try to fetch from API
      const response = await api.get("/admin/users");
      if (response.data && response.data.length > 0) {
        setUsers(response.data);
      } else {
        // Fallback to sample data if API returns empty (for demo purposes)
        setUsers(SAMPLE_USERS);
      }
    } catch (err) {
      console.log("Failed to fetch users, using sample data");
      setUsers(SAMPLE_USERS); // Use sample data on error for demo
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoadingDetails(true);
      // For sample data, we mock the details response if it's a sample ID
      const isSample = SAMPLE_USERS.some((u) => u.id === userId);

      if (isSample) {
        // Mock details for sample users
        const user = users.find(u => u.id === userId);
        if (user) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setSelectedUser({
            ...user,
            phone: "+251 91 123 4567",
            properties: [],
            propertyCount: 0
          });
          setModalVisible(true);
        }
      } else {
        const response = await api.get(`/admin/users/${userId}`);
        setSelectedUser(response.data);
        setModalVisible(true);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch user details.");
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleBan = async (
    userId: string,
    isCurrentlyBanned: boolean
  ) => {
    const action = isCurrentlyBanned ? "unban" : "ban";
    Alert.alert(
      `Confirm ${action}`,
      `Are you sure you want to ${action} this user?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: `Yes, ${action}`,
          onPress: async () => {
            try {
              // Check if it's a sample user
              const isSample = SAMPLE_USERS.some(u => u.id === userId);

              if (!isSample) {
                await api.patch(`/admin/users/${userId}/status`, {
                  isBanned: !isCurrentlyBanned,
                });
                await fetchUsers();
              } else {
                // Local update for sample data
                setUsers(prev => prev.map(u =>
                  u.id === userId ? { ...u, isBanned: !isCurrentlyBanned } : u
                ));
              }

              // Also update modal if open
              if (selectedUser && selectedUser.id === userId) {
                setSelectedUser({ ...selectedUser, isBanned: !isCurrentlyBanned });
              }
            } catch (error) {
              Alert.alert("Error", `Could not ${action} the user.`);
            }
          },
        },
      ]
    );
  };

  const getFilteredUsers = () => {
    if (!searchText.trim()) return users;
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    if (role === 'OWNER') return 'Property Owner';
    if (role === 'RENTER') return 'Renter';
    if (role === 'ADMIN') return 'Admin';
    return role;
  };

  const getPropertyImage = (property: Property) => {
    if (property.media && property.media.length > 0) {
      const imageUrl = property.media[0].mediaUrl;
      if (imageUrl.startsWith("http")) {
        return imageUrl;
      }
      return `${API_URL}${imageUrl}`;
    }
    return null;
  };

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#22c55e";
      case "PENDING":
        return "#f59e0b";
      case "REJECTED":
        return "#ef4444";
      default:
        return "#999";
    }
  };

  if (isLoading) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  const filteredUsers = getFilteredUsers();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <AdminHeader title="Users" />

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
        <Ionicons
          name="search"
          size={20}
          color={colors.muted}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search users..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.muted}
        />
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              style={[styles.userCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}
              onPress={() => fetchUserDetails(item.id)}
              activeOpacity={0.7}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: item.role === 'OWNER' ? '#10b981' : '#3b82f6' }]}>
                  <Text style={styles.avatarText}>
                    {getInitials(item.name)}
                  </Text>
                </View>
              )}
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.userRole, { color: colors.muted }]}>
                  {getRoleDisplay(item.role)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => fetchUserDetails(item.id)}
              >
                <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No users found.</Text>
        )}
      </ScrollView>

      {/* User Details Modal - Keeping existing logic but restyled slightly if needed */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>User Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={true}
              >
                {/* User Profile Section */}
                <View style={styles.profileSection}>
                  {selectedUser.image ? (
                    <Image
                      source={{ uri: selectedUser.image }}
                      style={styles.profileAvatar}
                    />
                  ) : (
                    <View style={styles.profileAvatarPlaceholder}>
                      <Text style={styles.profileAvatarText}>
                        {getInitials(selectedUser.name)}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.profileName, { color: colors.text }]}>{selectedUser.name}</Text>
                  <View style={[
                    styles.statusBadge,
                    selectedUser.isBanned ? styles.bannedBadge : styles.activeBadge
                  ]}>
                    <Text style={[
                      styles.statusBadgeText,
                      selectedUser.isBanned ? styles.bannedBadgeText : styles.activeBadgeText
                    ]}>
                      {selectedUser.isBanned ? "Banned" : "Active"}
                    </Text>
                  </View>
                </View>

                {/* User Info Cards */}
                <View style={styles.infoSection}>
                  <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#EEEEEE' }]}>
                    <Ionicons name="mail-outline" size={20} color={colors.text} />
                    <View style={styles.infoCardContent}>
                      <Text style={[styles.infoLabel, { color: colors.muted }]}>Email</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{selectedUser.email}</Text>
                    </View>
                  </View>

                  {selectedUser.phone && (
                    <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#EEEEEE' }]}>
                      <Ionicons name="call-outline" size={20} color={colors.text} />
                      <View style={styles.infoCardContent}>
                        <Text style={[styles.infoLabel, { color: colors.muted }]}>Phone</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{selectedUser.phone}</Text>
                      </View>
                    </View>
                  )}

                  <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#EEEEEE' }]}>
                    <Ionicons name="shield-outline" size={20} color={colors.text} />
                    <View style={styles.infoCardContent}>
                      <Text style={[styles.infoLabel, { color: colors.muted }]}>Role</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {getRoleDisplay(selectedUser.role)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#EEEEEE' }]}>
                    <Ionicons name="home-outline" size={20} color={colors.text} />
                    <View style={styles.infoCardContent}>
                      <Text style={[styles.infoLabel, { color: colors.muted }]}>Properties</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>
                        {selectedUser.propertyCount} properties
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Properties Section */}
                {selectedUser.properties && selectedUser.properties.length > 0 && (
                  <View style={styles.propertiesSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Posted Properties</Text>
                    {selectedUser.properties.map((property) => (
                      <View key={property.id} style={[styles.propertyCard, { backgroundColor: isDark ? '#333' : '#f8fafc' }]}>
                        {getPropertyImage(property) ? (
                          <Image
                            source={{ uri: getPropertyImage(property)! }}
                            style={styles.propertyImage}
                          />
                        ) : (
                          <View style={styles.propertyImagePlaceholder}>
                            <Ionicons name="image-outline" size={24} color="#ccc" />
                          </View>
                        )}
                        <View style={styles.propertyInfo}>
                          <Text style={[styles.propertyTitle, { color: colors.text }]} numberOfLines={1}>
                            {property.title}
                          </Text>
                          <Text style={styles.propertyLocation} numberOfLines={1}>
                            {property.city}, {property.subCity || property.address}
                          </Text>
                          <View style={styles.propertyMeta}>
                            <Text style={styles.propertyPrice}>
                              ETB {Number(property.price).toLocaleString()}
                            </Text>
                            <View style={[
                              styles.approvalBadge,
                              { backgroundColor: getApprovalStatusColor(property.approvalStatus) + "20" }
                            ]}>
                              <Text style={[
                                styles.approvalBadgeText,
                                { color: getApprovalStatusColor(property.approvalStatus) }
                              ]}>
                                {property.approvalStatus}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Ban/Unban Button */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    selectedUser.isBanned ? styles.unbanButton : styles.banButton
                  ]}
                  onPress={() => handleToggleBan(selectedUser.id, selectedUser.isBanned)}
                >
                  <Ionicons
                    name={selectedUser.isBanned ? "checkmark-circle-outline" : "ban-outline"}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.actionButtonText}>
                    {selectedUser.isBanned ? "Unban User" : "Ban User"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    // Soft shadow for search bar
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    height: "100%",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
    fontSize: 14,
  },
  userCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    backgroundColor: "#f0f0f0",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#10b981", // Default Green
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 13,
    fontWeight: "400",
  },
  moreButton: {
    padding: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  // Profile Section
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileAvatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5b9bd5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileAvatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: "#EEEEEE",
  },
  bannedBadge: {
    backgroundColor: "#fee2e2",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeBadgeText: {
    color: "#000000ff",
  },
  bannedBadgeText: {
    color: "#ef4444",
  },
  // Info Section
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoCardContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Properties Section
  propertiesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  propertyCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  propertyImage: {
    width: 80,
    height: 80,
  },
  propertyImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  propertyInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  propertyMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  propertyPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5b9bd5",
  },
  approvalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  approvalBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  // Action Button
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  banButton: {
    backgroundColor: "#ef4444",
  },
  unbanButton: {
    backgroundColor: "#22c55e",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
