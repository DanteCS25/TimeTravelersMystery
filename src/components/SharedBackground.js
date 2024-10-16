import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

const SharedBackground = ({ children, isSignup }) => {
  return (
    <ImageBackground
      source={require('../../assets/BackgroundLogin.png')}
      style={styles.backgroundImage}
      imageStyle={{ 
        width: '200%', // Double the width to accommodate both pages
        left: isSignup ? '-50%' : '0%', // Shift left for signup
      }}
    >
      <View style={styles.container}>
        {children}
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
    padding: 20,
  },
});

export default SharedBackground;
