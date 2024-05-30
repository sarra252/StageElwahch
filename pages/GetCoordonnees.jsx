import { View, TextInput, Button, Text } from "react-native";
import React, { useState } from "react";
import { GetCoordonneesFromAdresse } from "../GeoAdresse/GetCoordonneesFromAdresse";
import CalculerDistance from "../GeoAdresse/CalculerDistance";
import Distance from "./Distance";

const GetCoordonnees = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const [longitude1, setLongitude1] = useState(0);
  const [latitude1, setLatitude1] = useState(0);

  const handleGetCoordinates = async () => {
    try {
      const coords = await GetCoordonneesFromAdresse(address);
      setCoordinates(coords);

      setLongitude1(coords.longitude);
      setLatitude1(coords.latitude);
    } catch (error) {
      console.error("Erreur lors de la récupération des coordonnées:", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Entrez une adresse"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Obtenir les coordonnées" onPress={handleGetCoordinates} />
      {coordinates && (
        <Text>
          Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
        </Text>
      )}
    </View>
  );
};

export default GetCoordonnees;
