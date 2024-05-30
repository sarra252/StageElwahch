import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configuration } from "../configuration";

const AffichageProduits = () => {
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await axios.get(`${configuration.apiUrl}/produits`);
                setProduits(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des produits:', error);
            }
        };

        fetchProduits();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Produits Disponibles</Text>
            <FlatList
                data={produits}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.produit}>
                        <Text style={styles.text}>{item.designation}</Text>
                        <Text style={styles.text}>Prix: {item.prix_minimum}€</Text>
                    </View>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: "#E5E5FF", 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4B0082', 
    },
    fournisseurContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    fournisseurTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#2F4F4F',
    },
    produit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: '100%',
    },
    button: {
        backgroundColor: "#6A5ACD", 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF', 
        fontSize: 18,
        textAlign: 'center',
        fontWeight: "bold",
    },
});

export default AffichageProduits;
