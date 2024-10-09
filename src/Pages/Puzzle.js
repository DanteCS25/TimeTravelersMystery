import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const Puzzle = () => {
  const [imageUri, setImageUri] = useState(null);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    // Request permissions to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permissions to access your gallery.');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    // Log the result to check the URI
    console.log("Image Picker Result:", result);

    // If the user didn't cancel the image picker, set the image URI
    if (!result.canceled) {
      console.log("Selected Image URI:", result.assets[0].uri); // Log the selected URI
      setImageUri(result.assets[0].uri); // Update the state with the correct URI
    } else {
      console.log("Image selection was cancelled.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
            <Text style={styles.buttonText}>Select Another Image</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  image: {
    width: '100%', // Ensure width is defined
    height: 300,   // Set a fixed height for testing
    resizeMode: 'contain',
  },
  uploadButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeButton: {
    backgroundColor: '#8B4513',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Add some spacing between the image and the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Puzzle;
