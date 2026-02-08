import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  StatusBar, Dimensions, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { MOCK_CHATS } from "@/data/mockData";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface Message {
  id: string;
  text: string;
  time: string;
  isMe: boolean;
  isRead: boolean;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Find chat by id, default to first one if not found or id is '1' (Hamza) to ensure we show data
  const chatData = MOCK_CHATS.find(c => c.id === id) || MOCK_CHATS[0];

  const { theme, isDark, colors } = useTheme();

  const [messages, setMessages] = useState<Message[]>(chatData.history || []);
  const [newMessage, setNewMessage] = useState("");
  const [sessionStartIndex, setSessionStartIndex] = useState<number>(-1);
  const [menuVisible, setMenuVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom on load with a slight delay to ensure layout is ready
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    if (sessionStartIndex === -1) {
      setSessionStartIndex(messages.length);
    }

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      isRead: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
            <View>
              <Image source={{ uri: chatData.avatar }} style={styles.headerAvatar} contentFit="cover" />
              {chatData.isOnline && <View style={[styles.onlineIndicator, { borderColor: colors.background }]} />}
            </View>
            <View style={styles.headerInfo}>
              <Text style={[styles.headerName, { color: colors.text }]}>{chatData.name}</Text>
              {chatData.isOnline && <Text style={styles.headerStatus}>Online</Text>}
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="call-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => setMenuVisible(true)}>
              <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options Menu Modal */}
        <Modal
          visible={menuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.menuContainer, { backgroundColor: isDark ? '#222' : '#fff', shadowColor: isDark ? '#000' : '#888' }]}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Ionicons name="trash-outline" size={20} color={colors.text} />
                  <Text style={[styles.menuText, { color: colors.text }]}>Clear Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Ionicons name="ban-outline" size={20} color={colors.text} />
                  <Text style={[styles.menuText, { color: colors.text }]}>Block User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
                  <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
                  <Text style={[styles.menuText, { color: "#FF3B30" }]}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={[styles.messagesContainer, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                {index === sessionStartIndex && (
                  <View style={styles.dateLabelContainer}>
                    <View style={[styles.dateLabel, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
                      <Text style={[styles.dateLabelText, { color: isDark ? '#ccc' : '#888' }]}>Today</Text>
                    </View>
                  </View>
                )}
                <View style={[
                  styles.messageWrapper,
                  msg.isMe ? styles.myMessageWrapper : styles.theirMessageWrapper
                ]}>
                  <View style={[
                    styles.messageBubble,
                    msg.isMe
                      ? { backgroundColor: isDark ? '#ffffff' : '#000000', borderTopRightRadius: 4 }
                      : { backgroundColor: isDark ? '#333333' : '#F0F0F0', borderTopLeftRadius: 4 }
                  ]}>
                    <Text style={[
                      styles.messageText,
                      msg.isMe
                        ? { color: isDark ? '#000000' : '#ffffff' }
                        : { color: isDark ? '#ffffff' : '#000000' }
                    ]}>{msg.text}</Text>
                  </View>
                  <View style={styles.messageFooter}>
                    <Text style={styles.messageTime}>{msg.time}</Text>
                    {msg.isMe && (
                      <Ionicons name="checkmark-done-outline" size={16} color={isDark ? colors.text : "#000"} style={{ marginLeft: 4 }} />
                    )}
                  </View>
                </View>
              </React.Fragment>
            ))}
          </ScrollView>

          {/* Input Area */}
          <View style={[styles.inputContainer, { backgroundColor: isDark ? '#1F1F1F' : '#F9F9F9' }]}>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: isDark ? '#333' : '#000' }]}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Message...."
              placeholderTextColor="#888"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            {newMessage.length > 0 && (
              <TouchableOpacity onPress={handleSendMessage}>
                <Ionicons name="send" size={24} color={colors.text} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor handled dynamically
  },
  container: {
    flex: 1,
    // backgroundColor handled dynamically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60, // Added based on user request
    borderBottomWidth: 1,
    // borderBottomColor handled dynamically
    // backgroundColor handled dynamically
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    borderWidth: 1,
    // borderColor handled dynamically
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    // color handled dynamically
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
  },
  messagesContainer: {
    flex: 1,
    // backgroundColor handled dynamically
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  dateLabelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    // backgroundColor handled dynamically
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateLabelText: {
    // color handled dynamically
    fontSize: 12,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // myMessageBubble & theirMessageBubble removed replaced by dynamic styles inline
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  // myMessageText & theirMessageText removed replaced by dynamic styles inline
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // backgroundColor handled dynamically
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 30,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor handled dynamically
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    // color handled dynamically
    maxHeight: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 90, // Position below header 3-dots
    right: 20,
    width: 180,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
  },
});