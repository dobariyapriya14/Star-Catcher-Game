import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { Platform, AppState } from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SoundContextType {
    isSoundEnabled: boolean;
    toggleSound: (value: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [isSoundLoaded, setIsSoundLoaded] = useState(false);
    const soundRef = useRef<Sound | null>(null);

    // load sound preferences on mount
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const saved = await AsyncStorage.getItem('soundEnabled');
                if (saved !== null) {
                    setIsSoundEnabled(saved === 'true');
                } else {
                    // Default behavior if not set? Let's say false as per user request history
                    setIsSoundEnabled(false);
                }
            } catch (e) {
                console.log('Failed to load sound settings', e);
            }
        };
        loadSettings();
    }, []);

    // load sound file
    useEffect(() => {
        Sound.setCategory('Playback', true);

        const soundFile = Platform.OS === 'android' ? 'dali' : 'dali.mp3';
        console.log('Context loading sound:', soundFile);

        const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('❌ Context Sound load failed', error);
                return;
            }
            console.log('✅ Context Sound loaded');
            sound.setNumberOfLoops(-1); // Infinite loop
            sound.setVolume(1.0);
            setIsSoundLoaded(true);
        });

        soundRef.current = sound;

        return () => {
            sound.release();
        };
    }, []);

    // Effect to handle playback state changes
    useEffect(() => {
        if (!isSoundLoaded || !soundRef.current) return;

        if (isSoundEnabled) {
            console.log('Playing sound global');
            soundRef.current.play((success) => {
                if (!success) {
                    console.log('Global playback failed');
                    soundRef.current?.reset();
                }
            });
        } else {
            console.log('Stopping sound global');
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

    return (
        <SoundContext.Provider value={{ isSoundEnabled, toggleSound }}>
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
