import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

interface ActionSheetProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    options: {
        label: string;
        isDestructive?: boolean;
        onPress: () => void;
    }[];
}

const { width } = Dimensions.get('window');

export default function ActionSheet({ visible, onClose, title, options }: ActionSheetProps) {
    const { isDark, colors } = useTheme();

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.sheetContainer}>
                        {/* Options Group */}
                        <View style={[styles.group, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
                            {title && (
                                <View style={[styles.titleContainer, { borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }]}>
                                    <Text style={[styles.title, { color: isDark ? '#8E8E93' : '#8F8F8F' }]}>{title}</Text>
                                </View>
                            )}

                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.option,
                                        index < options.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA' }
                                    ]}
                                    onPress={() => {
                                        option.onPress();
                                        onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.optionText,
                                        { color: isDark ? '#0A84FF' : '#007AFF' },
                                        option.isDestructive && { color: '#FF3B30' }
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        padding: 10,
        paddingBottom: 20, // Bottom safety
    },
    group: {
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 8,
    },
    titleContainer: {
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
    },
    option: {
        paddingVertical: 18,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    optionText: {
        fontSize: 20,
        fontWeight: '400',
    },
    cancelButton: {
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 20,
        fontWeight: '600',
    },
});
