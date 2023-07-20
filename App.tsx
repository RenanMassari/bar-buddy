import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import {MenuProvider} from 'react-native-popup-menu';

import recipes from './src/recipes/recipes.json';
import DBHelper from './src/recipes/dbHelper';

import Recent from './src/components/Recent';
import MyRecipes from './src/components/MyRecipes';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DetailedView from './src/components/DetailedView';
import AddRecipe from './src/components/AddRecipe';
import AddIngredient from './src/components/AddIngredient';

const Stack = createStackNavigator();

const dbHelper = new DBHelper();
dbHelper
  .initDB()
  .then(() => {
    console.log('Database initialized');

    // Insert initial recipes from JSON to database
    recipes.forEach(recipe => {
      dbHelper
        .insertRecipe(
          recipe.id,
          recipe.title,
          recipe.image,
          JSON.stringify(recipe.ingredients), // Convert ingredients array to string
          recipe.instructions.join('\n'),
        )
        .then(() => console.log(`Recipe ${recipe.title} inserted`))
        .catch(error =>
          console.error(`Error inserting recipe ${recipe.title}:`, error),
        );
    });
  })
  .catch(error => {
    console.error('Error initializing database:', error);
  });

const App = () => {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={MainApp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DetailedView"
            component={DetailedView}
            options={{title: 'Cocktail Details'}}
          />
          <Stack.Screen
            name="AddRecipe"
            component={AddRecipe}
            options={{title: 'Add Recipe'}}
          />
          <Stack.Screen
            name="mportRecipes"
            component={AddRecipe}
            options={{title: 'Add Recipe'}}
          />
          <Stack.Screen
            name="AddIngredient"
            component={AddIngredient}
            options={{title: 'Add Ingredient'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

const MainApp = () => {
  const [activeHeader, setActiveHeader] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeHeader) {
      case 0:
        return <MyRecipes searchQuery={searchQuery} />;
      case 1:
        return <Recent searchQuery={searchQuery} />;
      case 2:
        return <Text>Favourites</Text>;
      case 3:
        return (
          <>
            <Text>Training</Text>
            <Image source={require('./src/assets/placeholder_training.png')} />
          </>
        );
      default:
        return <Text>Content 1</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          key={'logo'}
          onPress={() => setActiveHeader(0)}
          style={styles.logoAndTitle}>
          <Text style={styles.title}>BarBuddy</Text>
          <Image source={require('./src/assets/logo.png')} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search..."
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearIcon}>
              <Text style={styles.clearText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.headerContainer}>
          {['My Recipes', 'Recent', 'Favourites', 'Training'].map(
            (header, index) => (
              <TouchableOpacity
                key={header}
                style={styles.header}
                onPress={() => setActiveHeader(index)}>
                <Text
                  style={
                    activeHeader === index
                      ? styles.activeHeaderText
                      : styles.headerText
                  }>
                  {header}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>
        <View style={styles.contentContainer}>{renderContent()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  logoAndTitle: {
    display: 'flex',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
  },
  searchBox: {
    flex: 1,
    paddingHorizontal: 10,
  },
  clearIcon: {
    paddingHorizontal: 10,
  },
  clearText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  bottomSection: {
    flex: 0.7,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
  },
  activeHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
