import React, {useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DBHelper from '../recipes/dbHelper';
import DocumentPicker from 'react-native-document-picker';
import Recipe from '../classes/Recipe';

type RootStackParamList = {
  Home: undefined;
  AddRecipe: {
    newIngredient?: string;
    updatedIngredient?: string;
    index?: number;
    recipeToEdit?: Recipe;
  };
};

type AddRecipeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddRecipe'
>;
type AddRecipeScreenRouteProp = RouteProp<RootStackParamList, 'AddRecipe'>;

type Props = {
  navigation: AddRecipeScreenNavigationProp;
  route: AddRecipeScreenRouteProp;
};

const AddRecipe = ({navigation, route}: Props) => {
  // initialize state using route.params.recipeToEdit if it exists
  const [title, setTitle] = useState(route.params?.recipeToEdit?.title || '');
  const [ingredients, setIngredients] = useState(
    route.params?.recipeToEdit?.ingredients
      ? JSON.parse(route.params?.recipeToEdit?.ingredients)
      : [],
  );

  const [instructions, setInstructions] = useState(
    route.params?.recipeToEdit?.instructions.split('\n') || [],
  );
  const [imageUri, setImageUri] = useState(
    route.params?.recipeToEdit?.image || '',
  );

  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | undefined>(
    route.params?.recipeToEdit,
  );

  const [instructionStep, setInstructionStep] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (route.params?.newIngredient) {
        setIngredients(prevIngredients => {
          if (route.params.newIngredient) {
            return [...prevIngredients, route.params.newIngredient];
          }
          return prevIngredients;
        });
        navigation.setParams({newIngredient: undefined});
      } else if (route.params?.updatedIngredient !== undefined) {
        setIngredients(prevIngredients => {
          const newIngredients = [...prevIngredients];
          if (route.params.index !== undefined) {
            if (route.params.updatedIngredient !== undefined) {
              newIngredients[route.params.index] =
                route.params.updatedIngredient;
            }
          }
          return newIngredients;
        });
        navigation.setParams({updatedIngredient: undefined, index: undefined});
      }
    });
  }, [
    navigation,
    route.params?.newIngredient,
    route.params?.updatedIngredient,
  ]);

  const handleAddIngredient = () => {
    navigation.navigate('AddIngredient', {});
  };

  const handleEditIngredient = (ingredient: string, index: number) => {
    navigation.navigate('AddIngredient', {ingredient, index});
  };

  const addInstructionStep = () => {
    if (editIndex !== null) {
      const updatedInstructions = [...instructions]; // Create a copy of instructions
      updatedInstructions[editIndex] = instructionStep;
      setInstructions(updatedInstructions);
      setEditIndex(null);
    } else {
      setInstructions([...instructions, instructionStep]);
    }
    setInstructionStep('');
  };

  const editInstructionStep = (index: number) => {
    setInstructionStep(instructions[index]);
    setEditIndex(index);
  };

  const handleSubmit = async () => {
    console.log('route.params?.recipeToEdit:', route.params?.recipeToEdit);
    console.log('recipeToEdit:', recipeToEdit);
    const dbHelper = new DBHelper();
    await dbHelper.initDB();

    const ingredientsString = JSON.stringify(ingredients);
    const instructionsString = instructions.join('\n');

    if (recipeToEdit) {
      // we are editing an existing recipe
      const {id} = route.params.recipeToEdit;
      dbHelper
        .updateRecipe(
          id,
          title,
          imageUri,
          ingredientsString,
          instructionsString,
        )
        .then(() => {
          console.log(
            'Updating recipe with id: ' + id + ' and title: ' + title,
          );
          navigation.goBack();
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      // we are adding a new recipe
      dbHelper
        .insertRecipe(
          Date.now(),
          title,
          imageUri,
          ingredientsString,
          instructionsString,
        )
        .then(() => {
          navigation.goBack();
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const getImage = async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: ['image/*'],
      });
      setImageUri(response[0].uri);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.imageContainer} onPress={getImage}>
          {imageUri ? (
            <>
              <Image
                source={{uri: imageUri}}
                style={{width: 150, height: 150}}
              />
              <TouchableOpacity
                onPress={() => setImageUri('')}
                style={{position: 'absolute', top: 0, right: 0}}>
                <Icon name={'times'} size={20} color={'#000'} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Icon name={'image'} size={50} color={'#000'} />
              <Text>Add Image</Text>
            </>
          )}
        </TouchableOpacity>
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
                {`${ingredient.name} ${ingredient.quantity}${
                  ingredient.unit ? ` ${ingredient.unit}` : ''
                }`}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'space-around',
    alignSelf: 'center',
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
