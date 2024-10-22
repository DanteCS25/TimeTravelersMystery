// PuzzleBuilding.js
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const PuzzleBuilding = () => {
  const route = useRoute();
  const { imageUri } = route.params;

  useEffect(() => {
    let puzzleImage = new Image();
    puzzleImage.src = imageUri;
    puzzleImage.onload = () => {
      const puzzleCanvas = new headbreaker.Canvas('puzzle-canvas', {
        width: 800, height: 650, pieceSize: 60,
        image: puzzleImage, strokeWidth: 2.5, strokeColor: '#F0F0F0',
        outline: new headbreaker.outline.Rounded()
      });

      puzzleCanvas.adjustImagesToPuzzleWidth();
      puzzleCanvas.autogenerate({
        horizontalPiecesCount: 6,
        verticalPiecesCount: 7,
        insertsGenerator: headbreaker.generators.random
      });

      puzzleCanvas.registerKeyboardGestures();
      puzzleCanvas.draw();

      registerButtons('puzzle', puzzleCanvas);
    };
  }, [imageUri]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Loading Puzzle...</Text>
      {/* Add a canvas element or similar depending on your setup */}
    </View>
  );
};

export default PuzzleBuilding;
