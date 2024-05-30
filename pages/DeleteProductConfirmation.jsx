import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Color, Padding, Border, FontSize, FontFamily } from '../GlobalStyles';

const DeleteProductConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Image
          style={styles.alertIcon}
          source={require("../assets/Alert.png")}
        />
        <Text style={styles.confirmation}>Confirmation</Text>
        <Text style={styles.message}>
          Êtes-vous sûr de vouloir supprimer le produit ?
        </Text>
        <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertIcon: {
    width: 105,
    height: 100,
    marginBottom: 20,
  },
  confirmation: {
    fontSize: FontSize.headingH2_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
    color: Color.neutralDark,
    marginBottom: 10,
    letterSpacing: 1,
  },
  message: {
    fontSize: FontSize.formTextFill_size,
    fontFamily: FontFamily.formTextNormal,
    color: Color.neutralDark,
    opacity: 0.5,
    textAlign: 'center',
    marginBottom: 30,
    //letterSpacing: 1,
  },
  deleteButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: Color.colorDarkorchid,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "rgba(142, 82, 240, 0.3)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 30,
    elevation: 30,
    shadowOpacity: 1,
  },
  deleteButtonText: {
    color: Color.white,
    fontSize: FontSize.headingH5_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cancelButton: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Color.neutralGrey,
    fontSize: FontSize.headingH5_size,
    fontFamily: FontFamily.headingH4,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default DeleteProductConfirmation;
