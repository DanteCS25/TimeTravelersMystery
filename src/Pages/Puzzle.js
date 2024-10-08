// src/Pages/Puzzle.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Puzzle = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle Challenges</Text>
      <Text style={styles.text}>Solve the mysteries to unlock new adventures...</Text>
      {/* Add your puzzle components and logic here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A403A',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'serif',
    textAlign: 'center',
  },
});

export default Puzzle;
