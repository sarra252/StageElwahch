import React, { useEffect, useState } from "react";
import { View, Text,Linking } from "react-native";
import axios from "axios";
import { configuration } from "../configuration";

const ListeClients = () => {
    const [client, setClient] = useState([]);
    const [addresses, setAddresses] = useState([]);
  
    const fetchPositions = async () => {
      try {
        const clientsResponse = await axios.get(`${configuration.apiUrl}/clients`);
        setClient(clientsResponse.data);
        const clientsData = clientsResponse.data;
        const addressesArray = [];
  
        for (const client of clientsData) {
          for (const position of client.positions) {
            const latitude = position.latitude;
            const longitude = position.longitude;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${configuration.apiKey}`;
  
            try {
              const response = await axios.get(url);
  
              if (response.data.status === "OK") {
                const address = response.data.results[0].formatted_address;
                console.log("Adresse:", address);
                addressesArray.push(address);
              } else {
                console.log("Erreur lors de la requête:", response.data.status);
              }
            } catch (error) {
              console.error("Error fetching address:", error);
            }
          }
        }
        setAddresses(addressesArray);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };
    

  useEffect(() => {
    fetchPositions();
  }, []);

  /*useEffect(() => {
    const getReverseGeocodingData = async () => {
      try {
        const latitude = clientsResponse.data.latitude;
        const longitude = clientsResponse.data.longitude;
        const apiKey = 'VOTRE_CLE_API';

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status === 'OK') {
          const address = response.data.results[0].formatted_address;
          console.log('Adresse:', address);
        } else {
          console.log('Erreur lors de la requête:', response.data.status);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    getReverseGeocodingData();
  }, []);
*/

return (
    <View>
      {client.map((cl, index) => (
        <View key={cl.id}>
          <Text>Client : {cl.nom} </Text>
          {cl.positions.length > 0 ? (
            cl.positions.map((p, positionIndex) => (
              <View key={p.id}>
                <Text>Position {positionIndex + 1} :</Text>
                <Text>Latitude : {p.latitude}</Text>
                <Text>Longitude : {p.longitude}</Text>
                <Text>Adresse : {addresses[index * cl.positions.length + positionIndex]}</Text>
                <Text onPress={() => Linking.openURL(`https://maps.google.com/?q=${p.latitude},${p.longitude}`)}>Voir sur la carte</Text>
              </View>
            ))
          ) : (
            <Text>Aucune position disponible.</Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default ListeClients;
