// App.js
import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import theme from './theme';
import Acceuil from './pages/Acceuil';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AddPositionPage from './pages/AddPositionPage';
import LocationPage from './pages/LocationPage';
import Distance from './pages/Distance';
import Map from './pages/Map';
import CountdownPage from './pages/CountdownPage';
//import ListeClients from './pages/ListeClients';
import ProduitList from './pages/ProduitList';
import AddProduit from './pages/AddProduit';
import AffichageProduits from './pages/AffichageProduits';
import SplashScreen from './pages/SplashScreen';
import { ProductProvider } from './pages/contexts/ProductContext';
import ApplyDiscount from './pages/ApplyDiscount';
import EditProduit from './pages/EditProduit';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import TabBar from './TabBar';
import ShipTo from './pages/ShipTo';
import { UserProvider, useUser } from './pages/contexts/userContext';
import { CartProvider } from './pages/contexts/CartContext';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="RegisterPage" component={RegisterPage} options={{ headerShown: false }} />
    <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProduitList" component={ProduitList} options={{ headerShown: false }} />
    <Stack.Screen name="AddProduit" component={AddProduit} options={{ headerShown: false }} />
    <Stack.Screen name="ApplyDiscount" component={ApplyDiscount} options={{ headerShown: false }} />
    <Stack.Screen name="EditProduit" component={EditProduit} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const MainDrawer = () => {
  const { userType } = useUser();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.purple,
        },
        headerTintColor: theme.colors.white,
        drawerActiveTintColor: theme.colors.white,
        drawerStyle: {
          backgroundColor: theme.colors.purple,
          width: 240,
        },
      }}
    >
      {userType === 'client' && (
        <>
          <Drawer.Screen name="Home" component={Home} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="ShipTo" component={ShipTo} />
          <Stack.Screen name="AddPositionPage" component={AddPositionPage} />
          <Drawer.Screen name="Map" component={Map} />
        </>
      )}
      {userType === 'fournisseur' && (
        <>
          <Drawer.Screen name="Mes Produits" component={ProductStack} options={{ headerShown: false }} />
          <Drawer.Screen name="Ajouter une Position" component={AddPositionPage} options={{ headerShown: false }} />
        </>
      )}
      {userType === 'depot' && (
        <>
          
          <Drawer.Screen name="Ajouter une Position" component={AddPositionPage} options={{ headerShown: false }} />
          <Drawer.Screen name="Distance" component={Distance} />
        </>
      )}
    </Drawer.Navigator>
  );
};

const MainStack = () => {
  const { userType } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userType ? (
        <Stack.Screen name="MainDrawer" component={MainDrawer} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds delay for Splash Screen
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <MainStack />
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      )}
    </NavigationContainer>
  );
};

export default App;
