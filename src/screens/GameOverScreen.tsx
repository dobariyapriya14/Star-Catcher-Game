import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface GameOverScreenProps {
    score: number;
    stats: {
        stars: number;
        rainbows: number;
        bombs: number;
        hearts?: number;
        goldens?: number;
        pointsStars?: number;
        pointsRainbows?: number;
        pointsBombs?: number;
        pointsHearts?: number;
        pointsGoldens?: number;
    };
    onRestart: () => void;
    onMenu: () => void;
}

const GameOverScreen = ({ score, stats, onRestart, onMenu }: GameOverScreenProps) => {
    return (
        <View style={styles.gameOverContainer}>
            <View style={styles.gameOverCard}>
                {/* Header */}
                <Text style={styles.gameOverTitle}>GAME OVER</Text>

                {/* Final Score */}
                <View style={styles.scoreSection}>
                    <Text style={styles.scoreLabel}>FINAL SCORE</Text>
                    <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
                </View>

                {/* Stats List */}
                <View style={styles.statsContainer}>
                    {/* Stars */}
                    <View style={styles.statRow}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.2)' }]}>
                            <Text style={styles.statIcon}>⭐</Text>
                        </View>
                        <View style={styles.statDetails}>
                            <Text style={styles.statName}>Stars</Text>
                            <Text style={styles.statSub}>COLLECTED X{stats.stars}</Text>
                        </View>
                        <Text style={styles.statValue}>+{(stats.pointsStars || stats.stars).toLocaleString()}</Text>
                    </View>

                    {/* Golden Stars */}
                    <View style={styles.statRow}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 223, 0, 0.3)' }]}>
                            <Text style={styles.statIcon}>🌟</Text>
                        </View>
                        <View style={styles.statDetails}>
                            <Text style={styles.statName}>Golden Stars</Text>
                            <Text style={styles.statSub}>COLLECTED X{stats.goldens || 0}</Text>
                        </View>
                        <Text style={styles.statValue}>+{(stats.pointsGoldens || (stats.goldens ? stats.goldens * 5 : 0)).toLocaleString()}</Text>
                    </View>

                    {/* Rainbows */}
                    <View style={styles.statRow}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(128, 0, 128, 0.2)' }]}>
                            <Text style={styles.statIcon}>🌈</Text>
                        </View>
                        <View style={styles.statDetails}>
                            <Text style={styles.statName}>Rainbows</Text>
                            <Text style={styles.statSub}>BONUS X{stats.rainbows}</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#4ADE80' }]}>+{(stats.pointsRainbows || (stats.rainbows * 3)).toLocaleString()}</Text>
                    </View>

                    {/* Hearts */}
                    <View style={styles.statRow}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 105, 180, 0.2)' }]}>
                            <Text style={styles.statIcon}>❤️</Text>
                        </View>
                        <View style={styles.statDetails}>
                            <Text style={styles.statName}>Hearts</Text>
                            <Text style={styles.statSub}>LIVES X{stats.hearts || 0}</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#F472B6' }]}>+{(stats.pointsHearts || (stats.hearts ? stats.hearts * 10 : 0)).toLocaleString()}</Text>
                    </View>

                    {/* Bombs */}
                    <View style={styles.statRow}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                            <Text style={styles.statIcon}>💣</Text>
                        </View>
                        <View style={styles.statDetails}>
                            <Text style={styles.statName}>Bombs Hit</Text>
                            <Text style={styles.statSub}>PENALTY X{stats.bombs}</Text>
                        </View>
                        <Text style={[styles.statValue, { color: '#EF4444' }]}>-{Math.abs(stats.pointsBombs || (stats.bombs * 2)).toLocaleString()}</Text>
                    </View>
                </View>

                {/* Actions */}
                <TouchableOpacity onPress={onRestart} style={styles.playAgainButton}>
                    <Text style={styles.playAgainText}>PLAY AGAIN</Text>
                </TouchableOpacity>

                <View style={styles.secondaryButtons}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onMenu}>
                        <Text style={styles.secondaryButtonText}>🏠 MENU</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gameOverContainer: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        padding: 20,
    },
    gameOverCard: {
        backgroundColor: '#0f172a',
        width: '100%',
        maxWidth: 400,
        borderRadius: 30,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    gameOverTitle: {
        fontSize: 32,
        fontStyle: 'italic',
        fontWeight: '900',
        color: 'white',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        marginBottom: 20,
    },
    scoreSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    scoreLabel: {
        color: '#64748b',
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3b82f6', // Bright Blue
        textShadowColor: 'rgba(59, 130, 246, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    statsContainer: {
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    statIcon: {
        fontSize: 20,
    },
    statDetails: {
        flex: 1,
    },
    statName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statSub: {
        color: '#64748b',
        fontSize: 12,
        marginTop: 2,
    },
    statValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bestScoreContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    bestScoreLabel: {
        color: '#94a3b8',
        fontWeight: 'bold',
    },
    bestScoreValue: {
        color: 'white',
        fontWeight: 'bold',
    },
    performanceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    circleChart: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 4,
        borderColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderLeftColor: '#1e293b', // simple fake progress
    },
    circleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    performanceText: {
        flex: 1,
    },
    performanceTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    performanceDesc: {
        color: '#64748b',
        fontSize: 12,
        lineHeight: 16,
    },
    playAgainButton: {
        backgroundColor: '#3b82f6',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    playAgainText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    secondaryButtons: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#1e293b',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    secondaryButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default GameOverScreen;
