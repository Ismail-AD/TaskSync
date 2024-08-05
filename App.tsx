import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from './src/components/WelcomeScreen';
import MainScreen from './src/components/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RouteParamsList = {
  Welcome: undefined;
  MainPage: undefined;
};
const StackObject = createNativeStackNavigator<RouteParamsList>();

const App = () => {
  const [isLoading, setLoadState] = useState(true);
  const [isFirstLaunch, setLaunchState] = useState(true);

  async function firstScreen() {
    try {
      const getData = await AsyncStorage.getItem('Show');
      if (getData === 'false') {
        setLaunchState(false);
      }
    } catch (error) {
    } finally {
      setLoadState(false);
    }
  }

  useEffect(() => {
    firstScreen();
  }, []);
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={40} />
      </View>
    );
  }
  return (
    
    <NavigationContainer>
      <StackObject.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={isFirstLaunch ? 'Welcome' : 'MainPage'}>
        <StackObject.Screen name="Welcome" component={WelcomeScreen} />
        <StackObject.Screen name="MainPage" component={MainScreen} />
      </StackObject.Navigator>
    </NavigationContainer>
  );
};

export default App;
