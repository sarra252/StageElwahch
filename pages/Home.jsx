import { View, Text, StyleSheet, Button } from "react-native";
import React from "react";

const Home = (props) => {

  const handlePress1 = () => {
    props.navigation.navigate("Home Screen");
  };

  const handlePress2 = () => {
    props.navigation.navigate("Entree");
  };

  const handlePress3 = () => {
    props.navigation.navigate("Location page")
  };
  const handlePress4 = () => {
    props.navigation.navigate("Carte map")
  };



//ki nroh l distance nedi maeya latitude 12 longitude 12 depuis 
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Home Bonjour </Text>
      <Button onPress={handlePress1} title="naviguer vers homeScreen" />
      <Button onPress={handlePress2} title="naviguer vers Entree" />
      <Button onPress={handlePress3} title="naviguer vers Location page" />
      <Button onPress={handlePress4} title="naviguer vers Carte map" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 25,
  },
});
