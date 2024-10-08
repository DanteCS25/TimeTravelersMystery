import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../../Firebase"; // Ensure correct path to Firebase
import { handleLogin } from "../../server";

function LoginSignup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignin = async () => {
    try {
      await handleLogin(email, password);
      console.log("User signed in");
      // Optionally navigate to another screen after login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Traveler's Mystery</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a0a0a0"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a0a0a0"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Go to Sign Up</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5DC', // Beige background for a vintage feel
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A403A', // Darker shade for a vintage look
    marginBottom: 20,
    fontFamily: 'serif', // Using serif for an antique aesthetic
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderColor: '#4A403A', // Matching the theme color
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontFamily: 'serif', // Using serif font for inputs as well
  },
  button: {
    backgroundColor: '#4A403A', // Dark brown for buttons
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'serif',
  },
  link: {
    marginTop: 15,
  },
  linkText: {
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

export default LoginSignup;
