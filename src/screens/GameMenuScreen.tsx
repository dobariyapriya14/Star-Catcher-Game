import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Props {
    onStartGame: (mode: 'classic' | 'endless') => void;
    onSettings: () => void;
    onViewScore: () => void;
}

const GameMenuScreen: React.FC<Props> = ({ onStartGame, onSettings, onViewScore }) => {
    // Generate random stars for background (Static, created once)
    const stars = useMemo(() => {
        return Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 3 + 1;
            return (
                <View
                    key={i}
                    style={{
                        position: 'absolute',
                        top: Math.random() * height,
                        left: Math.random() * width,
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.1) + ')',
                    }}
                />
            );
        });
    }, []);

    return (
        <>
            <View style={styles.container}>
                {stars}

                {/* Header: Score (Left) & Settings (Right) */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.scoreButton} onPress={onViewScore}>
                        <Text style={styles.scoreButtonText}>🏆</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={onSettings}>
                        <Text style={styles.settingsIcon}>⚙️</Text>
                    </TouchableOpacity>
                </View>

                {/* Title Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.editionText}>NEON EDITION</Text>
                    <Text style={styles.mainTitle}>STAR</Text>
                    <Text style={styles.mainTitle}>CATCHER</Text>
                </View>

                {/* Menu Buttons */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.startButton} onPress={() => onStartGame('classic')}>
                        <Text style={styles.playIcon}>⏳</Text>
                        <View>
                            <Text style={styles.startButtonText}>CLASSIC MODE</Text>
                            <Text style={styles.buttonSubText}>60s Timer • 3 Lives</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.startButton, { backgroundColor: '#7C3AED' }]} onPress={() => onStartGame('endless')}>
                        <Text style={styles.playIcon}>♾️</Text>
                        <View>
                            <Text style={styles.startButtonText}>ENDLESS MODE</Text>
                            <Text style={styles.buttonSubText}>No Timer • High Score</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050B14',
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        paddingHorizontal: 10,
    },
    scoreButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    scoreButtonText: {
        color: '#E5E7EB',
        fontWeight: 'bold',
        fontSize: 24,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#3B82F6', // Blue ring
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#60A5FA',
        shadowColor: '#60A5FA',
        shadowRadius: 10,
        shadowOpacity: 1,
        elevation: 5,
    },
    playerLabel: {
        color: '#3B82F6',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    playerName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    iconButton: {
        width: 54,
        height: 54,
        borderRadius: 22,
        // backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: 'white',
        fontSize: 22,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 20,
    },
    editionText: {
        color: '#3B82F6',
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 4,
        marginBottom: 8,
    },
    mainTitle: {
        fontSize: 56,
        fontWeight: '900',
        color: 'white',
        fontStyle: 'italic',
        lineHeight: 60,
        textShadowColor: 'rgba(59, 130, 246, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    menuContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 20,
    },
    startButton: {
        width: '100%',
        height: 64,
        borderRadius: 32,
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    playIcon: {
        color: 'white',
        fontSize: 24,
        marginRight: 10,
    },
    startButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    buttonSubText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
    },
    settingsIcon: {
        fontSize: 24,
        marginRight: 8,
        color: '#9CA3AF',
    },
    settingsText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    chapterCardContainer: {
        width: '100%',
        marginBottom: 30,
    },
    chapterCard: {
        width: '100%',
        height: 100,
        borderRadius: 30,
        backgroundColor: '#111827',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    cardOverlay: { // Gradient placeholder
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        zIndex: -1,
    },
    chapterContent: {
        justifyContent: 'center',
    },
    chapterLabel: {
        color: '#3B82F6',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 4,
    },
    chapterTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    arrowIcon: {
        color: '#6B7280',
        fontSize: 24,
        fontWeight: '300',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    soundButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    soundIcon: {
        color: '#3B82F6',
        fontSize: 16,
        marginRight: 8,
    },
    soundText: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    versionText: {
        color: '#4B5563', // Dark gray
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    }
});

export default GameMenuScreen;
