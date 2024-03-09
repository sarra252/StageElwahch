import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { configuration } from '../configuration';


const Entree = (props) => {

    const [formData,setFormData] = useState({
        nom: "",
        prenom: "",
    });


    const handleChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    

    const handleSubmit =  async () => {
        try {
            const response = await axios.post(`${configuration.apiUrl}/create_client`, formData);
            console.log(response.data);
        } catch (error) {
            console.error(`Error: ${error}`);  
        }
    }

    const handlePress = () => {
        props.navigation.navigate("Sortie");
      };



  return (
    <View>
        <TextInput
            style={styles.input}
            placeholder="nom"
            onChangeText={(text) => handleChange('nom', text)}
        />

        <TextInput
            style={styles.input}
            placeholder="prenom"
            onChangeText={(text) => handleChange('prenom', text)}
        />


        <Button onPress={handleSubmit} title="Soumettre" />
        <Button onPress={handlePress} title="Naviguer vers Sortie" />

          </View>
        );
}
const styles = {
    input: {
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom: 10,
      padding: 10,
    },
  };

export default Entree;
