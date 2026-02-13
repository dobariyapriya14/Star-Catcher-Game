import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
    onStartGame: (mode: 'classic' | 'endless', difficulty: 'easy' | 'medium' | 'hard') => void;
    onSettings: () => void;
    onViewScore: () => void;
}

const DifficultyButton = ({ diff, difficulty, onPress }: any) => {
    const glowOpacity = useSharedValue(0.3);
    const glowScale = useSharedValue(1);
    const isActive = difficulty === diff;

    useEffect(() => {
        if (isActive) {
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );

            glowScale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        } else {
            glowOpacity.value = withTiming(0, { duration: 300 });
            glowScale.value = withTiming(1, { duration: 300 });
        }
    }, [isActive]);

    const animatedGlowStyle = useAnimatedStyle(() => {
        return {
            opacity: glowOpacity.value,
            transform: [{ scale: glowScale.value }],
        };
    });

    const getColor = () => {
        if (diff === 'easy') return '#10B981';
        if (diff === 'medium') return '#F59E0B';
        return '#EF4444';
    };

    const color = getColor();

    return (
        <View style={styles.difficultyButtonWrapper}>
            {/* Animated Glow Border - Behind the button */}
            {isActive && (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.glowBorder,
                        {
                            borderColor: color,
                            shadowColor: color,
                        },
                        animatedGlowStyle,
                    ]}
                />
            )}

            {/* Main Button */}
            <TouchableOpacity
                activeOpacity={0.7}
                style={[
                    styles.difficultyButton,
                    isActive && styles.difficultyButtonActive,
                ]}
                onPress={onPress}
            >
                <Text
                    style={[
                        styles.difficultyText,
                        isActive && styles.difficultyTextActive,
                        isActive && { color: color },
                    ]}
                >
                    {diff.toUpperCase()}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const GameMenuScreen: React.FC<Props> = ({ onStartGame, onSettings, onViewScore }) => {
    const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('easy');

    // Generate random stars for background
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

            {/* Difficulty Selector */}
            <View style={styles.difficultyContainer}>
                <Text style={styles.sectionTitle}>SELECT DIFFICULTY</Text>

                <View style={styles.difficultyButtons}>
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                        <DifficultyButton
                            key={diff}
                            diff={diff}
                            difficulty={difficulty}
                            onPress={() => setDifficulty(diff)}
                        />
                    ))}
                </View>
            </View>

            {/* Menu Buttons */}
            <View style={styles.menuContainer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => onStartGame('classic', difficulty)}
                >
                    <Text style={styles.playIcon}>⏳</Text>
                    <View>
                        <Text style={styles.startButtonText}>CLASSIC MODE</Text>
                        <Text style={styles.buttonSubText}>60s Timer • 3 Lives</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: '#7C3AED' }]}
                    onPress={() => onStartGame('endless', difficulty)}
                >
                    <Text style={styles.playIcon}>♾️</Text>
                    <View>
                        <Text style={styles.startButtonText}>ENDLESS MODE</Text>
                        <Text style={styles.buttonSubText}>No Timer • High Score</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
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
        fontSize: 30,
    },
    iconButton: {
        width: 54,
        height: 54,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsIcon: {
        fontSize: 30,
        color: '#9CA3AF',
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
    difficultyContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    sectionTitle: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 15,
    },
    difficultyButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 10,
    },
    difficultyButtonWrapper: {
        flex: 1,
        position: 'relative',
    },
    glowBorder: {
        position: 'absolute',
        top: -2,
        left: 0,
        right: 0,
        bottom: -2,
        borderRadius: 17,
        borderWidth: 3,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 10,
    },
    difficultyButton: {
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    difficultyButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    difficultyText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1,
    },
    difficultyTextActive: {
        fontSize: 13,
        fontWeight: '800',
    },
});

export default GameMenuScreen;