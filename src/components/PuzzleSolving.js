import React, { useState, useEffect } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import SharedBackground from './SharedBackground';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const gridSize = 3;
const puzzleBoardSize = 300;
const pieceSize = puzzleBoardSize / gridSize;

const ImageDisplay = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri } = route.params;

  // State for all pieces and selected piece
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    const initPieces = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        initPieces.push({
          key: `${row}-${col}`,
          correctX: col * pieceSize,
          correctY: row * pieceSize,
          isPlaced: false,
        });
      }
    }
    setPieces(shuffleArray(initPieces)); // Shuffle pieces initially
  }, []);

  // Fisher-Yates Shuffle Algorithm to shuffle the pieces
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Handle selecting a piece from the container
  const selectPiece = (piece) => {
    if (piece.isPlaced) return; // Cannot select a piece that has already been placed
    setSelectedPiece(piece);
  };

  // Handle placing a piece on the board
  const placePiece = (blockKey) => {
    if (!selectedPiece) {
      Alert.alert('Select a piece first');
      return;
    }

    // Check if the selected piece's key matches the block's key
    if (selectedPiece.key === blockKey) {
      // Correct placement
      setPieces((prevPieces) => {
        return prevPieces.map((piece) =>
          piece.key === selectedPiece.key ? { ...piece, isPlaced: true } : piece
        );
      });
      setSelectedPiece(null);
    } else {
      Alert.alert('Incorrect Placement', 'This piece does not fit here');
    }
  };

  return (
    <SharedBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Start Solving</Text>
        </View>

        {/* Puzzle Board */}
        <View style={styles.puzzleBoard}>
          {[...Array(gridSize)].map((_, row) =>
            [...Array(gridSize)].map((_, col) => {
              const blockKey = `${row}-${col}`;
              const piece = pieces.find((p) => p.key === blockKey);
              return (
                <TouchableOpacity
                  key={blockKey}
                  style={[
                    styles.puzzlePiece,
                    {
                      top: row * pieceSize,
                      left: col * pieceSize,
                    },
                  ]}
                  onPress={() => placePiece(blockKey)}
                >
                  {/* Only render the piece if it is defined and placed */}
                  {piece && piece.isPlaced && (
                    <ImageBackground
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
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Pieces Container */}
        <View style={styles.pieceContainer}>
          {pieces
            .filter((piece) => !piece.isPlaced)
            .map((piece) => (
              <TouchableOpacity
                key={piece.key}
                style={[
                  styles.puzzlePieceBottom,
                  selectedPiece?.key === piece.key ? styles.selectedPiece : null,
                ]}
                onPress={() => selectPiece(piece)}
              >
                <ImageBackground
                  source={{ uri: imageUri }}
                  style={styles.image}
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
      </ScrollView>
    </SharedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EAD6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 70,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  puzzleBoard: {
    width: puzzleBoardSize,
    height: puzzleBoardSize,
    marginTop: 20,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#C0A080',
    alignSelf: 'center',
  },
  puzzlePiece: {
    position: 'absolute',
    width: pieceSize,
    height: pieceSize,
    borderWidth: 1,
    borderColor: '#C0A080',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pieceContainer: {
    width: '100%',
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
  selectedPiece: {
    borderColor: '#FF6347',
    borderWidth: 2,
  },
  imageBackground: {
    position: 'absolute',
    width: pieceSize,
    height: pieceSize,
  },
  image: {
    width: pieceSize,
    height: pieceSize,
  },
});

export default ImageDisplay;
