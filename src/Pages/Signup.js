import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ImageBackground, SafeAreaView } from "react-native";
import { handleSignup } from "../../server";
import SharedBackground from '../components/SharedBackground';

function Signup({ navigation }) {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    if (name === "" || email === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await handleSignup(name, email, password); 
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('HomePage'); 
      setError(null); 
    } catch (error) {
      setError("Signup failed. Please try again.");
      console.error('Error during signup:', error.message); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/SignBackground.png')} style={styles.backgroundImage}>
        <SharedBackground isSignup={true}>
          <Text style={styles.title}>Create an Account</Text>
          <View style={styles.InputsContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#E5D3B3"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#E5D3B3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#E5D3B3"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate('LoginSignup')}
          >
            <Text style={styles.linkText}>Go to Login</Text>
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </SharedBackground>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    padding: 20,
  },
  InputsContainer: {
    marginBottom: '10%',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A403A',
    marginBottom: '20%',
    fontFamily: 'serif',
    marginLeft: '5%',
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

export default Signup;
