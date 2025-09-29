import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaInicial from './tela_inicial';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaInicial">
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};