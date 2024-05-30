import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

const CountdownPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const handleStart = () => setIsPlaying(true);
  const handleStop = () => setIsPlaying(false);
  const handleReset = () => {
    setIsPlaying(false);
    setKey(prevKey => prevKey + 1); // Change the key to reset the timer
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compte à rebours</Text>
      <View style={styles.timerContainer}>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={10} // 10 secondes
          size={150} // Taille réduite
          colors={['#6A5ACD']} // Violet pour le compteur
          trailColor="#FFFFFF" // Blanc pour le fond du cercle
          onComplete={() => {
            alert('Temps écoulé!');
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }) => <Text style={styles.timerText}>{remainingTime}</Text>}
        </CountdownCircleTimer>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={isPlaying ? handleStop : handleStart}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Démarrer'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "#E5E5FF", // Nuance de bleu clair
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4B0082', // Nuance de violet
  },
  timerContainer: {
    marginBottom: 20,
    shadowColor: "#000", // Couleur de l'ombre
    shadowOffset: { width: 0, height: 2 }, // Déplacement de l'ombre
    shadowOpacity: 0.8, // Opacité de l'ombre
    shadowRadius: 3, // Rayon de l'ombre
    elevation: 5, // Élévation pour Android
  },
  timerText: {
    fontSize: 32, // Taille réduite du texte
    color: '#6A5ACD', // Violet moyen
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '80%',
  },
  button: {
    backgroundColor: "#6A5ACD", // Violet
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Blanc
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "bold",
  },
});

export default CountdownPage;
