import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, FlatList, Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = ({ data, renderItem, autoplay = false, autoplayInterval = 3000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoplay) {
      const intervalId = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }, autoplayInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [autoplay, autoplayInterval, activeIndex, data.length]);

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item, index) => `carousel-item-${index}`}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    height: 250,
  },
});

export default Carousel;
