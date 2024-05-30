import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Color, FontFamily, Border, FontSize } from '../GlobalStyles';
import { configuration } from '../configuration';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProduit = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { product } = route.params;
    const [designation, setDesignation] = useState('');
    const [description, setDescription] = useState('');
    const [categorie, setCategorie] = useState('');
    const [quantite, setQuantite] = useState('');
    const [prix, setPrix] = useState('');
    const [image, setImage] = useState(null);
    const [focusedField, setFocusedField] = useState('');

    useEffect(() => {
        if (product) {
            setDesignation(product.designation);
            setDescription(product.description);
            setCategorie(product.type_categorie);
            setQuantite(product.quantite.toString());
            setPrix(product.prix.toString());
            setImage(product.image_path ? { uri: `${configuration.apiUrl}/${product.image_path}` } : null);
        }
    
        if (route.params?.onGoBack) {
            navigation.setOptions({
                onGoBack: route.params.onGoBack,
            });
        }
    }, [product, route.params, navigation]);
    
    const handleEditProduit = async () => {
        const updatedProduct = {
            designation,
            description,
            type_categorie: categorie,
            prix: parseFloat(prix),
            quantite: parseInt(quantite),
        };
    
        try {
            const token = await AsyncStorage.getItem('jwt');
            const response = await axios.put(`${configuration.apiUrl}/produits/${product.id}`, updatedProduct, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (image && image.uri !== product.image_path) {
                const formData = new FormData();
                formData.append('image', {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: 'product_image.jpg',
                });
    
                await axios.post(`${configuration.apiUrl}/produits/${product.id}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
    
            Alert.alert('Produit modifié avec succès');
            if (route.params?.onGoBack) {
                route.params.onGoBack();
            }
            navigation.goBack();
        } catch (error) {
            console.error("Erreur lors de la modification du produit :", error.response ? error.response.data : error.message);
            Alert.alert('Erreur lors de la modification du produit', error.response ? error.response.data.message : error.message);
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back-outline" size={24} color={"#9098B1"} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Modifier Produit</Text>
                </View>

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
                    <TextInput
                        style={[
                            styles.input,
                            focusedField === 'categorie' && styles.inputFocused
                        ]}
                        value={categorie}
                        onChangeText={setCategorie}
                        onFocus={() => setFocusedField('categorie')}
                        onBlur={() => setFocusedField('')}
                    />
                </View>

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

                <TouchableOpacity style={styles.submitButton} onPress={handleEditProduit}>
                    <Text style={styles.submitButtonText}>Modifier Produit</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
        marginTop: 50
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

export default EditProduit;
