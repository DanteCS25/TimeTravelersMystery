import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, FlatList, Text } from 'react-native';
import { fetchImages } from '../../server'; // Adjust this import path

const PuzzlePage = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchImages();
        setImages(fetchedImages);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, []);

  return (
    <View style={styles.container}>
      {images.length > 0 ? (
        <FlatList
          data={images}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Text style={styles.imageName}>{item.name}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No images to display</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageName: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default PuzzlePage;
