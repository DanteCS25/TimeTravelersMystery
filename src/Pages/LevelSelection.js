import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const LevelSelection = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params;

  const handleLevelSelection = (selectedLevel) => {
    navigation.navigate('PuzzleSolving', { level: selectedLevel, imageUri: imageUri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Difficulty Level</Text>
      
      <View style={styles.levelContainer}>
        <Text style={styles.levelTitle}>Easy</Text>
        <Text style={styles.description}>Perfect for beginners. Fewer pieces to solve, ideal to get started.</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('easy')}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.levelContainer}>
        <Text style={styles.levelTitle}>Medium</Text>
        <Text style={styles.description}>A bit of a challenge. More pieces for a balanced experience.</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('medium')}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.levelContainer}>
        <Text style={styles.levelTitle}>Hard</Text>
        <Text style={styles.description}>For puzzle masters. Lots of pieces to keep you engaged!</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('hard')}>
          <Text style={styles.buttonText}>Start</Text>
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
    backgroundColor: '#FAF0E6', // Vintage parchment-like background color
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4B2E39', // Darker, vintage-inspired color
    fontFamily: 'serif', // Give a vintage typeface look
  },
  levelContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#8B4513', // Brown color for a vintage feel
    borderRadius: 10,
    backgroundColor: '#FFF8DC', // Antique white background
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Adds a subtle shadow for depth
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B2E39', // Darker, vintage-inspired color
    fontFamily: 'serif',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#6B4226', // Warm, vintage brown color
    fontFamily: 'serif',
  },
  startButton: {
    backgroundColor: '#A0522D', // SaddleBrown for a vintage touch
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});

export default LevelSelection;
