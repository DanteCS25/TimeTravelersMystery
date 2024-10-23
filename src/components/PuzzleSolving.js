import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import SharedBackground from './SharedBackground';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addFavoritePuzzle } from '../../server';

const gridSize = 3;
const puzzleBoardSize = 300;
const pieceSize = puzzleBoardSize / gridSize;

const ImageDisplay = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri, puzzleName } = route.params;
  const [pieces, setPieces] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const createPuzzlePieces = () => {
    const puzzlePieces = [];

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const piece = {
          key: `${row}-${col}`,
          correctX: col * pieceSize,
          correctY: row * pieceSize,
          isPlaced: false,
        };
        puzzlePieces.push(piece);
      }
    }

    setPieces(shuffleArray(puzzlePieces));
  };

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    createPuzzlePieces();
  }, []);

  const handleFavoritePress = async () => {
    try {
      await addFavoritePuzzle(imageUri, puzzleName);
      setIsFavorited(!isFavorited);
      Alert.alert('Success', isFavorited ? 'Puzzle removed from favorites!' : 'Puzzle added to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  const selectPiece = (piece) => {
    console.log('Selected piece:', piece);
    setSelectedPiece(piece);
  };

  const placePiece = (blockKey) => {
    if (!selectedPiece) {
      Alert.alert('Select a piece first');
      return;
    }

    console.log('Attempting to place piece:', selectedPiece, 'at block:', blockKey);

    if (selectedPiece.key === blockKey) {
      console.log('Piece is being placed at the correct block:', blockKey);

      setPieces((prevPieces) => {
        const updatedPieces = prevPieces.map((p) =>
          p.key === selectedPiece.key ? { ...p, isPlaced: true } : p
        );
        console.log('Updated pieces:', updatedPieces);
        return updatedPieces;
      });

      setSelectedPiece(null);
      Alert.alert('Success', 'Piece placed successfully!');
    } else {
      console.log('Mismatch in keys: ', selectedPiece.key, 'and block key:', blockKey);
      Alert.alert('Incorrect placement', 'This piece does not fit here.');
    }
  };

  useEffect(() => {
    console.log('Pieces state updated:', pieces);
  }, [pieces]);

  return (
    <SharedBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>Start Solving</Text>
            </View>

            <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
              <Icon 
                name={isFavorited ? 'heart' : 'heart-outline'} 
                size={30} 
                color={isFavorited ? '#3e2723' : '#3e2723'}
              />
              <Text style={styles.favoriteText}>{isFavorited ? 'Favorited' : 'Add to Favorites'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.puzzleBoard}>
            {[...Array(gridSize)].map((_, row) =>
              [...Array(gridSize)].map((_, col) => (
                <TouchableOpacity
                  key={`${row}-${col}`}
                  style={[
                    styles.puzzlePiece,
                    {
                      top: row * pieceSize,
                      left: col * pieceSize,
                      width: pieceSize,
                      height: pieceSize,
                    },
                  ]}
                  onPress={() => placePiece(`${row}-${col}`)}
                >
                  {pieces
                    .filter((piece) => piece.isPlaced && piece.key === `${row}-${col}`)
                    .map((piece) => (
                      <ImageBackground
                        key={piece.key}
                        source={{ uri: imageUri }}
                        style={styles.imageBackground}
                        imageStyle={{
                          width: puzzleBoardSize,
                          height: puzzleBoardSize,
                          top: -piece.correctY,
                          left: -piece.correctX,
                        }}
                        resizeMode="cover"
                      />
                    ))}
                </TouchableOpacity>
              ))
            )}
          </View>

          <View style={styles.pieceContainer}>
            {pieces
              .filter((piece) => !piece.isPlaced)
              .map((piece) => (
                <TouchableOpacity
                  key={piece.key}
                  style={styles.puzzlePieceBottom}
                  onPress={() => selectPiece(piece)}
                >
                  <ImageBackground
                    source={{ uri: imageUri }}
                    style={{
                      width: pieceSize,
                      height: pieceSize,
                    }}
                    imageStyle={{
                      width: puzzleBoardSize,
                      height: puzzleBoardSize,
                      top: -piece.correctY,
                      left: -piece.correctX,
                    }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>
    </SharedBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0EAD6',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'serif',
  },
  puzzleBoard: {
    width: puzzleBoardSize,
    height: puzzleBoardSize,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#C0A080',
    alignSelf: 'center',
  },
  puzzlePiece: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#C0A080',
  },
  pieceContainer: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  puzzlePieceBottom: {
    width: pieceSize,
    height: pieceSize,
    margin: 5,
    borderWidth: 1,
    borderColor: '#D4AF37',
    overflow: 'hidden',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FDF5E6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 3,
    marginBottom: 30,
  },
  favoriteText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3e2723',
    fontFamily: 'serif',
  },
  imageBackground: {
    width: pieceSize,
    height: pieceSize,
  },
});

export default ImageDisplay;
