import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.logo}>Time Traveler's Mystery</Text>
      <View style={styles.links}>
        <Text style={styles.link}>Home</Text>
        <Text style={styles.link}>About</Text>
        <Text style={styles.link}>Adventures</Text>
        <Text style={styles.link}>Contact</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#333',
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: 'white',
    marginHorizontal: 10,
  },
});

export default Navbar;
