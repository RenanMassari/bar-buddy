import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

type RecipeCardProps = {
  title: string;
  onPress: () => void;
  cardWidth: number;
};

const CardItem: React.FC<RecipeCardProps> = ({title, onPress, cardWidth}) => {
  return (
    <TouchableOpacity
      style={[styles.card, {width: cardWidth - 10, height: cardWidth - 10}]}
      onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    margin: 5,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CardItem;
