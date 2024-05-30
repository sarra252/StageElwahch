import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from './contexts/CartContext'; // Import useCart
import { Color, FontFamily, FontSize, Border } from '../GlobalStyles';
import { configuration } from '../configuration';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { addToCart } = useCart(); // Use addToCart from context

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const endpoint = `${configuration.apiUrl}/produits/${productId}`;
        const response = await axios.get(endpoint);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to fetch product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product); // Use addToCart from context
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Color.colorDarkorchid} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>No product details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back-outline" size={24} color={"#9098B1"} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails Produit</Text>
      </View>
      <Image source={{ uri: product.image_url }} style={styles.productImage} />
      <Text style={styles.productName}>{product.designation}</Text>
      <Text style={styles.productPrice}>{product.prix} DA</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <TouchableOpacity style={styles.submitButton} onPress={handleAddToCart}>
        <Text style={styles.submitButtonText}>Ajouter au panier</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Color.white,
    marginTop: 50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: FontSize.headingH3_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    color: Color.neutralDark,
    marginLeft: 8,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: Border.br_8xs,
  },
  productName: {
    fontSize: FontSize.headingH2_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    marginTop: 16,
  },
  productPrice: {
    fontSize: FontSize.headingH4_size,
    fontFamily: FontFamily.captionLargeBold,
    color: Color.colorDarkorchid,
    marginTop: 16,
  },
  productDescription: {
    fontSize: FontSize.font_size,
    fontFamily: FontFamily.formTextNormal,
    color: Color.neutralGrey,
    marginTop: 16,
  },
  submitButton: {
    marginTop: 30,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Color.colorDarkorchid,
    shadowColor: "rgba(142, 82, 240, 0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 30,
    shadowOpacity: 1,
  },
  submitButtonText: {
    fontSize: FontSize.font_size,
    lineHeight: 25,
    color: Color.white,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "700",
    fontFamily: FontFamily.headingH4,
  },
});

export default ProductDetails;
