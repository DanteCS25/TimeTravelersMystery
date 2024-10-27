import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const LevelSelection = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params;

  const handleLevelSelection = (selectedLevel) => {
    navigation.navigate('PuzzleSolving', { level: selectedLevel, imageUri: imageUri });
  };

  return (
    <ImageBackground source={require('../../assets/Paper2.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Difficulty Level</Text>
        
        <View style={styles.levelContainerLeftAligned}>
          <Text style={styles.levelTitle}>Easy</Text>
          <Text style={styles.description}>Perfect for beginners. Fewer pieces to solve, ideal to get started.</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('easy')}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>

        <View style={styles.levelContainerLeftAligned}>
          <Text style={styles.levelTitle}>Medium</Text>
          <Text style={styles.description}>A bit of a challenge. More pieces for a balanced experience.</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('medium')}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>

        <View style={styles.levelContainerLeftAligned}>
          <Text style={styles.levelTitle}>Hard</Text>
          <Text style={styles.description}>For puzzle masters. Lots of pieces to keep you engaged!</Text>
          <TouchableOpacity style={styles.startButton} onPress={() => handleLevelSelection('hard')}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent', // Make background transparent to show the background image
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#4B2E39', // Darker, vintage-inspired color
    fontFamily: 'serif', // Give a vintage typeface look
    textAlign: 'left',
    marginLeft: 30,
    marginTop: '25%',
  },
  levelContainerLeftAligned: {
    marginBottom: 20,
    width: '90%',
    alignItems: 'flex-start',
    padding: 10,
    marginLeft: 10,
  },
  levelTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4B2E39', // Darker, vintage-inspired color
    fontFamily: 'serif',
    marginLeft: 15,
  },
  description: {
    fontSize: 16,
    marginLeft: 15,
    marginBottom: 15,
    color: '#6B4226', // Warm, vintage brown color
    fontFamily: 'serif',
  },
  startButton: {
    backgroundColor: '#A0522D', // SaddleBrown for a vintage touch
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#8B4513',
    marginVertical: 20,
    marginLeft: 10,
  },
});

export default LevelSelection;
