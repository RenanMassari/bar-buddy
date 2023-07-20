import React, {useEffect, useRef, useState, useCallback} from 'react';

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
  const [instructionStep, setInstructionStep] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [image, setImage] = useState('');

  // Keeps track of which step of the instructions the user is on
  const [step, setStep] = useState(2);
  const instructionsInputRef = useRef();

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

  const addInstructionStep = () => {
    if (editIndex !== null) {
      const updatedInstructions = [...instructions];
      updatedInstructions[editIndex] = instructionStep;
      setInstructions(updatedInstructions);
      setEditIndex(null);
    } else {
      setInstructions([...instructions, instructionStep]);
    }
    setInstructionStep('');
  };

  const editInstructionStep = index => {
    setInstructionStep(instructions[index]);
    setEditIndex(index);
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
    const instructionsString = instructions.join('\n'); // Convert instructions to a string

    dbHelper
      .insertRecipe(
        Date.now(),
        title,
        image,
        ingredientsString,
        instructionsString,
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
        placeholder="Cocktail Name"
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
      <Text>Instructions</Text>
      {instructions.map((instruction, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => editInstructionStep(index)}>
          <Text>
            {index + 1}. {instruction}
          </Text>
        </TouchableOpacity>
      ))}
      <TextInput
        placeholder="Add a step"
        value={instructionStep}
        onChangeText={setInstructionStep}
        style={styles.input}
        onSubmitEditing={addInstructionStep}
        blurOnSubmit={false}
      />
      <Button
        title={'Delete Last Step'}
        onPress={() => setInstructions(instructions.slice(0, -1))}
        disabled={instructions.length === 0}
      />
      <Button title="Add Step" onPress={addInstructionStep} />
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
    minHeight: 40,
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
