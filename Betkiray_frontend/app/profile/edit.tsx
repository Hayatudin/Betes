import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const [name, setName] = useState("Hamza Safi");
  const [phone, setPhone] = useState("0963799603");
  const [email, setEmail] = useState("hamzasafi@gmail.com");
  const [image, setImage] = useState("https://i.pravatar.cc/300?img=11");
  const { theme, isDark, colors } = useTheme();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: image }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: isDark ? colors.secondary : '#fff' }]}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter full name"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />

          <View style={styles.inputRow}>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter phone"
              keyboardType="phone-pad"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: isDark ? colors.border : '#f0f0f0' }]} />

          <View style={styles.inputRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>Delete Account</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#000' },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },

  avatarSection: { alignItems: 'center', marginVertical: 30 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd' },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#000', // Camera btn usually black/white
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'transparent' // Border color managed by view background overlap usually, or dynamic
  },

  formCard: {
    backgroundColor: '#fff', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginBottom: 30
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18
  },
  label: { fontSize: 14, color: '#888', width: 110 },
  input: {
    flex: 1, fontSize: 16, fontWeight: '600', color: '#000', textAlign: 'right'
  },
  divider: { height: 1, backgroundColor: '#f0f0f0' },

  saveBtn: {
    backgroundColor: '#000', borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginBottom: 20
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  deleteBtn: {
    backgroundColor: '#ffe5e5', borderRadius: 30, paddingVertical: 18, alignItems: 'center', marginBottom: 20
  },
  deleteBtnText: { color: '#d93025', fontSize: 16, fontWeight: '600' }
});
