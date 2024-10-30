import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AboutScreen from './app/screens/About';
import SearchScreen from './app/screens/Search';
import TimelineScreen from './app/screens/Timeline';
import QRCodeScreen from './app/screens/QRCode';
import ItemScreen from './app/screens/Item';
import LearnMoreScreen from './app/screens/LearnMore';

export type RootStackParamList = {
  Search: undefined;
  About: undefined;
  Timeline: undefined;
  QRCode: undefined;
  Item: { itemId: string };
  LearnMore: undefined };


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
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Timeline" component={TimelineScreen} />
        <Stack.Screen name="Item" component={ItemScreen} />
        <Stack.Screen name="LearnMore" component={LearnMoreScreen} />
        <Stack.Screen name="QRCode" component={QRCodeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
