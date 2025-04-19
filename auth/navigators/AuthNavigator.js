import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthForm from '../AuthForm';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AuthForm">
      <Stack.Screen 
        name="AuthForm" 
        component={AuthForm} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;