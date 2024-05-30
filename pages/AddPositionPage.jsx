import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { configuration } from '../configuration';

const AddPositionPage = () => {
    const mapRef = useRef();
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [address, setAddress] = useState('');
    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04 * (Dimensions.get('window').width / Dimensions.get('window').height),
            });
            getAddress(location.coords.latitude, location.coords.longitude);
        })();
    }, []);

    const getAddress = async (latitude, longitude) => {
        try {
            const response = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (response.length > 0) {
                const address = response[0];
                setAddress(`${address.street}, ${address.city}, ${address.region}, ${address.postalCode}, ${address.country}`);
            } else {
                setAddress('Adresse non trouvée');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            setAddress('Erreur lors de la récupération de l\'adresse');
        }
    };

    const handleAddPosition = async () => {
        if (!location) {
            setError('Unable to fetch location. Please try again.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token'); // Ensure you have the token
            if (!token) {
                Alert.alert('Erreur', 'Token non trouvé');
                return;
            }

            const response = await axios.post(`${configuration.apiUrl}/positions`, {
                latitude: location.latitude,
                longitude: location.longitude,
                address: address
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("response", response.data);
            Alert.alert('Position ajoutée', 'Votre position a été ajoutée avec succès !');
            navigation.navigate('ShipTo');
        } catch (error) {
            setError('Une erreur s\'est produite lors de l\'ajout de la position');
            if (error.response) {
                console.error('Erreur de réponse:', error.response.data);
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
            } else {
                console.error('Erreur:', error.message);
            }
        }
    };

    const handleMapPress = (e) => {
        const coordinate = e.nativeEvent.coordinate;
        setLocation(coordinate);
        getAddress(coordinate.latitude, coordinate.longitude);
        mapRef.current.animateToRegion({
            ...coordinate,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01 * (Dimensions.get('window').width / Dimensions.get('window').height),
        }, 1000);
    };

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={location}
                    onPress={handleMapPress}
                >
                    <Marker coordinate={location}>
                        <Image
                            source={require('../assets/current-location.png')}
                            style={{ width: 40, height: 40 }} // Resize the image
                            resizeMode="contain"
                        />
                    </Marker>
                </MapView>
            ) : (
                <Text>Chargement de la position actuelle...</Text>
            )}
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{address}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddPosition}>
                <Text style={styles.buttonText}>Ajouter la position</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#E5E5FF',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    button: {
        width: '90%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#6A5ACD',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    addressContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
    },
    addressText: {
        fontSize: 16,
        color: '#333',
    },
});

export default AddPositionPage;
