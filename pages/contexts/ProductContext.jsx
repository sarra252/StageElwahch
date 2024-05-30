import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { configuration } from '../../configuration';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    // Fonction pour récupérer les produits depuis l'API
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.get(`${configuration.apiUrl}/fournisseur/produits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    }
  };

  const addProduct = async (newProduct) => {
    // Fonction pour ajouter un produit et mettre à jour la liste
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.post(`${configuration.apiUrl}/produits`, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) => [...prevProducts, response.data.produit]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit:", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchProducts, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
