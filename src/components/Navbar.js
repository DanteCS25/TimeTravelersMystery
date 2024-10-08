import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePage from '../Pages/Homepage';
import LoginSignup from '../Pages/LoginSignup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../Firebase'; // Ensure the correct path to Firebase.js
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import Signup from '../Pages/Signup';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User Logged In... ' + user.email);
        setLoggedIn(true);
      } else {
        console.log('User Not Logged In');
        setLoggedIn(false);
      }
    });

    // Test Firestore connection when the component mounts
    testFirestoreConnection();

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Function to test Firestore connection
  const testFirestoreConnection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
      });
    } catch (error) {
      console.error("Firestore connection error:", error.message);
    }
  };

  function Navigation() {
    return (
      <Tab.Navigator
        initialRouteName="HomePage"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Homepage') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Logout') {
              iconName = 'logout';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#fff',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
        })}
      >
        <Tab.Screen
          name="Homepage"
          component={HomePage}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Logout"
          component={() => (
            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
          options={{
            tabBarButton: (props) => (
              <TouchableOpacity {...props} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen
            name="HomePage"
            component={Navigation}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="LoginSignup">
          <Stack.Screen
            name="LoginSignup"
            component={LoginSignup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#333',
  },
  tabBarLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Navbar;
