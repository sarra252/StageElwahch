// TabBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontFamily, FontSize, Border } from './GlobalStyles';

const TabBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}>
        <Image
          style={styles.tabIcon}
          source={require('./assets/Home.png')}
        />
        <Text style={styles.tabLabel}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Cart')}>
        <Image
          style={styles.tabIcon}
          source={require('./assets/Cart.png')}
        />
        <Text style={styles.tabLabel}>Panier</Text>
        <View style={styles.notificationMark}>
          <Text style={styles.notificationText}>2</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Offers')}>
        <Image
          style={styles.tabIcon}
          source={require('./assets/Offer.png')}
        />
        <Text style={styles.tabLabel}>Offre</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Profile')}>
        <Image
          style={styles.tabIcon}
          source={require('./assets/User.png')}
        />
        <Text style={styles.tabLabel}>Compte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 93,
    width: '100%',
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    //borderTopWidth: 1,
    //borderColor: Color.,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  tabLabel: {
    color: Color.neutralGrey,
    fontFamily: FontFamily.formTextNormal,
    fontSize: FontSize.captionNormalregular_size,
    textAlign: 'center',
  },
  notificationMark: {
    position: 'absolute',
    top: 5,
    right: 15,
    backgroundColor: Color.primaryRed,
    borderRadius: Border.br_full,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: Color.white,
    fontSize: FontSize.captionNormalregular_size,
  },
});

export default TabBar;
