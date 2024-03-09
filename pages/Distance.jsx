import { View, Text, Button } from "react-native";
import React from "react";
import CalculerDistance from "../GeoAdresse/CalculerDistance";

const Distance = (props) => {
  const { longitude1, latitude1,  longitude2, latitude2  } = props.route.params;

    console.log("latitude1", latitude1);
    console.log("longitude1", longitude1);
    
    console.log("latitude2", latitude2);
    console.log("longitude2", longitude2);

  const distance = CalculerDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
  );
  console.log("Distance entre les deux points:", distance, "kilomètres");
  return (
    <View>
      
      <Text> distance  entre les deux points: {distance} km</Text>

    </View>
  );
};
export default Distance;
