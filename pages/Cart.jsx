// Cart.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './contexts/CartContext'; // Import useCart
import { Color, FontSize, FontFamily, Border, Padding } from "../GlobalStyles";

const Cart = () => {
    const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
    const [totalPrice, setTotalPrice] = useState(0);
    const [deliveryFee] = useState(500);
    const navigation = useNavigation();
  
    useEffect(() => {
      calculateTotal(cartItems);
    }, [cartItems]);
  
    const calculateTotal = (items) => {
      const total = items.reduce((acc, item) => acc + item.prix * item.quantity, 0);
      setTotalPrice(total);
    };
  
    const renderItem = ({ item }) => (
      <View style={[styles.productItem, styles.productLayout]}>
        <Text style={styles.productName}>{item.designation}</Text>
        <Text style={styles.productPrice}>{item.prix} DA</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
            <Icon name="remove-circle-outline" size={24} color={Color.neutralGrey} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
            <Icon name="add-circle-outline" size={24} color={Color.neutralGrey} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Icon name="trash-outline" size={24} color={Color.neutralGrey} />
        </TouchableOpacity>
      </View>
    );
  
    return (
      <View style={styles.cart}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="arrow-back-outline" size={24} color={"#9098B1"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <Icon name="heart-outline" size={24} color={"#9098B1"} />
        </View>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Votre panier est vide</Text>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            contentContainerStyle={styles.cartList}
          />
        )}
        <View style={styles.totalPriceSection}>
          <Text style={styles.totalPriceText}>Items ({cartItems.length})</Text>
          <Text style={styles.totalPriceText}>{totalPrice} DA</Text>
        </View>
        <View style={styles.totalPriceSection}>
          <Text style={styles.totalPriceText}>Livraison</Text>
          <Text style={styles.totalPriceText}>{deliveryFee} DA</Text>
        </View>
        <View style={styles.totalPriceSection}>
          <Text style={styles.totalPriceLabel}>Prix total</Text>
          <Text style={styles.totalPriceAmount}>{totalPrice + deliveryFee} DA</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('ShipTo')}>
          <Text style={styles.checkoutButtonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    );
  };
const styles = StyleSheet.create({
  cart: {
    flex: 1,
    backgroundColor: Color.white,
    padding: 16,
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
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.headingH3_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    color: Color.neutralDark,
  },
  productLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
    borderRadius: Border.br_8xs,
    backgroundColor: Color.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: Border.br_8xs,
  },
  productName: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    color: Color.neutralDark,
  },
  productPrice: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    color: Color.colorSlateblue,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    color: Color.neutralDark,
  },
  totalPriceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  totalPriceText: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    color: Color.neutralGrey,
  },
  totalPriceLabel: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    color: Color.neutralDark,
  },
  totalPriceAmount: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    fontWeight: '700',
    color: Color.colorSlateblue,
  },
  checkoutButton: {
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
  checkoutButtonText: {
    fontSize: FontSize.font_size,
    lineHeight: 25,
    color: Color.white,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "700",
    fontFamily: FontFamily.headingH4,
  },
  emptyCartText: {
    fontSize: FontSize.captionLargeBold_size,
    fontFamily: FontFamily.captionLargeBold,
    color: Color.neutralGrey,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Cart;
