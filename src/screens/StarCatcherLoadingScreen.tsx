import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
interface Props {
}

const StarCatcherLoadingScreen: React.FC<Props> = () => {
    const navigation = useNavigation<any>();
    const [progress, setProgress] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const starScale = useRef(new Animated.Value(0.5)).current;
    const circlesScale = useRef(new Animated.Value(0)).current;

    const checkFirstLaunch = async () => {
        try {
            const hasSeen = await AsyncStorage.getItem('hasSeenHowToPlay');
            if (hasSeen === 'true') {
                navigation.replace('Menu');
            } else {
                navigation.replace('HowToPlay');
            }
        } catch (e) {
            navigation.replace('HowToPlay');
        }
    };

    useEffect(() => {
        // Fade in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(starScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.spring(circlesScale, {
                toValue: 1,
                friction: 8,
                tension: 20,
                useNativeDriver: true,
            })
        ]).start();

        // Simulate loading
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(checkFirstLaunch, 500); // Wait a bit after 100%
                    return 100;
                }
                // Random increment
                return Math.min(prev + Math.random() * 5, 100);
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Generate random stars for background
    const stars = Array.from({ length: 50 }).map((_, i) => {
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

    return (
        <View style={styles.container}>
            {/* Background Stars */}
            {stars}

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Central Graphic */}
                <View style={styles.graphicContainer}>
                    <Animated.View style={[styles.circle, { transform: [{ scale: circlesScale }] }]}>
                        <Animated.Text style={[styles.starIcon, { transform: [{ scale: starScale }] }]}>★</Animated.Text>
                    </Animated.View>
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>STAR CATCHER</Text>
                    <Text style={styles.subtitle}>JOURNEY TO THE EDGE</Text>
                </View>

                {/* Loading Section */}
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingRow}>
                        <Text style={styles.loadingText}>LOADING...</Text>
                        <Text style={styles.percentageText}>{Math.floor(progress)}%</Text>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>

                    <Text style={styles.statusText}>Initializing star field coordinates...</Text>
                </View>

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050B14', // Deep dark blue/black
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 40,
    },
    graphicContainer: {
        marginBottom: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#1E5091', // Muted blue circle
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B7AD9',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    starIcon: {
        fontSize: 100,
        color: '#FFD700', // Gold star
        textShadowColor: 'rgba(255, 215, 0, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        letterSpacing: 4,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B7AD9',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
    loadingContainer: {
        width: '100%',
    },
    loadingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    loadingText: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    percentageText: {
        color: '#3B7AD9', // Blue accent
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 4,
        backgroundColor: '#1A2A40',
        borderRadius: 2,
        width: '100%',
        marginBottom: 15,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3B7AD9',
        borderRadius: 2,
    },
    statusText: {
        color: '#333', // Very faint
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 10,
    },
    footerLine: {
        width: 40,
        height: 2,
        backgroundColor: '#1A2A40',
    }
});

export default StarCatcherLoadingScreen;
