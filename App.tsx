import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import Recent from './components/Recent';

const App = () => {
  const [activeHeader, setActiveHeader] = useState(0);

  const renderContent = () => {
    switch (activeHeader) {
      case 0:
        return <Recent />;
      case 1:
        return <Text>Content 2</Text>;
      case 2:
        return <Text>Content 3</Text>;
      case 3:
        return <Text>Content 4</Text>;
      default:
        return <Text>Content 1</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>BarBuddy</Text>
        <Image source={require('./assets/logo.png')} />
        <TextInput style={styles.searchBox} placeholder="Search..." />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.headerContainer}>
          {['Recent', 'Header 2', 'Header 3', 'Header 4'].map(
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    paddingHorizontal: 10,
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
