import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput } from "react-native";
import * as Location from "expo-location";
import Distance from "./Distance";
import CalculerDistance from "../GeoAdresse/CalculerDistance";
import { GetCoordonneesFromAdresse } from "../GeoAdresse/GetCoordonneesFromAdresse";

const LocationPage = (props) => {
  useEffect(() => {
    requestLocationPermission();
  }, []);
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
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        console.log("Permission autorisée");
        getCurrentLocation();
      } else {
        console.log("Permission refusée");
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
    }
  };

  const [latitude2, setLatitude2] = useState(0);
  const [longitude2, setLongitude2] = useState(0);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLatitude2(location.coords.latitude);
      setLongitude2(location.coords.longitude);
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
    }
  };


  handlePress =() => {
    props.navigation.navigate("Distance",
    {
      longitude1: longitude1,
      latitude1: latitude1,
      longitude2: longitude2,
      latitude2: latitude2,
    });
  }

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="Entrez une adresse"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Obtenir les coordonnées" onPress={handleGetCoordinates} />
      {latitude1 !== 0 && <Text>Latitude: {latitude1}</Text>}
      {longitude1 !== 0 && <Text>Longitude: {longitude1}</Text>}
      <Button title="Obtenir la position" onPress={getCurrentLocation} />
      {latitude2 !== 0 && <Text>Latitude: {latitude2}</Text>}
      {longitude2 !== 0 && <Text>Longitude: {longitude2}</Text>}

      <Button title="Obtenir la distance" onPress={handlePress} />
    </View>
  );
};

export default LocationPage;
