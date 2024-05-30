import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import ProductCard from './ProductCard';
import { Color, FontFamily, FontSize, Padding, Border } from '../GlobalStyles';
import { configuration } from '../configuration';
import TabBar from '../TabBar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Get the navigation object

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${configuration.apiUrl}/produits/available`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Color.colorDarkorchid} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.home}>
        <View style={styles.productList}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
      <TabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Color.white,
  },
  home: {
    padding: 16,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
