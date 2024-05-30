import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Color, FontSize, FontFamily } from "../GlobalStyles";
import { configuration } from "../configuration";

const ApplyDiscount = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, onDiscountApplied } = route.params;

  const [discount, setDiscount] = useState('');
  const [newPrice, setNewPrice] = useState(product.prix);

  const handleDiscountChange = (value) => {
    const discountValue = parseFloat(value);
    if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
      setDiscount(value);
      const discountedPrice = product.prix - (product.prix * discountValue / 100);
      setNewPrice(discountedPrice.toFixed(2));
    } else {
      setDiscount('');
      setNewPrice(product.prix);
    }
  };

  const handleApply = async () => {
    if (discount) {
      try {
        await axios.post(`${configuration.apiUrl}/produits/${product.id}/appliquer-reduction`, { reduction: discount });
        if (onDiscountApplied) {
          onDiscountApplied();
        }
        Alert.alert('Réduction appliquée avec succès');
        navigation.goBack();
      } catch (error) {
        console.error("Erreur lors de l'application de la réduction:", error);
        Alert.alert('Erreur', "Erreur lors de l'application de la réduction");
      }
    } else {
      alert('Veuillez entrer un pourcentage de réduction valide.');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.header}>Appliquer une réduction</Text>
        <Text style={styles.message}>Produit: {product.designation}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Entrez le % de réduction"
          placeholderTextColor={Color.neutralDark}
          value={discount}
          onChangeText={handleDiscountChange}
        />
        <Text style={styles.newPrice}>Nouveau prix: {newPrice} DA</Text>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: FontSize.headingH2_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
    color: Color.neutralDark,
    marginBottom: 10,
  },
  message: {
    fontSize: FontSize.formTextFill_size,
    fontFamily: FontFamily.formTextNormal,
    color: Color.neutralDark,
    opacity: 0.5,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    marginBottom: 20,
    textAlign: 'center',
  },
  newPrice: {
    fontSize: FontSize.headingH5_size,
    fontFamily: FontFamily.headingH4,
    color: Color.neutralDark,
    marginBottom: 30,
  },
  applyButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Color.colorDarkorchid,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "rgba(142, 82, 240, 0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 30,
    shadowOpacity: 1,
  },
  applyButtonText: {
    color: Color.white,
    fontSize: FontSize.headingH5_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Color.neutralGrey,
    fontSize: FontSize.headingH5_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
  },
});

export default ApplyDiscount;
