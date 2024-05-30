import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Button, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import axios from 'axios';
import { configuration } from '../configuration'; // Assurez-vous que le chemin est correct

const Map = ({ navigation }) => {
  const mapRef = useRef();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedPosition(coordinate);
    addPosition(coordinate.latitude, coordinate.longitude);
  };

  const addPosition = async (latitude, longitude) => {
    try {
      const randomClient = await getRandomClient();
      if (randomClient) {
        await axios.post(`${configuration.apiUrl}/positions`, {
          latitude,
          longitude,
          client_id: randomClient.id,
        });
      }
    } catch (error) {
      console.error('Error adding position to database:', error);
    }
  };

  const getRandomClient = async () => {
    try {
      const clientsResponse = await axios.get(`${configuration.apiUrl}/clients`);
      const clients = clientsResponse.data;
      const randomClientIndex = Math.floor(Math.random() * clients.length);
      return clients[randomClientIndex];
    } catch (error) {
      console.error('Error fetching random client:', error);
      return null;
    }
  };

  const getLiveLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setCurrentPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04 * (Dimensions.get('window').width / Dimensions.get('window').height),
    });
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  return (
    <View style={styles.container}>
      {currentPosition && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={currentPosition}
          onPress={handleMapPress}
        >
          <Marker coordinate={currentPosition}>
            <Image
              source={require('../assets/current-location.png')}
              style={{ width: 40, height: 40 }} // Redimensionnez l'image ici
              resizeMode="contain"
            />
          </Marker>
          {selectedPosition && (
            <Marker coordinate={selectedPosition}>
              <Image
                source={require('../assets/car.png')}
                style={{ width: 40, height: 40 }} // Redimensionnez l'image ici
                resizeMode="contain"
              />
            </Marker>
          )}
          {currentPosition && selectedPosition && (
            <MapViewDirections
              origin={currentPosition}
              destination={selectedPosition}
              apikey={configuration.apiKey}
              strokeColor="hotpink"
              strokeWidth={4}
              onError={(errorMessage) => console.error('MapViewDirections Error:', errorMessage)}
            />
          )}
        </MapView>
      )}
      <Button
        title="Afficher les clients avec leurs positions"
        onPress={() => navigation.navigate('Liste client')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
