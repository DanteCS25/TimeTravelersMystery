import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePage from '../Pages/Home';
import LoginSignup from '../Pages/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import Signup from '../Pages/Signup';
import Profile from '../Pages/Profile';
import Puzzle from '../Pages/Puzzle';
import Time from '../Pages/Time';
import Admin from '../Pages/Admin'; // Adjust the import path as necessary
import AdminLogin from '../Pages/AdminLogin'; // Import the new AdminLogin component
import ImageDisplay from './PuzzleSolving'; // Import the new ImageDisplay component
import LevelSelection from '../Pages/LevelSelection'; // Import the new LevelSelection component
import PuzzleSolving from './PuzzleSolving'; // Import the new PuzzleSolving component
import PuzzleBuilding from '../components/PuzzleBuilding'; // Import the PuzzleBuilding component

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
    return unsubscribe;
  }, []);

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
        initialRouteName="Homepage"
        screenOptions={({ route }) => ({
          tabBarButton: (props) => <CustomTabBarButton {...props} routeName={route.name} />,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Homepage':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Profile':
                iconName = focused ? 'account' : 'account-outline';
                break;
              case 'Puzzle':
                iconName = focused ? 'puzzle' : 'puzzle-outline';
                break;
              case 'Time':
                iconName = focused ? 'clock' : 'clock-outline';
                break;
              default:
                iconName = 'help-circle';
                break;
            }
            return <Icon name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#D2B48C',
          tabBarStyle: styles.tabBar,
          tabBarBackground: () => <View style={styles.transparentBackground} />,
          tabBarShowLabel: false,
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Homepage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Puzzle"
          component={Puzzle}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Time"
          component={Time}
          options={{ headerShown: false }}
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
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Admin"
            component={Admin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ImageDisplay"
            component={ImageDisplay}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LevelSelection"
            component={LevelSelection}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PuzzleSolving"
            component={PuzzleSolving}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PuzzleBuilding"
            component={PuzzleBuilding}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="LoginSignup">
          <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{ headerShown: false }}
          />

          <Stack.Screen
            name="LoginSignup"
            component={LoginSignup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const CustomTabBarButton = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState.selected;
  const translateYValue = new Animated.Value(focused ? -10 : 0);

  useEffect(() => {
    Animated.spring(translateYValue, {
      toValue: focused ? -10 : 0,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <TouchableOpacity
      style={[styles.tabButton]}
      onPress={onPress}
    >
      <Animated.View
        style={[
          focused ? styles.focusedIconContainer : styles.defaultIconContainer,
          { transform: [{ translateY: translateYValue }] },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(95, 75, 50, 0.9)',
    height: 70,
    borderTopWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  transparentBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  focusedIconContainer: {
    backgroundColor: '#D2B48C',
    width: 60,
    height: 60,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  defaultIconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Navbar;
