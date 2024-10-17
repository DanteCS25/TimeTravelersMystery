import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView } from 'react-native';
import { fetchImages } from '../../server'; // Assuming this function is correctly set up

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const fetchedImages = await fetchImages(); // Fetch the images from Firestore
        console.log("Fetched images in component:", fetchedImages); // Log fetched images
        if (fetchedImages.length > 0) {
          setImages(fetchedImages); // Only set images if we have data
        } else {
          console.log("No images fetched");
        }
      } catch (error) {
        console.error("Error fetching images:", error.message);
      }
    };

    getImages();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.galleryContainer}>
      <View style={styles.galleryGrid}>
        {images.length > 0 ? (
          images.map((image) => {
            console.log("Rendering image with uri:", image.uri); // Debugging URI
            return (
              <View key={image.id} style={styles.imageFrame}>
                <Image
                  source={{ uri: image.uri }} // Directly use the uri from Firestore
                  style={styles.image}
                  onError={(e) => console.error("Error loading image:", e.nativeEvent.error)}
                />
                <Text style={styles.imageText}>{image.name}</Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.loadingText}>No images available or fetching...</Text> // Display if no images
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    paddingVertical: 20,
    backgroundColor: '#f5f5dc', // Light beige background for vintage feel
    alignItems: 'center', // Center all content horizontally
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
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  }
});

export default ImageGallery;
