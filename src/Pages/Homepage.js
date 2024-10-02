import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Time Traveler's Mystery</Text>
        <Text style={styles.subtitle}>Embark on an adventure through time and uncover hidden secrets in history!</Text>
      </View>
      <Text style={styles.testText}>This is a test text to check rendering.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333', // Adjust the background color or use an image
  },
  header: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
  },
  testText: {
    color: 'white',
    marginTop: 20,
  },
});

export default HomePage;
