import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color, FontFamily, FontSize, Padding, Border } from "../GlobalStyles";
import { configuration } from '../configuration';

const ShipTo = () => {
    const [addresses, setAddresses] = useState([]);
    const navigation = useNavigation();
    const isFocused = useIsFocused(); // Detect when the screen is focused

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = await AsyncStorage.getItem('token'); // Retrieve the token from AsyncStorage
                if (!token) {
                    Alert.alert('Erreur', 'Token non trouvé');
                    return;
                }

                const response = await axios.get(`${configuration.apiUrl}/positions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAddresses(response.data.positions);
            } catch (error) {
                console.error('Error fetching addresses:', error);
                Alert.alert('Erreur', 'Impossible de récupérer les adresses.');
            }
        };

        fetchAddresses();
    }, [isFocused]); // Refetch addresses whenever the screen is focused

    const handleSelectAddress = (address) => {
        Alert.alert('Adresse sélectionnée', `Vous avez sélectionné: ${address.address}`);
    };

    const handleDeleteAddress = async (addressId) => {
        try {
            const token = await AsyncStorage.getItem('token'); // Retrieve the token from AsyncStorage
            if (!token) {
                Alert.alert('Erreur', 'Token non trouvé');
                return;
            }

            await axios.delete(`${configuration.apiUrl}/positions/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedAddresses = addresses.filter(address => address.id !== addressId);
            setAddresses(updatedAddresses);
            Alert.alert('Succès', 'Adresse supprimée');
        } catch (error) {
            console.error('Error deleting address:', error);
            Alert.alert('Erreur', 'Impossible de supprimer l\'adresse.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.addressContainer, styles.addressBorder]}>
            <Text style={styles.addressName}>{item.user_or_depot.name}</Text>
            <Text style={styles.addressDetails}>{item.address}</Text>
            <Text style={styles.addressDetails}>{item.user_or_depot.phone}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleSelectAddress(item)}>
                    <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteAddress(item.id)}>
                    <Image
                        style={styles.deleteIcon}
                        source={require("../assets/Delete.png")}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={styles.backIcon}
                        source={require("../assets/Left.png")}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Envoyez vers</Text>
                <TouchableOpacity onPress={() => navigation.navigate('AddPositionPage')}>
                    <Image
                        style={styles.addIcon}
                        source={require("../assets/Plus.png")}
                    />
                </TouchableOpacity>
            </View>
            {addresses.length === 0 ? (
                <Text style={styles.emptyText}>Aucune adresse enregistrée.</Text>
            ) : (
                <FlatList
                    data={addresses}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.addressList}
                />
            )}
            <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('NextPage')}>
                <Text style={styles.nextButtonText}>Suivant</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: Color.white,
        borderBottomWidth: 1,
        borderBottomColor: Color.neutralLight,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: FontSize.headingH4_size,
        fontFamily: FontFamily.captionNormalbold,
        color: Color.neutralDark,
    },
    addIcon: {
        width: 24,
        height: 24,
    },
    addressList: {
        padding: 16,
    },
    addressContainer: {
        padding: 16,
        marginBottom: 16,
        borderRadius: Border.br_8xs,
        backgroundColor: Color.white,
    },
    addressBorder: {
        borderColor: Color.neutralLight,
        borderWidth: 1,
    },
    addressName: {
        fontSize: FontSize.font_size,
        fontFamily: FontFamily.captionNormalbold,
        color: Color.neutralDark,
    },
    addressDetails: {
        fontSize: FontSize.headingH6_size,
        fontFamily: FontFamily.captionNormalregular,
        color: Color.neutralGrey,
        marginTop: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    editButton: {
        backgroundColor: Color.colorSlateblue,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: Border.br_8xs,
    },
    editButtonText: {
        color: Color.white,
        fontSize: FontSize.font_size,
        fontFamily: FontFamily.captionNormalbold,
    },
    deleteIcon: {
        width: 24,
        height: 24,
    },
    nextButton: {
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
    nextButtonText: {
        fontSize: FontSize.font_size,
        lineHeight: 25,
        color: Color.white,
        textAlign: "center",
        letterSpacing: 1,
        fontWeight: "700",
        fontFamily: FontFamily.headingH4,
    },
    emptyText: {
        textAlign: 'center',
        color: Color.neutralGrey,
        fontSize: FontSize.font_size,
        fontFamily: FontFamily.captionNormalregular,
        marginTop: 16,
    },
});

export default ShipTo;
