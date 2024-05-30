import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const existingCartItems = await AsyncStorage.getItem('cart');
      setCartItems(existingCartItems ? JSON.parse(existingCartItems) : []);
    };

    fetchCartItems();
  }, []);

  const addToCart = async (product) => {
    const productExists = cartItems.find(item => item.id === product.id);

    if (productExists) {
      Alert.alert('Info', 'Le produit est déjà dans le panier. Vous pouvez modifier la quantité dans le panier.');
      return;
    }

    const newCartItem = { ...product, quantity: 1 };
    const updatedCartItems = [...cartItems, newCartItem];
    setCartItems(updatedCartItems);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
    Alert.alert('Succès', 'Produit ajouté au panier');
  };

  const removeFromCart = async (productId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCartItems);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    const updatedCartItems = cartItems.map(item => 
      item.id === productId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
    );
    setCartItems(updatedCartItems);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
