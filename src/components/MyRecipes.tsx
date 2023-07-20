import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import RecipeCard from './RecipeCard';
import DBHelper from '../recipes/dbHelper';

import Recipe from '../classes/Recipe';

interface RecentProps {
  searchQuery: string;
}

const numColumns = 2;
const cardWidth = (Dimensions.get('window').width * 0.9) / numColumns;

const dbHelper = new DBHelper();

const MyRecipesTab: React.FC<RecentProps> = ({searchQuery = ''}) => {
  const [displayCount, setDisplayCount] = useState(6);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    dbHelper.initDB().then(() => {
      dbHelper
        .getAllRecipes()
        .then(data => {
          setRecipes(data);
        })
        .catch(error => console.error('Error fetching recipes:', error));
    });
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    return (
      recipe.title &&
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const deleteRecipe = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this recipe?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await dbHelper.deleteRecipe(id);

            // Remove the deleted recipe from the current state
            setRecipes(recipes.filter(recipe => recipe.id !== id));
          },
          style: 'destructive',
        },
        {
          text: 'No',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const navigation = useNavigation();
  const renderItem = ({item}: {item: Recipe}) => (
    <RecipeCard
      title={item.title}
      onPress={() => navigation.navigate('DetailedView', {item})}
      image={item.image}
      cardWidth={cardWidth}
      onEdit={() => navigation.navigate('AddRecipe', {recipeToEdit: item})}
      onDelete={() => deleteRecipe(item.id)}
    />
  );

  const loadMoreCocktails = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.title}>My Recipes</Text>
        <Icon
          name="plus-circle"
          size={30}
          onPress={() => navigation.navigate('AddRecipe')}
        />
        <Icon
          name="cloud-download-alt"
          size={30}
          onPress={() => navigation.navigate('ImportRecipes')}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredRecipes.slice(0, displayCount)}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        onEndReached={loadMoreCocktails}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    alignItems: 'center',
  },
});

export default MyRecipesTab;
