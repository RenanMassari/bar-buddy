import React, {useEffect, useRef, useState, useCallback} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  ScrollView,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  PermissionsAndroid,
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

  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      } else {
        console.log('Camera permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleChoosePhoto = async () => {
    const permission = await requestGalleryPermission();
    console.log(`permission: ${permission}`);
    if (permission) {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      }).then(image => {
        setImage(image.path);
      });
    }
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
      <Icon
        name={'image'}
        size={30}
        color={'#000'}
        onPress={() => {
          // requestGalleryPermission().then(r => console.log(r));
          handleChoosePhoto();
        }}
      />
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
      <Button title="Camera" onPress={requestCameraPermission} />
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
