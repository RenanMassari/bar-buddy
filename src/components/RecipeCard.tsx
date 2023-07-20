import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

type RecipeCardProps = {
  title: string;
  image: string;
  onPress: () => void;
  cardWidth: number;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
};

const CardItem: React.FC<RecipeCardProps> = ({
  title,
  image,
  onPress,
  cardWidth,
  onEdit,
  onDelete,
  onShare,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLongPress = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
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
        <View style={styles.menuContainer}>
          <Menu
            opened={menuOpen}
            onBackdropPress={handleMenuClose}
            style={styles.innerMenu}>
            <MenuTrigger />
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  onEdit();
                  handleMenuClose();
                }}
                text="Edit Recipe"
              />
              <MenuOption
                onSelect={() => {
                  onDelete();
                  handleMenuClose();
                }}
                text="Delete Recipe"
              />
              <MenuOption
                onSelect={() => {
                  onShare();
                  handleMenuClose();
                }}
                text="Share Recipe"
              />
            </MenuOptions>
          </Menu>
        </View>
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
  menuContainer: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  innerMenu: {
    padding: 50,
  },
  menuTrigger: {
    color: '#fff',
  },
});

export default CardItem;
