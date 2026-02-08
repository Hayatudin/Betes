// app/(admin)/settings.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomSwitch from "@/components/ui/CustomSwitch";
import { useTheme } from "@/contexts/ThemeContext";
import AdminHeader from "@/components/AdminHeader";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoApproval, setAutoApproval] = useState(true);
  const [reviewPeriod, setReviewPeriod] = useState("3 Days");
  const [showDropdown, setShowDropdown] = useState(false);

  // Review Period Options
  const reviewOptions = ["1 Day", "3 Days", "5 Days", "7 Days", "14 Days"];

  const handleUserPanelPress = () => {
    // Navigate back to the home page (User Panel)
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* Header */}
      <AdminHeader title="Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* General Settings */}
        <Text style={styles.sectionTitle}>GENERAL SETTINGS</Text>
        <View style={[styles.cardContainer, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          {/* Push Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.leftContent}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} style={styles.icon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <CustomSwitch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              scale={0.8}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]} />

          {/* Roles & Permissions */}
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/admin/roles")}>
            <View style={styles.leftContent}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.text} style={styles.icon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Roles & Permissions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]} />

          {/* Security */}
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/admin/security")}>
            <View style={styles.leftContent}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.text} style={styles.icon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Property Rules */}
        <Text style={styles.sectionTitle}>PROPERTY RULES</Text>
        <View style={[styles.cardContainer, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          {/* Auto Approval */}
          <View style={styles.settingItem}>
            <View style={styles.leftContent}>
              <Ionicons name="refresh-outline" size={22} color={colors.text} style={styles.icon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Auto Approval</Text>
            </View>
            <CustomSwitch
              value={autoApproval}
              onValueChange={setAutoApproval}
              scale={0.8}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]} />

          {/* Review Period */}
          <TouchableOpacity
            style={[styles.settingItem, !autoApproval && { opacity: 0.4 }]}
            onPress={() => autoApproval && setShowDropdown(true)}
            disabled={!autoApproval}
          >
            <View style={styles.leftContent}>
              <Ionicons name="time-outline" size={22} color={colors.text} style={styles.icon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Review Period</Text>
            </View>
            <View style={[styles.periodSelector, {
              backgroundColor: isDark ? '#333' : '#F5F5F5',
              borderColor: isDark ? '#444' : '#E0E0E0'
            }]}>
              <Text style={[styles.periodText, { color: colors.text }]}>{reviewPeriod}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.muted} style={{ marginLeft: 4 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* User Panel Button */}
        <View style={styles.floatBtnContainer}>
          <TouchableOpacity style={[styles.userPanelBtn, { backgroundColor: isDark ? '#fff' : '#000' }]} onPress={handleUserPanelPress}>
            <Ionicons name="person-circle-outline" size={20} color={isDark ? '#000' : '#fff'} style={{ marginRight: 8 }} />
            <Text style={[styles.userPanelText, { color: isDark ? '#000' : '#fff' }]}>User Panel</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Custom Dropdown Modal */}
      <Modal
        transparent={true}
        visible={showDropdown}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.dropdownContent, { backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>Select Review Period</Text>
              {reviewOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dropdownItem, { borderBottomColor: isDark ? '#333' : '#f0f0f0' }]}
                  onPress={() => {
                    setReviewPeriod(option);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: colors.muted },
                    reviewPeriod === option && [styles.selectedOptionText, { color: colors.text }]
                  ]}>
                    {option}
                  </Text>
                  {reviewPeriod === option && <Ionicons name="checkmark" size={18} color={colors.text} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7D849A',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  cardContainer: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 14,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: 36, // Indented
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 100,
    justifyContent: 'space-between',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
  floatBtnContainer: {
    alignItems: 'flex-end',
    marginTop: 30,
    marginBottom: 20,
  },
  userPanelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 100,
  },
  userPanelText: {
    fontWeight: '600',
    fontSize: 14,
  },

  // Dropdown Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    width: '80%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: '700',
  }
});
