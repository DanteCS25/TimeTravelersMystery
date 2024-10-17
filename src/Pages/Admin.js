import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToFirestore } from '../../server'; // Make sure this function is correctly imported

const Admin = () => {
  const [imageUri, setImageUri] = useState(null);
  const [customName, setCustomName] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need permissions to access your gallery.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!customName) {
      Alert.alert('Error', 'Please enter a custom name for the image.');
      return;
    }
    await uploadImageToFirestore(imageUri, customName); // Upload image to Firestore
    Alert.alert('Success', 'Image uploaded and saved to Firestore successfully!');
    setImageUri(null); // Clear the selected image after upload
    setCustomName(''); // Clear the custom name input after upload
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image from Gallery" onPress={pickImage} />
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TextInput
            style={styles.input}
            placeholder="Enter custom name"
            value={customName}
            onChangeText={setCustomName}
          />
          <Button title="Upload Image" onPress={handleUpload} disabled={!imageUri} />
        </>
      ) : (
        <View style={styles.placeholder}>
          <Button title="Select Image" onPress={pickImage} />
        </View>
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
  placeholder: {
    width: 300,
    height: 300,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Admin;
