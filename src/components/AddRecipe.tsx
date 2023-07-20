import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {
  ScrollView,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import DBHelper from '../recipes/dbHelper';

const AddRecipe = ({navigation, route}) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [garnish, setGarnish] = useState('');
  const [category, setCategory] = useState('');
  const [alcohol, setAlcohol] = useState('');

  const ingredientsRef = useRef(ingredients);

  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.newIngredient) {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          route.params.newIngredient,
        ]);
        navigation.setParams({newIngredient: undefined});
      } else if (route.params?.updatedIngredient !== undefined) {
        setIngredients(prevIngredients => {
          const newIngredients = [...prevIngredients];
          newIngredients[route.params.index] = route.params.updatedIngredient;
          return newIngredients;
        });
        navigation.setParams({updatedIngredient: undefined, index: undefined});
      }
    });

    return unsubscribe;
  }, [
    navigation,
    route.params?.newIngredient,
    route.params?.updatedIngredient,
  ]);

  const handleAddIngredient = () => {
    navigation.navigate('AddIngredient');
  };

  const handleEditIngredient = (ingredient, index) => {
    navigation.navigate('AddIngredient', {ingredient, index});
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async () => {
    const dbHelper = new DBHelper();
    await dbHelper.initDB();

    const ingredientsString = JSON.stringify(ingredients);

    dbHelper
      .insertRecipe(
        Date.now(),
        title,
        instructions, // Assume this as description
        '', // Assume no image
        ingredientsString,
        instructions,
        garnish,
        garnish,
        category,
        alcohol,
      )
      .then(() => {
        navigation.goBack();
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Text>Ingredients</Text>
      <View style={styles.ingredientContainer}>
        {ingredients.map((ingredient, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleEditIngredient(ingredient, index)}>
            <Text style={styles.ingredient}>
              {`${ingredient.name} ${ingredient.quantity} ${ingredient.unit}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Add Ingredient" onPress={handleAddIngredient} />
      <TextInput
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        style={styles.input}
      />
      <TextInput
        placeholder="Garnish"
        value={garnish}
        onChangeText={setGarnish}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <TextInput
        placeholder="Alcohol"
        value={alcohol}
        onChangeText={setAlcohol}
        style={styles.input}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
  },
  ingredientContainer: {
    marginBottom: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  ingredient: {
    // padding: 10,
    backgroundColor: '#f0f0f0',
    // marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddRecipe;
