import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { handleSignup } from "../../server"; // Import the handleSignup function

function Signup({ navigation }) {
  const [name, setName] = useState(""); // New state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    if (name === "" || email === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await handleSignup(name, email, password); // Pass name to the server function
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('HomePage'); // Navigate to HomePage after signup
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error('Error during signup:', error.message); // Additional logging
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#a0a0a0"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a0a0a0"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a0a0a0"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('LoginSignup')}
      >
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5dc', // Beige background for consistency
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A403A', // Darker vintage color
    marginBottom: 20,
    fontFamily: 'serif',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderColor: '#4A403A', // Matching the vintage theme
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontFamily: 'serif',
  },
  button: {
    backgroundColor: '#4A403A', // Dark brown for buttons
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'serif',
  },
  backButtonText: {
    marginTop: 15,

    color: '#4A403A',
    fontSize: 16,
    fontFamily: 'serif',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#D9534F',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'serif',
  },
});

export default Signup;
