import {Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Home from './pages/Home';
import Sortie from  './pages/Sortie';
import Entree from  './pages/Entree';
import GetCoordonnees from './pages/GetCoordonnees';
import LocationPage from './pages/LocationPage';
import Distance from './pages/Distance';
import CarteMap from './pages/CarteMap';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListeClients from './pages/ListeClients';


function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'blue' }}>
      <Text>Home Screen</Text>
    </View>
  );
}
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Carte map" component={CarteMap} />
    </Drawer.Navigator>
  );
}


function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen  name="Acceuil" component={MyDrawer} />
      <Stack.Screen name="Home Screen" component={HomeScreen} />
      <Stack.Screen name="Entree" component={Entree} />
      <Stack.Screen name="Sortie" component={Sortie} />
      <Stack.Screen name="Location page" component={LocationPage} />
      <Stack.Screen name="Distance" component={Distance} />
      <Stack.Screen name="Liste client" component={ListeClients} />
      
    </Stack.Navigator>
  </NavigationContainer>
    //<CarteMap/>
  );
}
export default App;

