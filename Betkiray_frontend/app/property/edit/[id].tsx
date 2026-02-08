import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function EditPropertyScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");

  // Mock Fetch Data
  useEffect(() => {
    // Fetch existing data for 'id'
    setTitle("1 Room with attached Bathroom");
    setDescription("A beautiful room located in the heart of Ayat, offering great views and easy access to transport.");
    setPhone("0911234567");
  }, [id]);

  const handleSave = () => {
    if (!title || !description || !phone) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Property updated successfully", [
        { text: "OK", onPress: () => router.back() }
      ]);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: isDark ? colors.secondary : '#fff' }]} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Property</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Title</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? colors.secondary : '#fff', color: colors.text, borderColor: isDark ? colors.border : '#E0E0E0' }]}
              value={title}
              onChangeText={setTitle}
              placeholder="Property Title"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: isDark ? colors.secondary : '#fff', color: colors.text, borderColor: isDark ? colors.border : '#E0E0E0' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your property..."
              placeholderTextColor={colors.muted}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDark ? colors.secondary : '#fff', color: colors.text, borderColor: isDark ? colors.border : '#E0E0E0' }]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Contact Phone"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer / Save Button */}
      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: isDark ? colors.border : '#f0f0f0' }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: isDark ? '#fff' : '#000' }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={isDark ? '#000' : '#fff'} />
          ) : (
            <Text style={[styles.saveBtnText, { color: isDark ? '#000' : '#fff' }]}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center'
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 100 },

  inputGroup: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, marginLeft: 4 },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
  },

  footer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
