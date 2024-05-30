import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color, FontFamily, Border, FontSize } from '../GlobalStyles';
import { configuration } from '../configuration';

const AddProduit = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [designation, setDesignation] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prix, setPrix] = useState('');
  const [image, setImage] = useState(null);
  const [produitsExistants, setProduitsExistants] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState('');
  const [isProduitModalVisible, setProduitModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCategorieModalVisible, setCategorieModalVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await axios.get(`${configuration.apiUrl}/produits/available`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          setProduitsExistants(response.data);
        } else {
          console.warn('La réponse de l\'API n\'est pas un tableau:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits existants:', error);
        Alert.alert('Erreur', 'Erreur lors du chargement des produits existants');
      }
    };

    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await axios.get(`${configuration.apiUrl}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.warn('La réponse de l\'API n\'est pas un tableau:', response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        Alert.alert('Erreur', 'Erreur lors du chargement des catégories');
      }
    };

    fetchProduits();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (route.params?.onGoBack) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={route.params.onGoBack}>
            <Text>Retour</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, route.params]);

  const handleAddProduit = async () => {
    const token = await AsyncStorage.getItem('jwt');

    const newProduct = {
      designation,
      description,
      type_categorie: categorie,
      prix: parseFloat(prix),
      quantite: parseInt(quantite),
    };

    try {
      const response = await axios.post(`${configuration.apiUrl}/produits`, newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productId = response.data.produit.id;

      if (image && productId) {
        const formData = new FormData();
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });

        await axios.post(`${configuration.apiUrl}/produits/${productId}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      Alert.alert('Produit créé avec succès');
      navigation.goBack();
      if (route.params?.onGoBack) {
        route.params.onGoBack();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du produit :", error.response ? error.response.data : error.message);
      Alert.alert('Erreur lors de la soumission du produit', error.response ? error.response.data.message : error.message);
    }
  };

  const handleSelectImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0]);
    }
  };

  const handleSelectProduit = (produitId) => {
    setSelectedProduit(produitId);
    setProduitModalVisible(false);
  };

  const handleSelectCategorie = (categorieType) => {
    setCategorie(categorieType);
    setCategorieModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('ProduitList')}>
            <Icon name="arrow-back-outline" size={24} color={"#9098B1"} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajouter Produit</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Produit existant</Text>
          <TouchableOpacity style={styles.button} onPress={() => setProduitModalVisible(true)}>
            <Text style={styles.buttonText}>Sélectionner un produit</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isProduitModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={produitsExistants}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => handleSelectProduit(item.id)}>
                    <Text style={styles.itemText}>{item.designation}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setProduitModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {selectedProduit === '' && (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Désignation</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'designation' && styles.inputFocused
                ]}
                value={designation}
                onChangeText={setDesignation}
                onFocus={() => setFocusedField('designation')}
                onBlur={() => setFocusedField('')}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'description' && styles.inputFocused
                ]}
                value={description}
                onChangeText={setDescription}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField('')}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Catégorie</Text>
              <TouchableOpacity style={styles.input} onPress={() => setCategorieModalVisible(true)}>
                <Text style={styles.inputText}>{categorie ? categorie : "Sélectionner une catégorie"}</Text>
              </TouchableOpacity>
            </View>

            <Modal visible={isCategorieModalVisible} transparent={true} animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.item} onPress={() => handleSelectCategorie(item)}>
                        <Text style={styles.itemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity style={styles.closeButton} onPress={() => setCategorieModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantité</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'quantite' && styles.inputFocused
            ]}
            value={quantite}
            onChangeText={setQuantite}
            keyboardType="numeric"
            onFocus={() => setFocusedField('quantite')}
            onBlur={() => setFocusedField('')}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prix</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'prix' && styles.inputFocused
            ]}
            value={prix}
            onChangeText={setPrix}
            keyboardType="numeric"
            onFocus={() => setFocusedField('prix')}
            onBlur={() => setFocusedField('')}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Image du produit</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={handleSelectImage}>
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={styles.imagePreview}
              />
            ) : (
              <Icon name="add" size={40} color={"#9098B1"} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddProduit}>
          <Text style={styles.submitButtonText}>Ajouter Produit</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
    marginTop : 50
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  headerButtonText: {
    color: Color.colorDarkorchid,
    fontSize: FontSize.headingH4_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
    marginLeft: 5,
  },
  headerTitle: {
    fontSize: FontSize.headingH4_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
    color: Color.neutralDark,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FontSize.bodyTextNormalRegular_size,
    fontFamily: FontFamily.bodyTextNormalBold,
    fontWeight: '700',
    color: Color.neutralDark,
    marginBottom: 5,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: "#6A5ACD",
  },
  inputText: {
    fontSize: FontSize.bodyTextNormalRegular_size,
    color: Color.neutralGrey,
  },
  imageUpload: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    backgroundColor: Color.white,
    alignSelf: 'center',
  },
  imageUploadText: {
    marginLeft: 10,
    fontSize: FontSize.bodyTextNormalRegular_size,
    fontFamily: FontFamily.bodyTextNormalBold,
    fontWeight: '700',
        color: Color.neutralDark,
  },
  imagePreview: {
    height: 100,
    width: 100,
    borderRadius: 5,
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
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: FontSize.bodyTextNormalRegular_size,
    fontFamily: FontFamily.bodyTextNormalBold,
    color: Color.neutralDark,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Color.colorDarkorchid,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddProduit;
