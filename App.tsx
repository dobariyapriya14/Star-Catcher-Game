import React from "react";
import { AppRegistry, StyleSheet, StatusBar, BackHandler, View } from "react-native";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBlankStackNavigator } from "react-native-screen-transitions/blank-stack";
import { SheetProvider } from "react-native-sheet-transitions";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MoveFingerAnimation from "./src/screens/MoveFingerAnimation";
import StarCatcherLoadingScreen from "./src/screens/StarCatcherLoadingScreen";
import GameMenuScreen from "./src/screens/GameMenuScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HowToPlayScreen from "./src/screens/HowToPlayScreen";
import ScoreScreen from './src/screens/ScoreScreen';

import { SoundProvider } from './src/context/SoundContext';

const Stack = createBlankStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Loading" component={StarCatcherLoadingScreen} />
      <Stack.Screen
        name="HowToPlay"
        component={HowToPlayScreen}
      />
      <Stack.Screen
        name="Menu"
        component={GameMenuScreen}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />
      <Stack.Screen
        name="Score"
        component={ScoreScreen}
      />
      <Stack.Screen
        name="Game"
        component={MoveFingerAnimation}
      />
    </Stack.Navigator>
  );
};

const BestGameEver = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B131F" hidden={true} />
      <SoundProvider>
        <SheetProvider>
          <NavigationContainer>
            <MainStack />
          </NavigationContainer>
        </SheetProvider>
      </SoundProvider>
    </GestureHandlerRootView>
  );
};
export default BestGameEver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  }
});
