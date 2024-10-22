import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchImages } from '../../server';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getImages = async () => {
      try {
        const fetchedImages = await fetchImages();
        if (fetchedImages.length > 0) {
          setImages(fetchedImages);
          setFilteredImages(fetchedImages);
        } else {
          console.log("No images fetched");
        }
      } catch (error) {
        console.error("Error fetching images:", error.message);
      }
    };

    getImages();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredImages(images);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      setFilteredImages(images.filter(image =>
        image.name.toLowerCase().includes(lowerCaseQuery)
      ));
    }
  }, [searchQuery, images]);

  const handleSelectImage = (uri, puzzleId) => {
    navigation.navigate('PuzzleBuilding', { imageUri: uri, puzzleId });
  };

  return (
    <ScrollView contentContainerStyle={styles.galleryContainer}>
      <Text style={styles.title}>Timeless Gallery</Text>
      <Text style={styles.slogan}>Explore the echoes of history, one piece at a time</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search images..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />
      <View style={styles.galleryGrid}>
        {filteredImages.map((image) => (
          <TouchableOpacity key={image.id} style={styles.imageFrame} onPress={() => handleSelectImage(image.uri, image.id)}>
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              onError={(e) => console.error("Error loading image:", e.nativeEvent.error)}
            />
            <Text style={styles.imageText}>{image.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    paddingVertical: 70,
    backgroundColor: '#f5f5dc', // Light beige background for vintage feel
    alignItems: 'flex-start', // Align content to the left side
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3e2723', // Dark brown color for a classic, strong impression
    textAlign: 'left', // Align text to the left
    paddingHorizontal: 20, // Add padding for alignment
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4b392c', // Complementary dark, muted color
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'left', // Align text to the left
    paddingHorizontal: 20, // Add padding for alignment
  },
  searchBar: {
    height: 40,
    backgroundColor: '#e0d7c3', // Warm, muted color for the input
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    width: '90%',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 50,
    fontStyle: 'italic', // Italic for a more vintage look
    borderWidth: 1,
    borderColor: '#8b7d6b', // Subtle border for a more defined edge
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center align the images within the row
    width: '100%', // Full width gallery
  },
  imageFrame: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e0d7c3', // Warm, muted color for the frame
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#8b7d6b', // Dark brown border for a vintage touch
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Adds a bit of depth with shadow
    width: '40%', // Set the width of each frame to 40% of the screen width
    marginHorizontal: '5%', // Horizontally center the frames within the grid
  },
  image: {
    width: '100%',  // Make the image fill the frame
    height: 150,    // Fixed height for all images
    borderRadius: 5,
  },
  imageText: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic', // For vintage elegance
    textAlign: 'center',
    color: '#4b392c', // Dark, muted color for the text
  },
  loadingText: {
    textAlign: 'left',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
    paddingHorizontal: 20,
  }
});

export default ImageGallery;
