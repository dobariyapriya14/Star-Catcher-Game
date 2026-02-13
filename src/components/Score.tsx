import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";

interface ScoreProps {
    score: number;
    time: number;
    lives: number;
    mode?: 'classic' | 'endless';
    difficulty?: 'easy' | 'medium' | 'hard';
}

const { width } = Dimensions.get("window");

const Score = ({ score, time, lives, mode = 'classic', difficulty }: ScoreProps) => {
    // simple clamp 0..1
    const progress = Math.min(Math.max(time / 60, 0), 1);

    return (
        <View style={styles.scoreContainer}>
            {/* Top Cyan Progress Bar - Only for Classic */}
            {mode === 'classic' && (
                <View style={styles.progressTrack}>
                    <View style={[styles.progressBar, { width: progress * (width - 40) }]} />
                </View>
            )}

            <View style={styles.headerRow}>
                {/* Score Section */}
                <View>
                    <Text style={styles.label}>SCORE ({difficulty?.toUpperCase()})</Text>
                    <Text style={styles.valueText}>
                        {score.toLocaleString()}
                    </Text>

                    {/* Lives (Hearts) */}
                    <View style={styles.heartsRow}>
                        {[1, 2, 3].map((i) => (
                            <Text key={i} style={[styles.heartText, { opacity: i <= lives ? 1 : 0.2 }]}>
                                ❤️
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Time Section - Only for Classic */}
                {mode === 'classic' && (
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.label}>TIME LEFT</Text>
                        <View style={styles.timeRow}>
                            <Text style={styles.timerIcon}>⏱</Text>
                            <Text style={styles.valueText}>
                                {Math.ceil(time)}s
                            </Text>
                        </View>
                    </View>
                )}

                {mode === 'endless' && (
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.label}>MODE</Text>
                        <View style={styles.timeRow}>
                            <Text style={styles.timerIcon}>♾️</Text>
                            <Text style={styles.valueText}>
                                ENDLESS
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scoreContainer: {
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    progressTrack: {
        height: 6,
        backgroundColor: '#1a1a1a',
        width: '100%',
        borderRadius: 3,
        marginBottom: 15,
        overflow: 'hidden'
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#00FFFF', // Cyan
        borderRadius: 3,
        shadowColor: "#00FFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    label: {
        fontSize: 16,
        color: '#888',
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 4,
    },
    valueText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    heartsRow: {
        flexDirection: 'row',
        marginTop: 5,
    },
    heartText: {
        fontSize: 18,
        marginRight: 4,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerIcon: {
        fontSize: 30,
        color: '#00FFFF',
        marginRight: 8,
    }
});

export { Score };
