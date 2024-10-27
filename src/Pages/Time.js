import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const Time = () => {
  return (
    <ImageBackground source={require('../../assets/Paper2.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Time Events</Text>
        <Text style={styles.text}>Explore different time events and historical mysteries...</Text>
        <Text style={styles.text}>COMING SOON</Text>
        {/* Add your content here */}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    marginBottom: 20,
  },
});

export default Time;
