import React, { useState } from "react";
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { auth } from "../../Firebase";
import { handleLogin } from "../../server";

function LoginSignup({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignin = async () => {
    try {
      await handleLogin(email, password);
      console.log("User signed in");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ImageBackground source={require('../../assets/SignBackground.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Time Traveler's Mystery</Text>
        <View style={styles.InputsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#E5D3B3"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#E5D3B3"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => {
          console.log("Navigating to Signup");
          navigation.navigate('Signup');
        }}>
          <Text style={styles.linkText}>Go to Sign Up</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
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
    padding: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A403A',
    marginBottom: '20%',
    fontFamily: 'serif',
    marginLeft: '5%',
  },
  InputsContainer: {
    marginBottom: '10%'
  },
  input: {
    width: '80%',
    padding: 12,
    marginBottom: 15,
    marginLeft: '5%',
    borderColor: '#4A403A',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#5B3A2980',
    fontFamily: 'serif',
  },
  button: {
    backgroundColor: '#4A403A',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: '5%',
    width: '80%',
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
    marginLeft: '5%',
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
