import { View, Text, Button } from "react-native";
import React from "react";
import CalculerDistance from "../GeoAdresse/CalculerDistance";

const Distance = (props) => {
  const { longitude1, latitude1,  longitude2, latitude2  } = props.route.params;

  const distance = CalculerDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
  );

  return (
    <View>
      
      <Text> distance  entre les deux points: {distance} km</Text>

    </View>
  );
};
export default Distance;
