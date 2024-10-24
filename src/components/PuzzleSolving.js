// PuzzleSolving.js
import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Alert, ScrollView, Pressable } from 'react-native';
import SharedBackground from './SharedBackground';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { analyzeImage } from '../services/AI-service';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';

const gridSize = 3;
const puzzleBoardSize = 300;
const pieceSize = puzzleBoardSize / gridSize;

const ImageDisplay = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri } = route.params;

  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [labels, setLabels] = useState([]);
  const viewShotRef = useRef(null);

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
    setPieces(shuffleArray(initPieces)); 
  }, []);

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const selectPiece = (piece) => {
    if (piece.isPlaced) return; 
    setSelectedPiece(piece);
  };

  const placePiece = (blockKey) => {
    if (!selectedPiece) {
      Alert.alert('Select a piece first');
      return;
    }

    if (selectedPiece.key === blockKey) {
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

  const handleSaveSolvedPuzzle = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      return uri;
    } catch (error) {
      Alert.alert('Error', 'Failed to save the solved puzzle');
      throw error;
    }
  };

  const handleAnalysePuzzle = async () => {
    try {
      const solvedImageUri = await handleSaveSolvedPuzzle();
      if (solvedImageUri) {
        const base64ImageData = await FileSystem.readAsStringAsync(solvedImageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const result = await analyzeImage(base64ImageData);
        setLabels(result);
        console.log(result);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error?.message || error.message || 'Failed to analyze the image');
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

        <Pressable onPress={handleAnalysePuzzle} style={styles.analyzeButton}>
          <Text style={styles.analyzeButtonText}>Analyze Puzzle</Text>
        </Pressable>

        <View style={styles.labelContainer}>
          {labels.length > 0 && (
            <View>
              <Text style={styles.labelTitle}>Labels found:</Text>
              {labels.map((label, index) => (
                <Text key={index} style={styles.label}>
                  {label.description}
                </Text>
              ))}
            </View>
          )}
        </View>

        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
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
        </ViewShot>

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
  analyzeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labelContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  labelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
});

export default ImageDisplay;
