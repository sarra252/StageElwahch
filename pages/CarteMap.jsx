import { View, StyleSheet, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { Children, useState } from "react";
import axios from "axios";
import { configuration } from "../configuration";

const CarteMap = ({ navigation }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [type, setType] = useState(null);

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setSelectedPosition(coordinate);
    setLatitude(coordinate.latitude);
    setLongitude(coordinate.longitude);
    await addPosition(coordinate.latitude, coordinate.longitude);
  };

  const addPosition = async (latitude, longitude) => {
    try {
      const randomClient = await getRandomClient();
      const typePosition = await getTypePosition();
      setType(typePosition);
      if (randomClient && typePosition) {
        const response = await axios.post(
          `${configuration.apiUrl}/positions`,
          {
            latitude,
            longitude,
            client_id: randomClient.id,
            type: typePosition,
          }
        );
      }
    } catch (error) {
      console.error("Error adding position to database:", error);
    }
  };

  const getRandomClient = async () => {
    try {
      const clientsResponse = await axios.get(
        `${configuration.apiUrl}/clients`
      );
      console.log(clientsResponse.data);
      const clients = clientsResponse.data;
      const randomClientIndex = Math.floor(Math.random() * clients.length);
      return clients[randomClientIndex];
    } catch (error) {
      console.error("Error fetching random client:", error);
      return null;
    }
  };

  const getTypePosition = async () => {
    try {
      const latitude1 = selectedPosition.latitude;
      console.log("LATITUDEEEE", selectedPosition.latitude);
      const longitude1 = selectedPosition.longitude;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude1},${longitude1}&key=${configuration.apiKey}`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        return '0' ;
      } else {
        return -1 ;
      }
    } catch (error) {
      console.error(
        "Error fetching position information from Google API:",
        error
      );
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 28.0339,
          longitude: 1.6596,
          latitudeDelta: 12,
          longitudeDelta: 12,
        }}
        onPress={handleMapPress}
      >
        {selectedPosition && (
          <Marker coordinate={selectedPosition} title="Selected Position" />
        )}
      </MapView>
      {latitude !== null && longitude !== null && (
        <View style={styles.coordsContainer}>
          <Text>Latitude: {latitude}</Text>
          <Text>Longitude: {longitude}</Text>
        </View>
      )}
  
      {type !== null && ( 
        <View style={styles.coordsContainer}>
          <Text>Type de position: {type === 0 ? "Connue" : "Inconnue"}</Text>
        </View>
      )}
  
      <Button
        title="Afficher les clients avec leurs positions"
        onPress={() => navigation.navigate("Liste client")}
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coordsContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
});

export default CarteMap;
