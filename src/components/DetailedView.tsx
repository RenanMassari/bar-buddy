import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

const Ingredients: React.FC<{ingredients: Ingredient[]}> = ({ingredients}) => (
  <View style={styles.tabContainer}>
    {ingredients.map((ingredient: Ingredient, index: number) => (
      <Text key={index}>
        {ingredient.name}: {ingredient.quantity} {ingredient.unit}
      </Text>
    ))}
  </View>
);

const Instructions: React.FC<{instructions: string}> = ({instructions}) => (
  <View style={styles.tabContainer}>
    <Text>{instructions}</Text>
  </View>
);

const DetailedView = ({route}) => {
  const {item} = route.params;

  const ingredients = JSON.parse(item.ingredients);

  return (
    <View style={[styles.container, {flex: 1}]}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={{uri: item.image}} style={styles.image} />
      <View style={{flex: 1, alignSelf: 'stretch'}}>
        <Tab.Navigator
          screenOptions={{
            tabBarIndicatorStyle: {backgroundColor: 'black'},
            tabBarLabelStyle: {fontWeight: 'bold'},
          }}>
          <Tab.Screen
            name="Ingredients"
            children={() => <Ingredients ingredients={ingredients} />}
          />
          <Tab.Screen
            name="Instructions"
            children={() => <Instructions instructions={item.instructions} />}
          />
        </Tab.Navigator>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  tabContainer: {
    paddingHorizontal: 16,
  },
});

export default DetailedView;
