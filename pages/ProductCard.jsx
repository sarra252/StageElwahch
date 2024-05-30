// ProductCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily, FontSize, Border } from '../GlobalStyles';

const ProductCard = ({ product }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
    >
      <Image source={{ uri: product.image_url }} style={styles.image} />
      <Text style={styles.name}>{product.designation}</Text>
      <Text style={styles.price}>{product.prix} DA</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Color.white,
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: Border.br_8xs,
  },
  name: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  price: {
    fontSize: FontSize.font_size,
    fontFamily: FontFamily.formTextNormal,
    color: Color.colorDarkorchid,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ProductCard;
