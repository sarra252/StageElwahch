import axios from "axios";
import { configuration } from "../configuration";

const API_KEY = "AIzaSyD9fSae5vf2B2ZRPi8z6kyUy3lAI8d3AQY";

export const GetCoordonneesFromAdresse = async (address) => {
  try {
    const response = await axios.get(configuration.BASE_URL, {
      params: {
        address: address,
        key: API_KEY,
      },
    });

    if (response.data.status === "OK") {
      console.log(response);
      const { lat, lng } = response.data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("Erreur lors de la récupération des coordonnées");
    }
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};




