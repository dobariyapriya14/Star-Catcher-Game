import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40; // Horizontal padding 20 * 2

interface Props {
    onPlay: () => void;
    onClose: () => void;
}

const SLIDES = [
    {
        id: '1',
        title: 'Drag to move',
        description: 'Touch the neon orb and slide it towards the falling stars.',
        subtext: 'Collect stars before time runs out!',
        visualType: 'drag',
    },
    {
        id: '2',
        title: 'Collect Stars',
        description: 'Grab Golden Stars for extra time and points. Rainbow Stars are rare powerups!',
        subtext: 'Build your streak for higher scores.',
        visualType: 'collect',
    },
    {
        id: '3',
        title: 'Avoid Hazards',
        description: 'Watch out for Red Bombs! Hitting them will decrease your life.',
        subtext: 'Stay sharp and survive.',
        visualType: 'hazards',
    }
];

const HowToPlayScreen: React.FC<Props> = ({ onPlay, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            onPlay();
        }
    };

    const renderVisual = (type: string) => {
        if (type === 'drag') {
            return (
                <View style={styles.visualContainer}>
                    <View style={styles.dashedLine} />
                    <View style={styles.targetStar}>
                        <Text style={styles.starIcon}>★</Text>
                    </View>
                    <View style={styles.playerOrb}>
                        <View style={styles.orbInner} />
                        <View style={styles.fingerIcon}>
                            <Text style={{ fontSize: 30 }}>👆</Text>
                        </View>
                    </View>
                </View>
            );
        } else if (type === 'collect') {
            return (
                <View style={styles.visualContainer}>
                    <View style={[styles.targetStar, { marginBottom: 0, transform: [{ scale: 1.5 }] }]}>
                        <Text style={styles.starIcon}>🌟</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 40, right: 80 }}>
                        <Text style={{ fontSize: 24 }}>🌈</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 40, left: 80 }}>
                        <Text style={{ fontSize: 24 }}>🌈</Text>
                    </View>
                </View>
            );
        } else if (type === 'hazards') {
            return (
                <View style={styles.visualContainer}>
                    <View style={[styles.targetStar, { marginBottom: 0, transform: [{ scale: 1.2 }], borderColor: '#ff3333', backgroundColor: 'rgba(255, 50, 50, 0.2)', shadowColor: 'red' }]}>
                        <View style={styles.bombInner}>
                            <Text style={{ fontSize: 30, color: '#ff3333' }}>!</Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 40 }}>💣</Text>
                    </View>
                </View>
            );
        }
        return null;
    };

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={[styles.card, { width: CARD_WIDTH }]}>
                {renderVisual(item.visualType)}

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>
                        {item.description}
                    </Text>

                    {item.visualType === 'drag' && (
                        <View style={styles.timerContainer}>
                            <View style={styles.timerBox}>
                                <Text style={styles.timerValue}>00</Text>
                                <Text style={styles.timerLabel}>Minutes</Text>
                            </View>
                            <View style={styles.timerBox}>
                                <Text style={styles.timerValue}>15</Text>
                                <Text style={styles.timerLabel}>Seconds</Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.subtext}>{item.subtext}</Text>
                </View>
            </View>
        );
    };

    return (
        <>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>How to Play</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Slider */}
                <View style={{ marginBottom: 60 }}>
                    <FlatList
                        ref={flatListRef}
                        data={SLIDES}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                    />
                </View>

                {/* Pagination Dots */}
                <View style={styles.dotsContainer}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>

                {/* Footer Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.playButton} onPress={handleNext}>
                        <Text style={styles.playButtonText}>
                            {currentIndex === SLIDES.length - 1 ? "Got it, let's play!" : "Next"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B131F',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingBottom: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: '#3B82F6',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    card: {
        flex: 1,
        backgroundColor: '#111827',
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
        paddingVertical: 40,
        justifyContent: 'space-between',
        marginRight: 0, // Should fill the width controlled by parent
    },
    visualContainer: {
        height: 200,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    dashedLine: {
        position: 'absolute',
        height: 100,
        width: 2,
        backgroundColor: '#3B82F6', // Blue
        top: 50,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#3B82F6',
        borderRadius: 1,
    },
    targetStar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 215, 0, 0.2)', // Gold glowing
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
        marginBottom: 80, // Space between star and orb
        zIndex: 2,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    starIcon: {
        color: '#FFD700',
        fontSize: 30,
    },
    playerOrb: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#3B82F6',
        zIndex: 2,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    orbInner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3B82F6',
    },
    fingerIcon: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        transform: [{ rotate: '-10deg' }],
    },
    textContainer: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    description: {
        color: '#9CA3AF',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
    },
    timerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#1F2937',
        borderRadius: 20,
        padding: 4,
        marginBottom: 20,
    },
    timerBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 16,
        backgroundColor: '#1F2937',
    },
    timerValue: {
        color: '#3B82F6',
        fontSize: 20,
        fontWeight: 'bold',
    },
    timerLabel: {
        color: '#6B7280',
        fontSize: 12,
    },
    subtext: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 30,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#1F2937',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#3B82F6',
    },
    footer: {
        paddingVertical: 20,
        width: '100%',
        alignItems: 'center',
    },
    playButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#3B82F6',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    playButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bombInner: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#ff3333',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HowToPlayScreen;
