import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import recipes from '../recipes/recipes.json';
import RecipeCard from './RecipeCard';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string | null;
  ingredients: [];
  instructions: string;
  glass: string;
  garnish: string;
  category: string | null;
  alcohol: string | null;
}

interface RecentProps {
  searchQuery: string;
}

const numColumns = 2;
const cardWidth = (Dimensions.get('window').width * 0.9) / numColumns;

const RecentTab: React.FC<RecentProps> = ({searchQuery = ''}) => {
  const filteredRecipes = recipes.filter(recipe => {
    console.log(`Recipe: `, recipe.title);
    return (
      recipe.title &&
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const renderItem = ({item}: {item: Recipe}) => (
    <RecipeCard
      title={item.title}
      onPress={() => console.log(`Navigating to details of ${item.title}`)}
      image={item.image}
      cardWidth={cardWidth}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredRecipes}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
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
