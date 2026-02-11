import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScoreStats {
    stars: number;
    rainbows: number;
    bombs: number;
    hearts: number;
    goldens: number;
    pointsStars: number;
    pointsRainbows: number;
    pointsBombs: number;
    pointsHearts: number;
    pointsGoldens: number;
}

interface ScoreEntry {
    id: string;
    score: number;
    date: string;
    mode: 'classic' | 'endless';
    stats?: ScoreStats;
}

interface Props {
    onBack: () => void;
}

const ScoreScreen: React.FC<Props> = ({ onBack }) => {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [totalStats, setTotalStats] = useState({
        totalScore: 0,
        totalStars: 0,
        totalGoldens: 0,
        totalRainbows: 0,
        totalBombs: 0
    });

    console.log('score', JSON.stringify(scores))
    console.log('totalStats', totalStats)

    useEffect(() => {
        loadScores();
    }, []);

    const loadScores = async () => {
        try {
            const storedScores = await AsyncStorage.getItem('gameScores');
            if (storedScores) {
                const parsedScores: ScoreEntry[] = JSON.parse(storedScores);

                // Remove duplicates based on score and mode FIRST to correct totals
                const uniqueScores: ScoreEntry[] = [];
                const seen = new Set<string>();

                for (const item of parsedScores) {
                    // Key based on score and mode prevents duplicate score entries from showing up
                    const key = `${item.score}-${item.mode}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        uniqueScores.push(item);
                    }
                }

                // Calculate Totals from UNIQUE games only
                const totals = uniqueScores.reduce((acc, curr) => {
                    return {
                        totalScore: acc.totalScore + (curr.score || 0),
                        totalStars: acc.totalStars + (curr.stats?.stars || 0),
                        totalGoldens: acc.totalGoldens + (curr.stats?.goldens || 0),
                        totalRainbows: acc.totalRainbows + (curr.stats?.rainbows || 0),
                        totalBombs: acc.totalBombs + (curr.stats?.bombs || 0)
                    };
                }, { totalScore: 0, totalStars: 0, totalGoldens: 0, totalRainbows: 0, totalBombs: 0 });

                setTotalStats(totals);

                // Sort by score descending
                uniqueScores.sort((a, b) => b.score - a.score);
                setScores(uniqueScores);
            }
        } catch (e) {
            console.error('Failed to load scores', e);
        }
    };

    const renderItem = ({ item, index }: { item: ScoreEntry; index: number }) => {
        const s = item.stats;
        return (
            <View style={styles.scoreCard}>
                <View style={styles.scoreRowHeader}>
                    <View style={styles.rankContainer}>
                        <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <View style={styles.scoreDetails}>
                        <Text style={styles.scoreValue}>{item.score.toLocaleString()}</Text>
                        <Text style={styles.scoreDate}>{new Date(item.date).toLocaleDateString()} • {item.mode.toUpperCase()}</Text>
                    </View>

                </View>

                {s && (
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>⭐</Text>
                            <Text style={styles.statText}>{s.stars || 0}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>🌟</Text>
                            <Text style={styles.statText}>{s.goldens || 0}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>🌈</Text>
                            <Text style={styles.statText}>{s.rainbows || 0}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statIcon}>💣</Text>
                            <Text style={[styles.statText, { color: '#EF4444' }]}>
                                {s.bombs || 0}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0B131F" />
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.closeButton}>
                    <Text style={styles.closeIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>High Scores</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={scores}
                ListHeaderComponent={
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>LIFETIME STATS</Text>
                        <View style={[styles.summaryItem, { width: '100%', marginBottom: 12 }]}>
                            <Text style={styles.summaryLabel}>TOTAL SCORE</Text>
                            <Text style={[styles.summaryValue, { color: '#3B82F6', fontSize: 24 }]}>{totalStats.totalScore.toLocaleString()}</Text>
                        </View>
                        <View style={styles.summaryGrid}>
                            <View style={[styles.summaryItem, { width: '45%' }]}>
                                <Text style={styles.summaryLabel}>STARS</Text>
                                <Text style={[styles.summaryValue, { color: '#FCD34D' }]}>{totalStats.totalStars.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.summaryItem, { width: '45%' }]}>
                                <Text style={styles.summaryLabel}>GOLDENS</Text>
                                <Text style={[styles.summaryValue, { color: '#fbbf24' }]}>{totalStats.totalGoldens.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.summaryItem, { width: '45%' }]}>
                                <Text style={styles.summaryLabel}>RAINBOWS</Text>
                                <Text style={[styles.summaryValue, { color: '#A78BFA' }]}>{totalStats.totalRainbows.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.summaryItem, { width: '45%' }]}>
                                <Text style={styles.summaryLabel}>BOMBS</Text>
                                <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{totalStats.totalBombs.toLocaleString()}</Text>
                            </View>
                        </View>
                    </View>
                }
                renderItem={renderItem}
                keyExtractor={(item) => item.id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No games played yet.</Text>
                        <Text style={styles.emptySubText}>Go catch some stars!</Text>
                    </View>
                }
            />
        </View>
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
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
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
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1,
    },
    listContent: {
        padding: 20,
    },
    scoreCard: {
        backgroundColor: '#111827',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
        padding: 16,
    },
    scoreRowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rankContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rankText: {
        color: '#9CA3AF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scoreDetails: {
        flex: 1,
    },
    scoreValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    scoreDate: {
        color: '#6B7280',
        fontSize: 12,
        fontWeight: '500',
    },
    medal: {
        fontSize: 24,
        marginLeft: 10,
    },
    statsGrid: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 12,
        padding: 8,
        justifyContent: 'space-around',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    statText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubText: {
        color: '#6B7280',
        fontSize: 14,
    },
    summaryContainer: {
        padding: 20,
        backgroundColor: '#111827',
        margin: 20,
        marginBottom: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    summaryTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: 1,
        textAlign: 'center',
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    summaryItem: {
        width: '45%', // Reduced from 48% to ensure 2 items fit per row on smaller screens
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 1,
    },
    summaryValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default ScoreScreen;
