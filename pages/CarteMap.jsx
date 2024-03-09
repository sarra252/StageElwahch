import { View, StyleSheet, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState } from "react";
import axios from "axios";
import { configuration } from "../configuration";

const CarteMap = ({ navigation }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

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
      if (randomClient) {
        const response = await axios.post(
          `${configuration.apiUrl}/create_position`,
          { latitude, longitude, client_id: randomClient.id }
        );
        console.log("Position added successfully:", response.data);
      }
    } catch (error) {
      console.error("Error adding position to database:", error);
    }
  };

  const getRandomClient = async () => {
    try {
      const clientsResponse = await axios.get(`${configuration.apiUrl}/clients`);
      console.log(clientsResponse.data);
      const clients = clientsResponse.data;
      const randomClientIndex = Math.floor(Math.random() * clients.length);
      return clients[randomClientIndex];
    } catch (error) {
      console.error("Error fetching random client:", error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
