import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type StarType = 'normal' | 'golden' | 'rainbow' | 'heart' | 'bomb';

interface StarProps {
    position: [number, number];
    type?: StarType;
}

const Star = ({ position, type = 'normal' }: StarProps) => {
    const x = position[0] - 20; // Increased size to 40
    const y = position[1] - 20;

    if (type === 'bomb') {
        return (
            <View style={[styles.star, { left: x, top: y }]}>
                <Text style={styles.iconText}>💣</Text>
            </View>
        );
    }

    if (type === 'rainbow') { // Sparkles
        return (
            <View style={[styles.star, { left: x, top: y }]}>
                <Text style={styles.iconText}>🌈</Text>
            </View>
        );
    }

    if (type === 'golden') { // Golden Star
        return (
            <View style={[styles.star, { left: x, top: y }]}>
                <Text style={styles.iconText}>🌟</Text>
            </View>
        );
    }

    if (type === 'heart') { // Heart
        return (
            <View style={[styles.star, { left: x, top: y }]}>
                <Text style={styles.iconText}>❤️</Text>
            </View>
        );
    }

    // Normal Star
    return (
        <View style={[styles.star, { left: x, top: y }]}>
            <Text style={{ fontSize: 32, color: '#FFD700' }}>★</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    star: {
        position: "absolute",
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5,
    },
    bombContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#ff3333',
        backgroundColor: 'rgba(255, 50, 50, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "red",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
    iconText: {
        fontSize: 22,
    }
});

export { Star };
