import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Dimensions, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSound } from '../context/SoundContext';
import { useNavigation } from '@react-navigation/native';
import { SheetScreen } from 'react-native-sheet-transitions';

const COLORS = [
    '#00FFFF', // Cyan (Default)
    '#FF00FF', // Magenta
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#FF0000', // Red
    '#FFFFFF', // White
];

interface Props { }

const SettingsScreen: React.FC<Props> = () => {
    const navigation = useNavigation();
    const { isSoundEnabled, toggleSound, isSfxEnabled, toggleSfx } = useSound();
    const [selectedColor, setSelectedColor] = useState('#00FFFF');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedColor = await AsyncStorage.getItem('fingerColor');
            if (savedColor) setSelectedColor(savedColor);
        } catch (e) {
            console.error('Failed to load settings', e);
        }
    };

    const handleColorSelect = async (color: string) => {
        setSelectedColor(color);
        try {
            await AsyncStorage.setItem('fingerColor', color);
        } catch (e) {
            console.error('Failed to save color', e);
        }
    };

    const handleResetScores = async () => {
        try {
            await AsyncStorage.removeItem('gameScores');
        } catch (e) {
            console.error('Failed to reset scores', e);
        }
    };

    return (
        <SheetScreen
            onClose={() => navigation.goBack()}
            dragDirections={{ toBottom: true, toTop: false, toLeft: false, toRight: false }}
            style={{ backgroundColor: 'transparent' }} // Container transparent, content handles BG
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                        <Text style={styles.closeIcon}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.content}>

                    {/* Customization Section */}
                    <Text style={styles.sectionTitle}>Customization</Text>
                    <View style={styles.colorRow}>
                        <Text style={styles.rowLabel}>Finger Color</Text>
                        <View style={styles.colorPalette}>
                            {COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        selectedColor === color && styles.selectedColorOption
                                    ]}
                                    onPress={() => handleColorSelect(color)}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Audio Section */}
                    <Text style={styles.sectionTitle}>Audio</Text>

                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>🎵</Text>
                        </View>
                        <Text style={styles.rowLabel}>Music</Text>
                        <Switch
                            trackColor={{ false: "#1F2937", true: "#3B82F6" }}
                            thumbColor={isSoundEnabled ? "#ffffff" : "#f4f3f4"}
                            onValueChange={toggleSound}
                            value={isSoundEnabled}
                        />
                    </View>
                    <View style={styles.row}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>🔊</Text>
                        </View>
                        <Text style={styles.rowLabel}>Sound FX</Text>
                        <Switch
                            trackColor={{ false: "#1F2937", true: "#3B82F6" }}
                            thumbColor={isSfxEnabled ? "#ffffff" : "#f4f3f4"}
                            onValueChange={toggleSfx}
                            value={isSfxEnabled}
                        />
                    </View>

                    {/* Account Data Section */}
                    <Text style={styles.sectionTitle}>Account Data</Text>

                    <TouchableOpacity style={styles.resetButton} onPress={handleResetScores}>
                        <Text style={styles.resetIcon}>🗑️</Text>
                        <Text style={styles.resetText}>Reset High Scores</Text>
                    </TouchableOpacity>

                    <Text style={styles.warningText}>
                        This action cannot be undone. All your stellar achievements will be cleared.
                    </Text>

                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.versionText}>STAR CATCHER V1.4.2 (STABLE BUILD)</Text>
                    <Text style={styles.stars}>★ ★ ★</Text>
                </View>
            </View>
        </SheetScreen>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B131F',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: '#3B82F6',
        fontSize: 32,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backArrow: {
        color: 'white',
        fontSize: 40,
        fontWeight: '300',
    },
    content: {
        padding: 24,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111827',
        padding: 16,
        borderRadius: 30, // Fully rounded
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    colorRow: {
        backgroundColor: '#111827',
        padding: 16,
        borderRadius: 30, // Fully rounded
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    colorPalette: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    colorOption: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedColorOption: {
        borderColor: 'white',
        transform: [{ scale: 1.2 }],
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 16,
    },
    rowLabel: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red transparent
        padding: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
        marginTop: 10,
    },
    resetIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    resetText: {
        color: '#EF4444', // Red
        fontSize: 16,
        fontWeight: '600',
    },
    warningText: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 20,
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    versionText: {
        color: '#4B5563',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    stars: {
        color: '#4B5563',
        fontSize: 10,
    }
});

export default SettingsScreen;
