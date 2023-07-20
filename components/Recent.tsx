import React from 'react';
import {View, Text, FlatList, StyleSheet, Dimensions} from 'react-native';
import RecipeCard from './RecipeCard';

interface Item {
  id: string;
  title: string;
}

const data: Item[] = [
  {id: '1', title: 'Item 1'},
  {id: '2', title: 'Item 2'},
  {id: '3', title: 'Item 3'},
  {id: '4', title: 'Item 4'},
  {id: '5', title: 'Item 5'},
  {id: '6', title: 'Item 6'},
  // ...more items
];

const numColumns = 2;
const cardWidth = (Dimensions.get('window').width * 0.9) / numColumns;

const RecentTab: React.FC = () => {
  const renderItem = ({item}: {item: Item}) => (
    <RecipeCard
      title={item.title}
      onPress={() => console.log(`Navigating to details of ${item.title}`)}
      cardWidth={cardWidth}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
