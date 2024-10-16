import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import Carousel from '../components/Carousel';
import PuzzleNr1 from '../../assets/PuzzleNr1.png'; 
import PuzzleNr2 from '../../assets/PuzzleNr2.png'; 

const { width } = Dimensions.get('window');

const movies = [
  {
    title: 'Puzzle',
    image: PuzzleNr1,
    description: 'A psychological thriller directed by Todd Phillips.',
  },
  {
    title: 'Puzzle',
    image: PuzzleNr2,
    description: 'The ultimate superhero movie experience.',
  },
  {
    title: 'Puzzle',
    image: PuzzleNr1,
    description: 'A psychological thriller directed by Todd Phillips.',
  },
  {
    title: 'Puzzle',
    image: PuzzleNr2,
    description: 'The ultimate superhero movie experience.',
  },
];

const Homepage = ({ navigation }) => {
  const user = auth.currentUser;
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.movieImage} />
      <Text style={styles.movieTitle}>{item.title}</Text>
      <Text style={styles.movieDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{userName ? `Welcome back, ${userName}` : "Guest"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="account" size={30} color="#4A403A" />
        </TouchableOpacity>
      </View>
      <Carousel
        data={movies}
        renderItem={renderCarouselItem}
        autoplay={true}
        autoplayInterval={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
    padding: 30,
    paddingTop: 50,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  userName: {
    fontSize: 18,
    color: '#4A403A',
    fontFamily: 'serif',
  },
  carouselItem: {
    width: width * 0.50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  movieImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A403A',
    marginTop: 10,
  },
  movieDescription: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 5,
  },
});

export default Homepage;
