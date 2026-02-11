import React from "react";
import { StyleSheet, View } from "react-native";

const RADIUS = 25;

interface FingerProps {
  position?: [number, number];
  color?: string;
}

const Finger = ({ position = [0, 0], color = "#00FFFF" }: FingerProps) => {
  const x = position[0] - RADIUS;
  const y = position[1] - RADIUS;
  return (
    <View style={[styles.finger, { left: x, top: y, backgroundColor: color, shadowColor: color }]} />
  );
};

const styles = StyleSheet.create({
  finger: {
    borderRadius: RADIUS,
    width: RADIUS * 2,
    height: RADIUS * 2,
    position: "absolute",
    // Cyan glow effect removed here, set dynamically in component
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)'
  }
});

export { Finger };