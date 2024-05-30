import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color, FontSize, FontFamily, Border } from '../GlobalStyles';
import { configuration } from '../configuration';
import DeleteProductConfirmation from './DeleteProductConfirmation';

const ProduitList = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigation = useNavigation();

  const fetchProducts = async () => {
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
      Alert.alert("Erreur", "Erreur lors du chargement des produits");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleAddProduct = () => {
    navigation.navigate('AddProduit');
  };

  const handleEdit = (product) => {
    navigation.navigate('EditProduit', { product });
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.delete(`${configuration.apiUrl}/produits/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Produit supprimé avec succès');
        fetchProducts();
        setModalVisible(false);
      } else {
        throw new Error(response.data.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit:", error);

      if (error.response) {
        console.error("Détails de l'erreur:", error.response.data);
      }

      if (!error.response) {
        Alert.alert('Erreur', 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.');
      } else {
        const errorMessage = error.response.data.error || error.message || 'Erreur lors de la suppression du produit';
        Alert.alert('Erreur', errorMessage);
      }
    }
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleReduction = (product) => {
    navigation.navigate('ApplyDiscount', { product });
  };

  const renderProduct = ({ item }) => (
    <View style={styles.cardProduct}>
      {item.image_path ? (
        <Image
          style={styles.productImage}
          source={{ uri: `${configuration.apiUrl}/${item.image_path}` }}
        />
      ) : (
        <Text>No Image Available</Text>
      )}
      <View style={styles.productDetails}>
        <View style={styles.productHeader}>
          <Text style={styles.produit}>{item.designation}</Text>
          <Text style={styles.quantite}>Quantité : {item.quantite}</Text>
        </View>
        <Text style={styles.da}>{item.prix} DA</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>
          <View style={styles.sideButtonsContainer}>
            <TouchableOpacity style={styles.sideButton} onPress={() => handleOpenModal(item)}>
              <Image
                style={styles.icon}
                source={require('../assets/Delete.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.sideButton, styles.reductionButton]} onPress={() => handleReduction(item)}>
              <Image
                style={styles.icon}
                source={require('../assets/Offer.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.productList}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
        <Image
          style={styles.addButtonImage}
          source={require('../assets/Add.png')}
        />
      </TouchableOpacity>
      {isModalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <DeleteProductConfirmation
            onConfirm={() => handleDelete(selectedProduct.id)}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  productList: {
    flex: 1,
    padding: 10,
    backgroundColor: Color.backgroundWhite,
    marginTop: 50,
  },
  cardProduct: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Color.white,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 72,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  produit: {
    fontSize: FontSize.captionLargeRegular_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: "700",
    color: Color.neutralDark,
  },
  da: {
    fontSize: FontSize.captionLargeRegular_size,
    color: Color.colorDarkorchid,
    marginVertical: 5,
  },
  quantite: {
    fontSize: FontSize.captionLargeRegular_size,
    color: Color.neutralDark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  editButton: {
    width: 120,
    backgroundColor: Color.colorDarkorchid,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: "rgba(142, 82, 240, 0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 30,
    shadowOpacity: 1,
  },
  sideButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sideButton: {
    backgroundColor: Color.colorRed,
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  reductionButton: {
    backgroundColor: Color.colorGreen,
  },
  icon: {
    width: 24,
    height: 24,
  },
  buttonText: {
    fontSize: FontSize.font_size,
    lineHeight: 25,
    color: Color.white,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "700",
    fontFamily: FontFamily.headingH4,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    left : 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonImage: {
    width: 100,
    height: 100,
  },
});

export default ProduitList;



/*const styles = StyleSheet.create({
  productList: {
    flex: 1,
    padding: 10,
    backgroundColor: Color.backgroundWhite,
  },
  cardProduct: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Color.white,
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 72,
    height: 90,
    borderRadius: Border.br_8xs,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  produit: {
    fontSize: FontSize.captionLargeRegular_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: "700",
    color: Color.neutralDark,
    marginBottom: 5,
  },
  da: {
    fontSize: FontSize.captionLargeRegular_size,
    color: Color.colorDarkorchid,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    padding: 10,
    backgroundColor: Color.colorDarkorchid,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: Color.colorRed,
    borderRadius: Border.br_8xs,
  },
  buttonText: {
    color: Color.backgroundWhite,
    textAlign: "center",
    fontFamily: FontFamily.headingH4,
    fontWeight: "700",
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    left : 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonImage: {
    width: 100,
    height: 150,
  },
});
*/