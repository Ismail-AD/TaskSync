import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import CustomButton from './UtilityComponets/CustomButton';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RouteParamsList} from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RouteParamsList, 'Welcome'>;

async function noNexTime() {
  try {
    await AsyncStorage.setItem('Show', 'false');
  } catch (error) {}
}
const WelcomeScreen = ({navigation, route}: Props) => {
  const handleOnClick = () => {
    // handle get started click
    noNexTime();
    navigation.navigate('MainPage');
  };
  {
    /* require('../assets/images/firstPage.png') tells the bundler to include the firstPage.png image from the assets/images directory in the final app package. */
  }
  return (
    <View style={styling.main}>
      <Image style={styling.image} source={require('./assets/firstPage.png')} />
      <View>
        <Text style={styling.title}>Welcome to TaksSync</Text>
        <Text style={styling.subtitle}>
          Stay productive and keep track of your goals with TaskSync. Your
          ultimate task management companion.
        </Text>
      </View>
      <View style={styling.btnWrapper}>
        <CustomButton onPress={handleOnClick} />
      </View>
    </View>
  );
};

const styling = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    height: '45%',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    paddingHorizontal: 10,
    textAlign: 'center',
    marginTop: 15,
  },
  btnWrapper: {
    width: '90%',
  },
});

export default WelcomeScreen;
