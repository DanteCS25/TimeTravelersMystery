// src/Pages/Time.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Time = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Events</Text>
      <Text style={styles.text}>Explore different time events and historical mysteries...</Text>
      {/* Add your content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC', // Beige background for a vintage feel
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

export default Time;
