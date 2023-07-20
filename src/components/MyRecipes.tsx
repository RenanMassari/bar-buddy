import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
} from 'react-native';

import DocumentPicker from 'react-native-document-picker';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import RecipeCard from './RecipeCard';
import DBHelper from '../recipes/dbHelper';

import Recipe from '../classes/Recipe';

import RNFS from 'react-native-fs';

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

  // To refresh recipes whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchRecipes = async () => {
        dbHelper
          .getAllRecipes()
          .then(data => {
            setRecipes(data);
          })
          .catch(error => console.error('Error fetching recipes:', error));
      };

      fetchRecipes();
    }, []),
  );

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

  const onShare = async (item: Recipe) => {
    console.log('Sharing recipe:', item);
    try {
      const result = await Share.share({
        message: JSON.stringify(item),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of', result.activityType);
        } else {
          console.log('shared');
        }
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const navigation = useNavigation();
  const renderItem = ({item}: {item: Recipe}) => (
    <RecipeCard
      title={item.title}
      onPress={() => navigation.navigate('DetailedView', {item})}
      image={item.image}
      cardWidth={cardWidth}
      onEdit={() => {
        console.log('Editing recipe: ', item);
        navigation.navigate('AddRecipe', {recipeToEdit: item});
      }}
      onDelete={() => deleteRecipe(item.id)}
      onShare={() => {
        onShare(item).then(() => {
          console.log('Shared');
        });
      }}
    />
  );

  const loadMoreCocktails = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  // Insert the recipes to the database
  const insertRecipesToDB = async (recipes: Recipe[]) => {
    try {
      await dbHelper.initDB();
      for (const recipe of recipes) {
        // Check if the recipe has all the required fields
        if (
          !recipe ||
          !recipe.instructions ||
          !recipe.title ||
          !recipe.image ||
          !recipe.ingredients
        ) {
          console.log(`Recipe ${recipe.title} is missing some fields}`);
          continue;
        }
        await dbHelper.insertRecipe(
          Date.now(),
          recipe.title,
          recipe.image,
          JSON.stringify(recipe.ingredients),
          recipe.instructions.join('\n'),
        );
      }
      const data = await dbHelper.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error inserting recipes:', error);
    }
  };

  // Import recipes from file and insert to database
  const importRecipes = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: 'application/json',
      });

      // Read the file
      const fileContent = await RNFS.readFile(response[0].uri, 'utf8');

      // Parse it as JSON
      const jsonContent = JSON.parse(fileContent);

      // Insert the recipes to the database
      await insertRecipesToDB(jsonContent);
    } catch (err) {
      console.log(err);
    }
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
        <Icon name="cloud-download-alt" size={30} onPress={importRecipes} />
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
