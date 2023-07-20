import React, {useState, useRef} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

const AddIngredientScreen = ({navigation, route}) => {
  const {ingredient, index} = route.params || {};

  const [name, setName] = useState(ingredient?.name || '');
  const [quantity, setQuantity] = useState(
    ingredient?.quantity.toString() || '',
  );
  const [unit, setUnit] = useState(ingredient?.unit || '');

  const quantityRef = useRef();
  const unitRef = useRef();

  const handleSubmit = () => {
    if (index !== undefined) {
      // Updating an existing ingredient
      navigation.navigate('AddRecipe', {
        updatedIngredient: {name, quantity, unit},
        index,
      });
    } else {
      // Adding a new ingredient
      navigation.navigate('AddRecipe', {
        newIngredient: {name, quantity, unit},
      });
    }
    navigation.addListener('focus', () => {
      setName('');
      setQuantity('');
      setUnit('');
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        onSubmitEditing={() => quantityRef.current.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        // ref={quantityRef}
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        style={styles.input}
        onSubmitEditing={() => unitRef.current.focus()}
        blurOnSubmit={false}
      />
      <TextInput
        // ref={unitRef}
        placeholder="Unit"
        value={unit}
        onChangeText={setUnit}
        style={styles.input}
        onSubmitEditing={handleSubmit}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
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
    paddingLeft: 10,
  },
});

export default AddIngredientScreen;
