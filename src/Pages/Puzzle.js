import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ImageGallery from '../components/ImageGallery'; // Import your ImageGallery component

const PuzzlePage = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageGallery />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default PuzzlePage;
