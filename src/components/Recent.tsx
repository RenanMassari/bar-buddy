import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import RecipeCard from './RecipeCard';
import DBHelper from '../recipes/dbHelper'; // Update this path to your DBHelper.ts file

interface RecentProps {
  searchQuery: string;
}

const numColumns = 2;
const cardWidth = (Dimensions.get('window').width * 0.9) / numColumns;

const dbHelper = new DBHelper();

const RecentTab: React.FC<RecentProps> = ({searchQuery = ''}) => {
  const [displayCount, setDisplayCount] = useState(6);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    dbHelper.initDB().then(() => {
      dbHelper
        .getAllRecipes()
        .then(data => {
          setRecipes(data);
          data.forEach(recipe => {
            console.log(recipe);
          });
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

  const navigation = useNavigation();
  const renderItem = ({item}: {item: Recipe}) => (
    <RecipeCard
      title={item.title}
      onPress={() => navigation.navigate('DetailedView', {item})}
      image={item.image}
      cardWidth={cardWidth}
    />
  );

  const loadMoreCocktails = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    alignItems: 'center',
  },
});

export default RecentTab;
