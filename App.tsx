import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutScreen from './app/screens/About';
import CategoriesScreen from './app/screens/Categories';
import TimelineScreen from './app/screens/Timeline';
import ItemScreen from './app/screens/Item';
import LearnMoreScreen from './app/screens/LearnMore';
import QRCodeScreen from './app/screens/QRCode';

export type RootStackParamList = {
  Categories: undefined;
  About: undefined;
  Timeline: undefined;
  Quizz: undefined;
  Item: { itemId: string; collection: string; documentName?: string; name?: string; details?: object; }; 
  LearnMore: { itemId: string; collection: string } 
  QRCode: undefined; };
  

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  title: 'RetroTech',
  headerBackVisible: false,
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
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}