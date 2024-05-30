import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import ListePositionsClients from "../components/ListePositionClients";
import ListeAdressesClients from "../components/ListeAdresseClients";

const ListeClients = () => {
    const [addresses, setAddresses] = useState([]);
    const [client, setClient] = useState([]);

  return (
    <ScrollView style={styles.scrollView}>
      <ListePositionsClients setAddresses={setAddresses} setClient={setClient} /> 
      <ListeAdressesClients client={client} addresses={addresses} /> 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default ListeClients;