import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';

type RecipeCardProps = {
  title: string;
  image: string;
  onPress: () => void;
  cardWidth: number;
  onEdit: () => void;
  onDelete: () => void;
};

const CardItem: React.FC<RecipeCardProps> = ({
  title,
  image,
  onPress,
  cardWidth,
  onEdit,
  onDelete,
}) => {
  const handleLongPress = () => {
    Alert.alert(
      'Edit or Delete Recipe',
      '',
      [
        {
          text: 'Edit Recipe',
          onPress: onEdit,
        },
        {
          text: 'Delete Recipe',
          onPress: onDelete,
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {width: cardWidth - 10, height: cardWidth - 10},
      ]}
      onPress={onPress}
      onLongPress={handleLongPress}>
      <ImageBackground source={{uri: image}} style={styles.card}>
        <Text style={styles.cardText}>{title}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
});

export default CardItem;
