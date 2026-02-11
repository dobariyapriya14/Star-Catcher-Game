import React, { useState, useRef, useMemo, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Dimensions, View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Star } from "../components/Star";
import { Score } from "../components/Score";
import { Finger } from "../components/finger";
import GameOverScreen from "./GameOverScreen";


const { width, height } = Dimensions.get("window");

interface Touch {
    type: "start" | "end" | "move" | "press";
    delta: {
        pageX: number;
        pageY: number;
    };
}

const MoveFinger = (entities: any, { touches, time, dispatch }: { touches: Touch[], time: { delta: number }, dispatch: any }) => {
    const score = entities["score"];

    //-- First, move the "head" (entity 1) based on user touch
    touches.filter(t => t.type === "move").forEach(t => {
        const head = entities[1];
        if (head && head.position) {
            const nextX = head.position[0] + t.delta.pageX;
            const nextY = head.position[1] + t.delta.pageY;

            // Allow full screen but clamp to edges
            const RADIUS = 25; // Finger radius
            const clampedX = Math.max(RADIUS, Math.min(width - RADIUS, nextX));
            const clampedY = Math.max(RADIUS, Math.min(height - RADIUS, nextY));

            head.position = [clampedX, clampedY];
        }
    });

    // Identify all snake segments (keys are numbers)
    const ids = Object.keys(entities)
        .map(key => parseInt(key))
        .filter(key => !isNaN(key))
        .sort((a, b) => a - b);

    // Determine speed based on slow motion
    let followSpeed = 0.5; // Increased from 0.3 for smoother/tighter control
    if (score && score.slowMotionTimer > 0) {
        followSpeed = 0.2; // Adjusted for slow motion
        score.slowMotionTimer -= 0.016; // Decrement timer
    }

    for (let i = 1; i < ids.length; i++) {
        const leaderId = ids[i - 1];
        const followerId = ids[i];

        const leader = entities[leaderId];
        const follower = entities[followerId];

        if (leader && follower) {
            // Logic for trail/snake effect
            // Calculate distance between leader and follower
            const dx = leader.position[0] - follower.position[0];
            const dy = leader.position[1] - follower.position[1];

            // Move follower towards leader with an interpolation factor (smoothness)
            follower.position[0] += dx * followSpeed;
            follower.position[1] += dy * followSpeed;
        }
    }

    //-- Collision Detection with Star
    const head = entities[1];
    const star = entities["star"];

    // Initialize/Update Lives
    score.lives = (score.lives !== undefined) ? score.lives : 3;

    // Star Lifetime Logic
    const dt = 0.016;
    star.lifetime = (star.lifetime !== undefined) ? star.lifetime - dt : 3.0;

    if (star.lifetime <= 0) {
        // Star Timeout - Missed a star!
        if (star.type !== 'bomb') {
            score.lives -= 1;
        }

        // Respawn
        const safeTop = 200;
        const safeBottom = height - 150;
        star.position = [
            Math.random() * (width - 40) + 20,
            Math.random() * (safeBottom - safeTop) + safeTop
        ];
        star.lifetime = 3.0; // Reset lifetime

        const ran = Math.random();
        if (ran < 0.6) star.type = 'normal';
        else if (ran < 0.7) star.type = 'golden';
        else if (ran < 0.8) star.type = 'rainbow';
        else if (ran < 0.9 && score.lives < 3) star.type = 'heart'; // Only spawn heart if lives < 3
        else star.type = 'bomb';

        // Check Game Over by lives
        if (score.lives <= 0) {
            dispatch({
                type: "game-over",
                score: score.score,
                stats: {
                    stars: score.collectedStars || 0,
                    rainbows: score.collectedRainbows || 0,
                    bombs: score.collectedBombs || 0,
                    hearts: score.collectedHearts || 0,
                    goldens: score.collectedGoldens || 0,
                    pointsStars: score.pointsStars || 0,
                    pointsRainbows: score.pointsRainbows || 0,
                    pointsBombs: score.pointsBombs || 0,
                    pointsHearts: score.pointsHearts || 0,
                    pointsGoldens: score.pointsGoldens || 0
                }
            });
            score.time = 0;
        }
    }

    // Update Renderer (Ensure lives are updated)
    score.renderer = <Score score={score.score} time={score.time} lives={score.lives} mode={score.mode} />;

    // Update Timer (Only for Classic Mode)
    if (score.mode === 'classic') {
        if (score && score.time > 0) {
            score.time -= 0.03;
        } else if (score && score.time <= 0) {
            // Time's up! Dispatch Game Over
            dispatch({
                type: "game-over",
                score: score.score,
                stats: {
                    stars: score.collectedStars || 0,
                    rainbows: score.collectedRainbows || 0,
                    bombs: score.collectedBombs || 0,
                    hearts: score.collectedHearts || 0,
                    goldens: score.collectedGoldens || 0,
                    pointsStars: score.pointsStars || 0,
                    pointsRainbows: score.pointsRainbows || 0,
                    pointsBombs: score.pointsBombs || 0,
                    pointsHearts: score.pointsHearts || 0,
                    pointsGoldens: score.pointsGoldens || 0
                }
            });
            // Prevent multiple dispatches or weird negative time
            score.time = 0;
        }
    }

    // Bomb timer logic: if bomb is active for > 1500ms, change it
    if (star && star.type === 'bomb') {
        const dt = time.delta || 16; // default 16ms if undefined
        star.bombTimer = (star.bombTimer || 0) + dt;

        if (star.bombTimer > 1500) {
            // Change to a new random type
            const ran = Math.random();
            if (ran < 0.4) star.type = 'normal';
            else if (ran < 0.6) star.type = 'golden';
            else if (ran < 0.8) star.type = 'rainbow';
            else star.type = 'bomb';

            // Reset timer
            star.bombTimer = 0;
        }
    }

    //-- Check for Manual Stop Signal (Start Button / Pause Menu Exit)
    const control = entities["control"];
    if (control && control.signal && control.signal.value === true) {
        control.signal.value = false; // Reset signal

        // Dispatch Game Over immediately
        dispatch({
            type: "game-over",
            score: score.score,
            stats: {
                stars: score.collectedStars || 0,
                rainbows: score.collectedRainbows || 0,
                bombs: score.collectedBombs || 0,
                hearts: score.collectedHearts || 0,
                goldens: score.collectedGoldens || 0,
                pointsStars: score.pointsStars || 0,
                pointsRainbows: score.pointsRainbows || 0,
                pointsBombs: score.pointsBombs || 0,
                pointsHearts: score.pointsHearts || 0,
                pointsGoldens: score.pointsGoldens || 0
            }
        });
        score.time = 0;
    }

    if (head && star && score) {
        const dx = head.position[0] - star.position[0];
        const dy = head.position[1] - star.position[1];
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check collision (adjust 30 based on sizes)
        if (distance < 30 && (score.mode === 'endless' || score.time > 0)) {
            const collectedType = star.type || 'normal';

            // Initialize stats if missing
            score.collectedStars = score.collectedStars || 0;
            score.collectedRainbows = score.collectedRainbows || 0;
            score.collectedBombs = score.collectedBombs || 0;

            score.pointsStars = score.pointsStars || 0;
            score.pointsRainbows = score.pointsRainbows || 0;
            score.pointsBombs = score.pointsBombs || 0;
            score.collectedHearts = score.collectedHearts || 0;
            score.pointsHearts = score.pointsHearts || 0;
            score.collectedGoldens = score.collectedGoldens || 0;
            score.pointsGoldens = score.pointsGoldens || 0;

            // Apply Effects
            if (collectedType === 'golden') {
                score.score += 5;
                // score.time += 5;
                score.collectedGoldens += 1;
                score.pointsGoldens += 5;
            } else if (collectedType === 'rainbow') {
                score.score += 3;
                score.slowMotionTimer = 3;
                score.collectedRainbows += 1;
                score.pointsRainbows += 3;
            } else if (collectedType === 'bomb') {
                score.score -= 2;
                score.collectedBombs += 1;
                score.pointsBombs += 2;

                // Dispatch bomb hit event for animation
                dispatch({ type: "bomb-hit" });
            } else if (collectedType === 'heart') {
                score.lives = Math.min((score.lives || 0) + 1, 3);
                score.score += 10;
                score.collectedHearts += 1;
                score.pointsHearts += 10;
                dispatch({ type: "heart-hit" });
            } else {
                score.score += 1;
                score.collectedStars += 1;
                score.pointsStars += 1;
            }

            // Grow Snake (unless bomb)
            if (collectedType !== 'bomb') {
                const lastId = ids[ids.length - 1];
                const lastSegment = entities[lastId];
                const newId = lastId + 1;

                entities[newId] = {
                    position: [lastSegment.position[0], lastSegment.position[1]],
                    color: entities[1].color,
                    renderer: <Finger />
                };
            }

            // Respawn - Generate random position avoiding the top score area and bottom controls
            const safeTop = 200;
            const safeBottom = height - 150; // Avoid bottom controls

            star.position = [
                Math.random() * (width - 40) + 20,
                Math.random() * (safeBottom - safeTop) + safeTop
            ];
            star.bombTimer = 0; // Reset bomb timer for new spawn
            // Difficulty Scaling for Endless Mode
            if (score.mode === 'endless') {
                const difficultyFactor = Math.min(Math.floor(score.score / 10) * 0.1, 1.8);
                star.lifetime = Math.max(3.0 - difficultyFactor, 1.2);
            } else {
                star.lifetime = 3.0; // Reset lifetime (Classic constant)
            }

            const ran = Math.random();
            if (ran < 0.6) star.type = 'normal';
            else if (ran < 0.7) star.type = 'golden';
            else if (ran < 0.8) star.type = 'rainbow';
            else if (ran < 0.9 && score.lives < 3) star.type = 'heart'; // Only spawn heart if lives < 3
            else star.type = 'bomb';

            // Re-render score immediately
            score.renderer = <Score score={score.score} time={score.time} lives={score.lives} mode={score.mode} />;
        }
    }

    return entities;
};

