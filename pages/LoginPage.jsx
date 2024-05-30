import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color, FontFamily, Border, FontSize } from '../GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { configuration } from '../configuration';
import { useUser } from './contexts/userContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();
  const { setUserType } = useUser();

  const validateFields = () => {
    let valid = true;

    if (!email) {
      setEmailError('Email est requis');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email non valide');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Mot de passe est requis');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await axios.post(`${configuration.apiUrl}/login`, {
        email,
        password,
      });

      console.log('Server response:', response.data); // Log the entire response

      const { token, userType } = response.data;

      if (token && userType) {
        console.log('Token:', token);
        console.log('UserType:', userType);

        Alert.alert('Connexion réussie', 'Vous êtes maintenant connecté !');

        await AsyncStorage.setItem('jwt', token);
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('userType', userType);

        setUserType(userType);
        
        // Navigate to MainDrawer
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainDrawer' }],
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      if (error.response) {
        console.error('Erreur de réponse:', error.response.data);
        const statusCode = error.response.status;

        if (statusCode === 401) {
          setPasswordError('Mot de passe incorrect');
          setEmailError('');
        } else if (statusCode === 404) {
          setEmailError('Email incorrect');
          setPasswordError('');
        } else if (statusCode === 409) {
          if (error.response.data.message.includes('already exists')) {
            setEmailError('Email existe déjà');
            setPasswordError('');
          }
        } else {
          setEmailError('Une erreur s\'est produite');
          setPasswordError('Une erreur s\'est produite');
        }
      } else if (error.request) {
        console.error('Erreur de requête:', error.request);
        setEmailError('Erreur de réseau');
        setPasswordError('Erreur de réseau');
      } else {
        console.error('Erreur:', error.message);
        setEmailError('Une erreur s\'est produite');
        setPasswordError('Une erreur s\'est produite');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.login}>
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <View style={styles.iconChild} />
              <Image
                style={[styles.iconItem, styles.iconLayout]}
                contentFit="cover"
                source={require('../assets/Group 400.png')}
              />
            </View>
            <Text style={[styles.bienvenueChezCodeit, styles.text1Clr]}>
              Bienvenue chez CodeIT Delivery
            </Text>
          </View>
          <Text style={[styles.connexion, styles.connexionClr]}>Connexion</Text>
          <View style={[
            styles.formLayout,
            { 
              backgroundColor: emailFocused ? Color.white : 'transparent',
              borderColor: emailError ? 'red' : (emailFocused ? "#6A5ACD" : Color.white),
              borderWidth: 1
            },
            styles.inputForm
          ]}>
            <Image
              style={styles.systemIcon24px}
              contentFit="cover"
              source={require('../assets/Message.png')}
            />
            <TextInput
              style={[styles.yourInput, styles.connexionClr]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          <View style={[
            styles.formLayout,
            { 
              backgroundColor: passwordFocused ? Color.white : 'transparent',
              borderColor: passwordError ? 'red' : (passwordFocused ? "#6A5ACD" : Color.white),
              borderWidth: 1
            },
            styles.inputForm
          ]}>
            <Image
              style={styles.systemIcon24px}
              contentFit="cover"
              source={require('../assets/Password.png')}
            />
            <TextInput
              style={[styles.yourInput, styles.connexionClr]}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={[styles.signIn, styles.labelTypo]}>Se connecter</Text>
          </TouchableOpacity>
          <Text style={[styles.motDePasse, styles.motDePasseTypo]}>
            Mot de passe oublié ?
          </Text>
          <Text style={[styles.vousNavezPasContainer, styles.motDePasseTypo]}>
            <Text style={styles.connexionClr}>Vous n’avez pas de compte?</Text>
            <Text style={styles.labelTypo}>
              <Text style={styles.text}>{` `}</Text>
              <Text style={styles.sinscrire1} onPress={() => navigation.navigate('RegisterPage')}>S'inscrire</Text>
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  text1Clr: {
    color: Color.neutralDark,
    textAlign: "center",
  },
  connexionClr: {
    color: Color.neutralGrey,
    fontFamily: FontFamily.bodyTextNormalRegular,
  },
  formLayout: {
    height: 48,
    width: 343,
    borderRadius: 5,
    marginTop: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelTypo: {
    fontFamily: FontFamily.headingH4,
    fontWeight: "700",
  },
  vousLayout: {
    lineHeight: 18,
    fontSize: FontSize.bodyTextNormalRegular_size,
    letterSpacing: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconChild: {
    height: "100%",
    top: "0%",
    right: "0%",
    bottom: "0%",
    borderRadius: Border.br_base,
    backgroundColor: Color.colorDarkorchid,
    left: "0%",
    position: "absolute",
    width: "100%",
  },
  iconItem: {
    height: "44.44%",
    width: "44.44%",
    top: "27.78%",
    right: "27.78%",
    bottom: "27.78%",
    left: "27.78%",
  },
  icon: {
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bienvenueChezCodeit: {
    marginTop: 10,
    lineHeight: 24,
    textAlign: "center",
    fontSize: FontSize.headingH4_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: "700",
    letterSpacing: 1,
  },
  connexion: {
    marginTop: 10,
    lineHeight: 22,
    fontSize: FontSize.bodyTextNormalRegular_size,
    fontFamily: FontFamily.bodyTextNormalRegular,
    letterSpacing: 1,
    textAlign: "center",
  },
  systemIcon24px: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  yourInput: {
    flex: 1,
    fontSize: FontSize.bodyTextNormalRegular_size,
  },
  signIn: {
    fontSize: FontSize.font_size,
    lineHeight: 25,
    color: Color.white,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "700",
  },
  signInButton: {
    marginTop: 30,
    shadowColor: "rgba(142, 82, 240, 0.3)",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 30,
    elevation: 30,
    shadowOpacity: 1,
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    width: 343,
    borderRadius: 5,
    backgroundColor: Color.colorDarkorchid,
    justifyContent: 'center',
  },
  motDePasse: {
    marginTop: 20,
    textAlign: "center",
    color: Color.colorDarkorchid,
    fontFamily: FontFamily.headingH4,
    fontWeight: "700",
  },
  text: {
    color: Color.colorMediumslateblue,
  },
  sinscrire1: {
    color: Color.colorDarkorchid,
  },
  vousNavezPasContainer: {
    marginTop: 20,
    textAlign: "center",
  },
  login: {
    backgroundColor: "#F0E9FB",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Login;
