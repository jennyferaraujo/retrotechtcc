import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AboutScreen from './app/screens/About';
import CategoriesScreen from './app/screens/Categories';
import TimelineScreen from './app/screens/Timeline';
import ItemScreen from './app/screens/Item';
import LearnMoreScreen from './app/screens/LearnMore';
import GamesScreen from './app/screens/Games';
import QRCodeScreen from './app/screens/QRCode';
import QRCodeGameScreen from './app/screens/QRCodeGame';
import QRCodeGameSuccessScreen from './app/screens/QRCodeGameSuccess';
import QRCodeGameFailureScreen from './app/screens/QRCodeGameFailure';
import QAGameScreen from './app/screens/QAGame';
import QAGameSuccess from './app/screens/QAGameSuccess';
import QAGameFailure from './app/screens/QAGameFailure';

export type RootStackParamList = {
  Categories: undefined;
  About: undefined;
  Timeline: undefined;
  Quizz: undefined;
  Item: { itemId: string; collection: string; documentName?: string; name?: string; details?: object; };
  LearnMore: { itemId: string; collection: string };
  Games: undefined;
  QRCode: undefined;
  QRCodeGame: undefined;
  QAGame: undefined;
  QRCodeGameSuccess: { peca: any };
  QRCodeGameFailure: { peca: any };
  QAGameSuccess: { peca: any; onNextQuestion: () => Promise<void> };
  QAGameFailure: { peca: any; onNextQuestion: () => Promise<void> };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions: NativeStackNavigationOptions = {
  title: 'RetroTech',
  headerBackVisible: false,
  headerTitleAlign: "center", 
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="About" screenOptions={screenOptions}>
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Timeline" component={TimelineScreen} />
        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="LearnMore" component={LearnMoreScreen} />
        <Stack.Screen name="Games" component={GamesScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
        <Stack.Screen name="QRCodeGame" component={QRCodeGameScreen} />
        <Stack.Screen name="QRCodeGameSuccess" component={QRCodeGameSuccessScreen} />
        <Stack.Screen name="QRCodeGameFailure" component={QRCodeGameFailureScreen} />
        <Stack.Screen name="QAGame" component={QAGameScreen} />
        <Stack.Screen name="QAGameSuccess" component={QAGameSuccess} />
        <Stack.Screen name="QAGameFailure" component={QAGameFailure} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
