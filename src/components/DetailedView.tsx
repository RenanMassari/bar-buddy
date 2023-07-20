// noinspection TypeScriptValidateTypes

import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NativeStackNavigationProp} from 'react-native-screens/native-stack';

const Tab = createMaterialTopTabNavigator();

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

const Ingredients: React.FC<{ingredients: Ingredient[]}> = ({ingredients}) => (
  <View style={styles.tabContainer}>
    {ingredients.map((ingredient: Ingredient, index: number) => (
      <Text key={index} style={styles.textStyle}>
        {ingredient.name}: {ingredient.quantity} {ingredient.unit}
      </Text>
    ))}
  </View>
);

const Instructions: React.FC<{instructions: string}> = ({instructions}) => (
  <View style={styles.tabContainer}>
    <Text style={styles.textStyle}>{instructions}</Text>
  </View>
);

const DetailedView = ({route}: {route: any}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {item, onShare} = route.params;

  const ingredients = JSON.parse(item.ingredients);

  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={[styles.container]}>
      <View style={styles.iconsContainer}>
        <Icon
          name="edit"
          size={30}
          style={styles.icon}
          onPress={() => navigation.navigate('AddRecipe', {recipeToEdit: item})}
        />
        <Icon
          name="share-alt"
          size={30}
          style={styles.icon}
          onPress={() => onShare(item)}
        />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image style={styles.image} source={{uri: item.image}} />
      </TouchableOpacity>
      <Modal visible={isModalVisible}>
        <ImageViewer
          imageUrls={[{url: item.image}]}
          onSwipeDown={() => setModalVisible(false)}
          enableSwipeDown={true}
        />
        <Icon
          name={'compress-arrows-alt'}
          size={50}
          color={'#fff'}
          onPress={() => setModalVisible(false)}
          style={{position: 'absolute', top: 0, right: 0}}
        />
      </Modal>
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
    flex: 1,
  },
  iconsContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    // flexDirection: 'row',
    justifyContent: 'space-around',
    marginRight: 10,
  },
  icon: {
    margin: 10,
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
    paddingVertical: 8,
  },
  textStyle: {
    lineHeight: 24,
  },
});

export default DetailedView;
