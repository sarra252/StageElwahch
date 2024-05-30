
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { configuration } from '../configuration';
import { Color, FontFamily, Border, FontSize } from '../GlobalStyles';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigation = useNavigation();
    const [userType, setUserType] = useState('client');
    const [focusedField, setFocusedField] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        })();
    }, []);

    const handleUserTypeChange = (type) => {
        setUserType(type);
    };

    const validateFields = () => {
        let valid = true;

        if (name.trim() === '') {
            setNameError('Le nom est requis');
            valid = false;
        } else {
            setNameError('');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Email invalide. Exemple: exemple@domaine.com');
            valid = false;
        } else {
            setEmailError('');
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneNumberError('Numéro de téléphone invalide. Doit contenir 10 chiffres.');
            valid = false;
        } else {
            setPhoneNumberError('');
        }

        if (password.length < 6) {
            setPasswordError('Le mot de passe doit contenir au moins 6 caractères.');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    };

    const handleRegister = async () => {
        if (!validateFields()) {
            return;
        }
    
        if (!location) {
            setError('Unable to fetch location. Please try again.');
            return;
        }
    
        try {
            const response = await axios.post(`${configuration.apiUrl}/register`, {
                name,
                email,
                password,
                telephone: phoneNumber, // Assurez-vous que le nom du champ correspond à ce que le backend attend
                user_type: userType,
                latitude: location.latitude,
                longitude: location.longitude,
            });
    
            // Stocker le type d'utilisateur
            await AsyncStorage.setItem('userType', userType);
    
            Alert.alert('Inscription réussie', 'Vous êtes maintenant inscrit !');
            navigation.navigate('LoginPage');
        } catch (error) {
            setError('Une erreur s\'est produite lors de l\'inscription');
            if (error.response) {
                console.error('Erreur de réponse:', error.response.data);
            } else if (error.request) {
                console.error('Erreur de requête:', error.request);
            } else {
                console.error('Erreur:', error.message);
            }
        }
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.container}>
                    <View style={styles.icon}>
                        <View style={styles.iconChild} />
                        <Image
                            style={[styles.iconItem, styles.iconLayout]}
                            contentFit="cover"
                            source={require('../assets/Group 400.png')}
                        />
                    </View>
                    <Text style={[styles.bienvenueChezCodeit]}>
                        Bienvenue chez CodeIT Delivery
                    </Text>
                    <Text style={[styles.creerUnNouveau]}>
                        Créer un nouveau compte
                    </Text>
                    <View style={[
                        styles.formLayout,
                        {
                            backgroundColor: focusedField === 'name' ? Color.white : 'transparent',
                            borderWidth: 1,
                            borderColor: nameError ? 'red' : (focusedField === 'name' ? "#6A5ACD" : Color.white),
                        },
                        styles.inputForm
                    ]}>
                        <Image
                            style={styles.systemIcon24px}
                            contentFit="cover"
                            source={require('../assets/User.png')}
                        />
                        <TextInput
                            style={[styles.yourInput, styles.vousClr]}
                            placeholder="Nom Complet"
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField('')}
                        />
                    </View>
                    {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
                    <View style={[
                        styles.formLayout,
                        {
                            backgroundColor: focusedField === 'email' ? Color.white : 'transparent',
                            borderWidth: 1,
                            borderColor: emailError ? 'red' : (focusedField === 'email' ? "#6A5ACD" : Color.white),
                        },
                        styles.inputForm
                    ]}>
                        <Image
                            style={styles.systemIcon24px}
                            contentFit="cover"
                            source={require('../assets/Message.png')}
                        />
                        <TextInput
                            style={[styles.yourInput, styles.vousClr]}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                        />
                    </View>
                    {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
                    <View style={[
                        styles.formLayout,
                        {
                            backgroundColor: focusedField === 'phoneNumber' ? Color.white : 'transparent',
                            borderWidth: 1,
                            borderColor: phoneNumberError ? 'red' : (focusedField === 'phoneNumber' ? "#6A5ACD" : Color.white),
                        },
                        styles.inputForm
                    ]}>
                        <Image
                            style={styles.systemIcon24px}
                            contentFit="cover"
                            source={require('../assets/Phone.png')}
                        />
                        <TextInput
                            style={[styles.yourInput, styles.vousClr]}
                            placeholder="Numéro de téléphone"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            onFocus={() => setFocusedField('phoneNumber')}
                            onBlur={() => setFocusedField('')}
                        />
                    </View>
                    {phoneNumberError ? <Text style={styles.error}>{phoneNumberError}</Text> : null}
                    <View style={[
                        styles.formLayout,
                        {
                            backgroundColor: focusedField === 'password' ? Color.white : 'transparent',
                            borderWidth: 1,
                            borderColor: passwordError ? 'red' : (focusedField === 'password' ? "#6A5ACD" : Color.white),
                        },
                        styles.inputForm
                    ]}>
                        <Image
                            style={styles.systemIcon24px}
                            contentFit="cover"
                            source={require('../assets/Password.png')}
                        />
                        <TextInput
                            style={[styles.yourInput, styles.vousClr]}
                            placeholder="Mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField('')}
                        />
                    </View>
                    {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
                    <Text style={[styles.vousClr, styles.vousLayout, styles.alignLeft]}>Etes-vous un :</Text>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[
                                styles.buttonCheckbox,
                                userType === 'client' && styles.buttonCheckboxSelected
                            ]}
                            onPress={() => handleUserTypeChange('client')}
                        >
                            <Text style={[
                                styles.label,
                                userType === 'client' ? styles.CheckBoxSelected : styles.CheckBox
                            ]}>Client</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.buttonCheckbox,
                                userType === 'fournisseur' && styles.buttonCheckboxSelected
                            ]}
                            onPress={() => handleUserTypeChange('fournisseur')}
                        >
                            <Text style={[
                                styles.label,
                                userType === 'fournisseur' ? styles.CheckBoxSelected : styles.CheckBox
                            ]}>Fournisseur</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.buttonCheckbox,
                                userType === 'depot' && styles.buttonCheckboxSelected
                            ]}
                            onPress={() => handleUserTypeChange('depot')}
                        >
                            <Text style={[
                                styles.label,
                                userType === 'depot' ? styles.CheckBoxSelected : styles.CheckBox
                            ]}>Dépôt</Text>
                        </TouchableOpacity>
                    </View>
                    {error ? <Text style={styles.error}>{error}</Text> : null}
                    <TouchableOpacity style={styles.signInButton} onPress={handleRegister}>
                        <Text style={[styles.signIn, styles.labelTypo]}>S'inscrire</Text>
                    </TouchableOpacity>
                    <Text style={[styles.vousAvezDejaContainer, styles.vousLayout]}>
                        <Text style={styles.vousClr}>Vous avez déjà un compte?</Text>
                        <Text style={styles.labelTypo}>
                            <Text style={styles.text}>{` `}</Text>
                            <Text style={styles.seConnecter1} onPress={() => navigation.navigate('LoginPage')}>Se connecter</Text>
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
    position: "absolute",
  },
  vousClr: {
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
  alignLeft: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 20,
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
    top: -30,
    left: 160,
    width: 72,
    height: 72,
    position: "absolute",
    marginTop: 50,
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
  creerUnNouveau: {
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 30,
    text: "#6A5ACD"
  },
  buttonCheckbox: {
    backgroundColor: "#DEE5FB",
    padding: 10,
    borderRadius: 5,
  },
  CheckBox: {
    fontSize: FontSize.font_size,
    lineHeight: 25,
    color: Color.colorDarkorchid,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "700",
  },
  buttonCheckboxSelected: {
    shadowColor: "rgba(142, 82, 240, 0.3)",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 30,
    elevation: 30,
    shadowOpacity: 1,
    backgroundColor: Color.colorDarkorchid,
    borderColor: Color.colorDarkorchid,
    borderRadius: 5,
  },
  CheckBoxSelected: {
    fontSize: FontSize.font_size,
    lineHeight: 25,
    color: Color.white,
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "700",
  },
  text: {
    color: Color.colorMediumslateblue,
  },
  seConnecter1: {
    color: Color.colorDarkorchid,
  },
  vousAvezDejaContainer: {
    marginTop: 30,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#F0E9FB",
    marginTop : 30
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default RegisterPage;
