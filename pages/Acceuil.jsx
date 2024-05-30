import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Acceuil = ({ navigation }) => {
  const handlePressLocation = () => {
    navigation.navigate('Location page');
  };

  const handlePressListeClients = () => {
    navigation.navigate('Liste client');
  };

  return (
    <View style={styles.container}>
      {/*<Image source={require('./path/to/your/logo.png')} style={styles.logo} />*/}
      <Text style={styles.title}>Bienvenue sur l'application de livraison de colis</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePressLocation}>
          <Text style={styles.buttonText}>Localiser un colis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePressListeClients}>
          <Text style={styles.buttonText}>Voir la liste des clients</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "#E5E5FF", // Nuance de bleu clair
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B0082', // Nuance de violet
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  button: {
    backgroundColor: "#6A5ACD", // Violet
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Blanc
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "bold",
  },
});

export default Acceuil;
