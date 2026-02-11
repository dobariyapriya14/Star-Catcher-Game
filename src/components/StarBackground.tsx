import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const STAR_COUNT = 60;

const AnimatedStar = () => {
    // Random initial opacity
    const opacity = useRef(new Animated.Value(Math.random() * 0.5 + 0.3)).current;

    // Random position (memoized via ref since we don't want re-renders to move them)
    // Actually, simple variables in render are fine if component doesn't re-render often, 
    // but refs are safer to keep positions static across re-renders if parent updates.
    const position = useRef({
        top: Math.random() * height,
        left: Math.random() * width,
        size: Math.random() * 3 + 1
    }).current;

    useEffect(() => {
        const duration = 1500 + Math.random() * 2000;

        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: duration,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                width: position.size,
                height: position.size,
                borderRadius: position.size / 2,
                backgroundColor: 'white',
                opacity,
            }}
        />
    );
};

const StarBackground = () => {
    return (
        <View style={styles.container}>
            {Array.from({ length: STAR_COUNT }).map((_, i) => (
                <AnimatedStar key={i} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
});

export default StarBackground;
