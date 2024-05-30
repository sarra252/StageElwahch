import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const ModalProduit = ({ isVisible, produits, onSelect, onClose }) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sélectionner un produit</Text>
                <FlatList
                    data={produits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.productItem} onPress={() => onSelect(item.id)}>
                            <Text style={styles.productText}>{item.designation}</Text>
                        </TouchableOpacity>
                    )}
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    productItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    productText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#6A5ACD',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ModalProduit;