interface MoveFingerAnimationProps {
    onExit: () => void;
    mode: 'classic' | 'endless';
    fingerColor?: string;
}

const MoveFingerAnimation: React.FC<MoveFingerAnimationProps> = ({ onExit, mode, fingerColor = '#00FFFF' }) => {
    const [running, setRunning] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const engineRef = useRef<GameEngine>(null);
    const stopSignal = useRef({ value: false });

    // Animation Values
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const flashAnim = useRef(new Animated.Value(0)).current;
    const heartAnim = useRef(new Animated.Value(0)).current;
    const heartScaleAnim = useRef(new Animated.Value(0.5)).current;

    const [stats, setStats] = useState({
        stars: 0,
        rainbows: 0,
        bombs: 0,
        hearts: 0,
        goldens: 0,
        pointsStars: 0,
        pointsRainbows: 0,
        pointsBombs: 0,
        pointsHearts: 0,
        pointsGoldens: 0
    });

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

    // ... (existing imports)

    const onEvent = async (e: any) => {
        if (e.type === "game-over") {
            setRunning(false);
            setGameOver(true);
            setScore(e.score);
            setStats(e.stats || {
                stars: 0,
                rainbows: 0,
                bombs: 0,
                hearts: 0,
                goldens: 0,
                pointsStars: 0,
                pointsRainbows: 0,
                pointsBombs: 0,
                pointsHearts: 0,
                pointsGoldens: 0
            });

            // Save Score
            try {
                const newScore = {
                    id: Date.now().toString(),
                    score: e.score,
                    date: new Date().toISOString(),
                    mode: mode,
                    stats: e.stats || {
                        stars: 0,
                        rainbows: 0,
                        bombs: 0,
                        hearts: 0,
                        goldens: 0,
                        pointsStars: 0,
                        pointsRainbows: 0,
                        pointsBombs: 0,
                        pointsHearts: 0,
                        pointsGoldens: 0
                    }
                };

                const existingScores = await AsyncStorage.getItem('gameScores');
                let scores = existingScores ? JSON.parse(existingScores) : [];
                scores.push(newScore);

                // Optional: Keep only top 50 or similar if needed, but easy to just keep all for now
                await AsyncStorage.setItem('gameScores', JSON.stringify(scores));
            } catch (error) {
                console.error('Failed to save score', error);
            }

        } else if (e.type === "bomb-hit") {
            triggerBombAnimation();
        } else if (e.type === "heart-hit") {
            triggerHeartAnimation();
        }
    };

    const triggerHeartAnimation = () => {
        // Reset values
        heartAnim.setValue(1);
        heartScaleAnim.setValue(0);

        Animated.parallel([
            Animated.timing(heartAnim, {
                toValue: 0,
                duration: 1000,
                delay: 200,
                useNativeDriver: true
            }),
            Animated.spring(heartScaleAnim, {
                toValue: 1.5,
                friction: 4,
                useNativeDriver: true
            })
        ]).start();
    };

    const triggerBombAnimation = () => {
        // Red Flash
        Animated.sequence([
            Animated.timing(flashAnim, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true
            }),
            Animated.timing(flashAnim, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();

        // Screen Shake
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    };

    const resetGame = () => {
        setRunning(true);
        setGameOver(false);
        setScore(0);
        stopSignal.current.value = false;
        setStats({
            stars: 0,
            rainbows: 0,
            bombs: 0,
            hearts: 0,
            goldens: 0,
            pointsStars: 0,
            pointsRainbows: 0,
            pointsBombs: 0,
            pointsHearts: 0,
            pointsGoldens: 0
        });
        // Force reset entities
        if (engineRef.current) {
            (engineRef.current as any).swap({
                control: { signal: stopSignal.current, renderer: <View /> },
                1: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                2: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                3: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                4: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                5: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                star: { position: [200, 300], type: 'normal', renderer: <Star position={[0, 0]} /> },
                score: {
                    score: 0,
                    time: mode === 'classic' ? 60 : 0,
                    lives: 3,
                    mode: mode,
                    slowMotionTimer: 0,
                    collectedStars: 0,
                    collectedRainbows: 0,
                    collectedBombs: 0,
                    collectedHearts: 0,
                    collectedGoldens: 0,
                    renderer: <Score score={0} time={mode === 'classic' ? 60 : 0} lives={3} mode={mode} />
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Stars */}
            {stars}

            <Animated.View style={[styles.gameContainer, { transform: [{ translateX: shakeAnim }] }]}>
                <GameEngine
                    ref={engineRef}
                    style={styles.gameContainer}
                    systems={[MoveFinger]}
                    running={running}
                    onEvent={onEvent}
                    entities={{
                        control: { signal: stopSignal.current, renderer: <View /> },
                        1: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                        2: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                        3: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                        4: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                        5: { position: [width / 2, height - 150], color: fingerColor, renderer: <Finger /> },
                        star: { position: [200, 300], type: 'normal', renderer: <Star position={[0, 0]} /> },
                        score: {
                            score: 0,
                            time: mode === 'classic' ? 60 : 0,
                            lives: 3,
                            mode: mode,
                            slowMotionTimer: 0,
                            collectedStars: 0,
                            collectedRainbows: 0,
                            collectedBombs: 0,
                            collectedHearts: 0,
                            collectedGoldens: 0,
                            renderer: <Score score={0} time={mode === 'classic' ? 60 : 0} lives={3} mode={mode} />
                        }
                    }}>

                </GameEngine>
            </Animated.View>

            {/* Bomb Flash Overlay */}
            <Animated.View style={[styles.flashOverlay, { opacity: flashAnim }]} />

            {/* Heart Animation Overlay */}
            <Animated.View style={[styles.heartOverlay, { opacity: heartAnim, transform: [{ scale: heartScaleAnim }] }]}>
                <Text style={styles.heartText}>+1 LIFE</Text>
            </Animated.View>

            {/* Paused Overlay */}
            {!running && !gameOver && (
                <View style={[styles.fullScreenOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
                    <Text style={styles.pausedText}>PAUSED</Text>
                    <TouchableOpacity onPress={() => setRunning(true)} style={styles.largePlayButton}>
                        <View style={styles.largePlayArrow} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            stopSignal.current.value = true;
                            setRunning(true);
                        }}
                        style={[styles.largePlayButton, { marginTop: 20, borderColor: '#EF4444' }]}
                    >
                        <Text style={{ fontSize: 30 }}>🏁</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#EF4444', marginTop: 10, fontWeight: 'bold' }}>END GAME</Text>
                </View>
            )}

            {/* Bottom Controls */}
            {!gameOver && (
                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => {
                            stopSignal.current.value = true;
                            setRunning(true); // Resume briefly to process the kill signal
                        }}
                    >
                        <Text style={{ fontSize: 24 }}>🏁</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} onPress={() => setRunning(!running)}>
                        {running ? (
                            <View style={styles.pauseIcon}>
                                <View style={styles.pauseBar} />
                                <View style={styles.pauseBar} />
                            </View>
                        ) : (
                            <View style={styles.playIconSmall} />
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {gameOver && (
                <GameOverScreen score={score} stats={stats} onRestart={resetGame} onMenu={onExit} />
            )}
        </View>
    );
};
export default MoveFingerAnimation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B14",
    },
    gameContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    controlsContainer: {
        position: 'absolute',
        bottom: 50,
        left: 30,
        right: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowUp: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 16,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        marginTop: -4,
    },
    pauseIcon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 16,
        height: 18,
    },
    pauseBar: {
        width: 5,
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 2,
    },
    fullScreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    pausedText: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
        letterSpacing: 4,
        marginBottom: 30,
        textShadowColor: '#3B7AD9',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    largePlayButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(59, 122, 217, 0.5)',
        shadowColor: "#3B7AD9",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    largePlayArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 20,
        borderRightWidth: 0,
        borderBottomWidth: 15,
        borderTopWidth: 15,
        borderLeftColor: 'white',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginLeft: 5,
    },
    playIconSmall: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 12,
        borderRightWidth: 0,
        borderBottomWidth: 9,
        borderTopWidth: 9,
        borderLeftColor: 'white',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        marginLeft: 2,
    },
    flashOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(239, 68, 68, 0.4)', // Red flash
        zIndex: 15,
        pointerEvents: 'none' // Click through
    },
    heartOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 16,
        pointerEvents: 'none'
    },
    heartIcon: {
        fontSize: 100,
        textShadowColor: 'rgba(236, 72, 153, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    heartText: {
        color: '#F472B6',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    }
});
