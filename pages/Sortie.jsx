import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import axios from "axios";
import { configuration } from "../configuration";

const Sortie = () => {
  const [data, setData] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios
        .get(`${configuration.apiUrl}/clients`, {
          timeout: 10000,
        })
        .then((response) => {
          setData(response.data);
        });
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <View>
      <Button title="Récupérer les données" onPress={fetchData} />
      {data && data.length > 0 ? (
        <>
          {data.map((ind, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.text}> nom: {ind.nom}</Text>
              <Text style={styles.text}> prenom: {ind.prenom}</Text>
            </View>
          ))}
        </>
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  item: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});

export default Sortie;
