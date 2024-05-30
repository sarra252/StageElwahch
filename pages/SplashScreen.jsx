import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import { Border, Color, FontSize, FontFamily } from "../GlobalStyles";

const SplashScreen = () => {
  return (
    <View style={styles.splashScreen}>
      <View style={styles.iconAppsingleIconWhite}>
        <View style={[styles.iconAppsingleIconWhiteChild, styles.iconPosition]} />
        <Image
          style={[styles.iconAppsingleIconWhiteItem, styles.iconLayout]}
          contentFit="cover"
          source={require("../assets/Group 401.png")}
        />
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  iconPosition: {
    left: "0%",
    position: "absolute",
    width: "100%",
  },
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  uiStatusBarsPosition: {
    width: 375,
    left: 0,
    position: "absolute",
  },
  iconAppsingleIconWhiteChild: {
    height: "100%",
    top: "0%",
    right: "0%",
    bottom: "0%",
    borderRadius: Border.br_base,
    backgroundColor: Color.colorLavender_200,
  },
  iconAppsingleIconWhiteItem: {
    height: "44.44%",
    width: "44.44%",
    top: "27.78%",
    right: "27.78%",
    bottom: "27.78%",
    left: "27.78%",
  },
  iconAppsingleIconWhite: {
    top: 370,
    left: 151,
    width: 72,
    height: 72,
    position: "absolute",
  },


 
  splashScreen: {
    backgroundColor: Color.colorDarkorchid,
    flex: 1,
    height: 812,
    overflow: "hidden",
    width: "100%",
  },
});

export default SplashScreen;
