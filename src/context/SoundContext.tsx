import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Platform, AppState, Vibration } from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SoundContextType {
    isSoundEnabled: boolean;
    toggleSound: (value: boolean) => void;
    isSfxEnabled: boolean;
    toggleSfx: (value: boolean) => void;
    playSfx: () => void;
    playBombSfx: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isSfxEnabled, setIsSfxEnabled] = useState(true);
    const [isSoundLoaded, setIsSoundLoaded] = useState(false);
    const [isSfxLoaded, setIsSfxLoaded] = useState(false);
    const [isBombSfxLoaded, setIsBombSfxLoaded] = useState(false);

    const soundRef = useRef<Sound | null>(null);
    const sfxRef = useRef<Sound | null>(null);
    const bombSfxRef = useRef<Sound | null>(null);
    const sfxEnabledRef = useRef(true);

    // load sound preferences on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedMusic = await AsyncStorage.getItem('soundEnabled');
                const savedSfx = await AsyncStorage.getItem('sfxEnabled');

                if (savedMusic !== null) setIsSoundEnabled(savedMusic === 'true');
                if (savedSfx !== null) {
                    const enabled = savedSfx === 'true';
                    setIsSfxEnabled(enabled);
                    sfxEnabledRef.current = enabled;
                }
            } catch (e) {
                console.log('Failed to load sound settings', e);
            }
        };
        loadSettings();
    }, []);

    // load music
    useEffect(() => {
        Sound.setCategory('Playback', true);

        const soundFile = Platform.OS === 'android' ? 'dali' : 'dali.mp3';
        const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                return;
            }
            sound.setNumberOfLoops(-1); // Infinite loop
            sound.setVolume(1.0);
            setIsSoundLoaded(true);
        });

        soundRef.current = sound;

        return () => {
            sound.release();
        };
    }, []);

    // load sfx
    useEffect(() => {
        // Use a remote URL as a reliable source since local file is missing
        const sfxFile = 'https://www.orangefreesounds.com/wp-content/uploads/2014/09/Pop-sound-effect.mp3';

        const sfx = new Sound(sfxFile, undefined, (error) => {
            if (error) {
                console.log('❌ Context SFX load failed from URL', error);
                return;
            }
            setIsSfxLoaded(true);
        });

        sfxRef.current = sfx;

        return () => {
            sfx.release();
        };
    }, []);

    // load bomb sfx
    useEffect(() => {
        // Use a powerful bomb blast sound effect
        const bombSfxFile = 'https://www.orangefreesounds.com/wp-content/uploads/2018/01/Bomb-sound-effect.mp3';

        const bombSfx = new Sound(bombSfxFile, undefined, (error) => {
            if (error) {
                console.log('❌ Context Bomb SFX load failed from URL', error);
                return;
            }
            setIsBombSfxLoaded(true);
        });

        bombSfxRef.current = bombSfx;

        return () => {
            bombSfx.release();
        };
    }, []);

    // Effect to handle music playback
    useEffect(() => {
        if (!isSoundLoaded || !soundRef.current) return;

        if (isSoundEnabled) {
            soundRef.current.play((success) => {
                if (!success) soundRef.current?.reset();
            });
        } else {
            soundRef.current.stop();
        }
    }, [isSoundEnabled, isSoundLoaded]);

    const toggleSound = async (value: boolean) => {
        setIsSoundEnabled(value);
        try {
            await AsyncStorage.setItem('soundEnabled', String(value));
        } catch (e) {
            console.log('Error saving sound preference', e);
        }
    };

    const toggleSfx = async (value: boolean) => {
        setIsSfxEnabled(value);
        sfxEnabledRef.current = value;
        try {
            await AsyncStorage.setItem('sfxEnabled', String(value));
        } catch (e) {
            console.log('Error saving sfx preference', e);
        }
    };

    const playSfx = () => {
        if (sfxEnabledRef.current) {
            // Vibrate for feedback regardless of sound loading success
            Vibration.vibrate(20);

            if (isSfxLoaded && sfxRef.current) {
                console.log('🔊 Playing SFX');
                sfxRef.current.stop();
                sfxRef.current.play((success: boolean) => {
                    if (!success) {
                        sfxRef.current?.reset();
                    }
                });
            } else {
                console.log('SFX Not Loaded, but vibrated');
            }
        }
    };

    const playBombSfx = () => {
        if (sfxEnabledRef.current) {
            // Vibrate longer for bomb
            Vibration.vibrate(400);

            if (isBombSfxLoaded && bombSfxRef.current) {
                bombSfxRef.current.stop();
                bombSfxRef.current.play((success: boolean) => {
                    if (!success) {
                        bombSfxRef.current?.reset();
                    }
                });
            } else {
                console.log('Bomb SFX Not Loaded, but vibrated');
            }
        }
    };

    return (
        <SoundContext.Provider value={{ isSoundEnabled, toggleSound, isSfxEnabled, toggleSfx, playSfx, playBombSfx }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
