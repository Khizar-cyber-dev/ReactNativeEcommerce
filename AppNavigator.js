import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';
import AuthForm from './auth/AuthForm';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="AuthForm" component={AuthForm} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;
