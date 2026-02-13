import React from "react";
import { AppRegistry, StyleSheet, StatusBar, BackHandler } from "react-native";
import MoveFingerAnimation from "./src/screens/MoveFingerAnimation";
import StarCatcherLoadingScreen from "./src/screens/StarCatcherLoadingScreen";

import GameMenuScreen from "./src/screens/GameMenuScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HowToPlayScreen from "./src/screens/HowToPlayScreen";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { SoundProvider } from './src/context/SoundContext';

import ScoreScreen from './src/screens/ScoreScreen';

const MainContent = () => {
  const [currentScreen, setCurrentScreen] = React.useState<'loading' | 'howToPlay' | 'menu' | 'settings' | 'game' | 'score'>('loading');
  const [gameMode, setGameMode] = React.useState<'classic' | 'endless'>('classic');
  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('easy');
  const [fingerColor, setFingerColor] = React.useState('#00FFFF');

  const checkFirstLaunch = async () => {
    try {
      const savedColor = await AsyncStorage.getItem('fingerColor');
      if (savedColor) setFingerColor(savedColor);

      const hasSeen = await AsyncStorage.getItem('hasSeenHowToPlay');
      if (hasSeen === 'true') {
        setCurrentScreen('menu');
      } else {
        setCurrentScreen('howToPlay');
      }
    } catch (e) {
      setCurrentScreen('howToPlay');
    }
  };

  // Handle Android Back Button
  React.useEffect(() => {
    const onBackPress = () => {
      if (currentScreen === 'menu' || currentScreen === 'loading') {
        return false; // Exit the app
      }
      // Navigate back to menu
      setCurrentScreen('menu');
      return true; // Prevent default behavior
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => subscription.remove();
  }, [currentScreen]);

  // Reload settings when entering game or returning from settings
  React.useEffect(() => {
    if (currentScreen === 'game' || currentScreen === 'menu') {
      (async () => {
        const savedColor = await AsyncStorage.getItem('fingerColor');
        if (savedColor) setFingerColor(savedColor);
      })();
    }
  }, [currentScreen]);

  if (currentScreen === 'loading') {
    return <StarCatcherLoadingScreen onFinish={checkFirstLaunch} />;
  }

  const handleHowToPlayFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenHowToPlay', 'true');
    } catch (e) {
      // Ignore error
    }
    setCurrentScreen('menu');
  };

  if (currentScreen === 'howToPlay') {
    return (
      <HowToPlayScreen
        onPlay={handleHowToPlayFinish}
        onClose={() => setCurrentScreen('menu')}
      />
    );
  }

  if (currentScreen === 'menu') {
    return (
      <GameMenuScreen
        onStartGame={(mode, difficulty) => {
          setGameMode(mode);
          setDifficulty(difficulty);
          setCurrentScreen('game');
        }}
        onSettings={() => setCurrentScreen('settings')}
        onViewScore={() => setCurrentScreen('score')}
      />
    );
  }

  if (currentScreen === 'settings') {
    return <SettingsScreen onBack={() => setCurrentScreen('menu')} />;
  }

  if (currentScreen === 'score') {
    return <ScoreScreen onBack={() => setCurrentScreen('menu')} />;
  }

  return (
    <MoveFingerAnimation mode={gameMode} difficulty={difficulty} fingerColor={fingerColor} onExit={() => setCurrentScreen('menu')} />
  );
};

const BestGameEver = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0B131F" hidden={true} />
      <SoundProvider>
        <MainContent />
      </SoundProvider>
    </>
  );
};
export default BestGameEver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
