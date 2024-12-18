import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Alert, ScrollView, Pressable, Linking, ActivityIndicator } from 'react-native';
import SharedBackground from './SharedBackground';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { analyzeImage } from '../services/AI-service';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';
import axios from 'axios';
import { addFavoritePuzzle, saveCompletedPuzzle } from '../../server';
import auth from '@react-native-firebase/auth';

// Grid size will be determined dynamically based on level
let gridSize = 3;

const puzzleBoardSize = 300;
// pieceSize will be recalculated after gridSize is set
const Level = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};
let pieceSize;

const PuzzleSolving = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { imageUri, level } = route.params;

  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [webDetectionData, setWebDetectionData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const viewShotRef = useRef(null);

  // Add a new state variable to track if the puzzle is complete
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);

  useEffect(() => {
    if (level === Level.EASY) {
      gridSize = 3;
    } else if (level === Level.MEDIUM) {
      gridSize = 4;
    } else if (level === Level.HARD) {
      gridSize = 5;
    }
    pieceSize = puzzleBoardSize / gridSize;

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
  }, [level]);

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
        const updatedPieces = prevPieces.map((piece) =>
          piece.key === selectedPiece.key ? { ...piece, isPlaced: true } : piece
        );

        // Check if all pieces are placed
        const allPlaced = updatedPieces.every(piece => piece.isPlaced);
        if (allPlaced) {
          Alert.alert('Success', 'All pieces placed! You can now save your puzzle.');
          setIsPuzzleComplete(true); // Update the state to indicate the puzzle is complete
        }

        return updatedPieces;
      });
      setSelectedPiece(null);
    } else {
      Alert.alert('Incorrect Placement', 'This piece does not fit here');
    }
  };

  const fetchWikipediaSummary = async (query) => {
    if (!query) {
      return null;
    }
    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      );
      if (response.data && response.data.extract) {
        return response.data.extract;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`No Wikipedia page found for: ${query}`);
      } else {
        console.error('Error fetching Wikipedia summary:', error);
      }
    }
    return null;
  };

  const handleAnalysePuzzle = async () => {
    if (!viewShotRef.current) {
      Alert.alert('Error', 'Could not capture the puzzle image for analysis');
      return;
    }

    setIsAnalyzing(true);
    try {
      const solvedImageUri = await viewShotRef.current.capture();
      if (solvedImageUri) {
        const base64ImageData = await FileSystem.readAsStringAsync(solvedImageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const result = await analyzeImage(base64ImageData);
        if (result?.webEntities) {
          for (let entity of result.webEntities) {
            if (entity.description) {
              const summary = await fetchWikipediaSummary(entity.description);
              if (summary) {
                entity.metadata = { summary };
              }
            }
          }
        }
        setWebDetectionData(result);
        console.log(result);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error?.message || error.message || 'Failed to analyze the image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddFavorite = async () => {
    try {
      await addFavoritePuzzle(imageUri, 'My Puzzle'); // Provide a puzzle name
      Alert.alert('Success', 'Puzzle added to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to favorites');
    }
  };

  const handleSaveCompletedPuzzle = async () => {
    try {
      await saveCompletedPuzzle(imageUri, 'My Puzzle'); // Provide a puzzle name
      Alert.alert('Success', 'Puzzle added to completed puzzles!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add to completed puzzles');
    }
  };

  return (
    <SharedBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={30} color="#8B4513" />
          </TouchableOpacity>
          <Text style={styles.title}>Start Solving</Text>
          <TouchableOpacity onPress={handleAddFavorite}>
            <Icon name="heart" size={30} color="#FF6347" />
          </TouchableOpacity>
        </View>

        {/* Step-by-Step Guide */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Build the Puzzle:</Text>
          <Text style={styles.instructionsText}>1. Select a puzzle piece from the options below.</Text>
          <Text style={styles.instructionsText}>2. Tap on the desired block to place the selected piece.</Text>
          <Text style={styles.instructionsText}>3. Repeat until all pieces are placed in the correct positions.</Text>
        </View>

        <Pressable onPress={handleAnalysePuzzle} style={styles.analyzeButton} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analyze Puzzle</Text>
          )}
        </Pressable>

        {webDetectionData && webDetectionData.webEntities && (
          <View style={styles.webDetectionContainer}>
            <Text style={styles.labelTitle}>Detected Entities:</Text>
            {webDetectionData.webEntities.map((entity, index) => (
              <View key={index} style={styles.entityContainer}>
                <Text style={styles.label}>{entity.description}</Text>
                {entity.metadata && entity.metadata.summary && (
                  <Text style={styles.summary}>{entity.metadata.summary}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Puzzle Board */}
        <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
          <View style={[styles.puzzleBoard, { width: puzzleBoardSize, height: puzzleBoardSize }]}>
            {pieces.map((piece) => (
              <TouchableOpacity
                key={piece.key}
                style={[
                  styles.puzzlePiece,
                  {
                    top: piece.correctY,
                    left: piece.correctX,
                    width: pieceSize,
                    height: pieceSize,
                  },
                ]}
                onPress={() => placePiece(piece.key)}
              >
                {piece.isPlaced && (
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
            ))}
          </View>
        </ViewShot>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveCompletedPuzzle}
          disabled={!isPuzzleComplete} // Disable the button if the puzzle is not complete
        >
          <Text style={styles.saveButtonText}>Save Completed Puzzle</Text>
        </TouchableOpacity>

        <View style={styles.pieceContainer}>
          {pieces
            .filter((piece) => !piece.isPlaced)
            .map((piece) => (
              <TouchableOpacity
                key={piece.key}
                style={[
                  styles.puzzlePieceBottom,
                  selectedPiece?.key === piece.key ? styles.selectedPiece : null,
                  {
                    width: pieceSize,
                    height: pieceSize,
                  },
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
    backgroundColor: '#F5F5DC',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B4513',
    fontFamily: 'serif',
  },
  instructionsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFF8DC',
    borderRadius: 5,
    paddingVertical: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 5,
    fontFamily: 'serif',
  },
  instructionsText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  puzzleBoard: {
    marginTop: 20,
    position: 'relative',
    borderWidth: 5,
    borderColor: '#C0A080',
  },
  puzzlePiece: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#C0A080',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pieceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  puzzlePieceBottom: {
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
  },
  image: {
    width: '100%',
    height: '100%',
  },
  analyzeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#8B4513',
    borderRadius: 5,
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  webDetectionContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  labelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#8B4513',
    fontFamily: 'serif',
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  summary: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  entityContainer: {
    marginBottom: 15,
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#8B4513',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PuzzleSolving;
