import React from 'react';
import { View, ImageBackground } from 'react-native';
import Navbar from './src/components/Navbar';

export default function App() {
  return (
    <ImageBackground
      source={require('./assets/Paper2.jpg')}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <Navbar />
      </View>
    </ImageBackground>
  );
}



