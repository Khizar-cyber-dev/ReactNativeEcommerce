import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import { CartProvider } from './components/CartContext';
import CartIcon from './components/CartIcon';
import LandingScreen from './components/LandingPage';
import CategoryScreen from './components/CategoryScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
      <CartProvider> 
        <NavigationContainer>
          <Stack.Navigator>
             <Stack.Screen
              name="Landing" 
              component={LandingScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={() => ({
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              })}
            />
            <Stack.Screen 
              name="Category" 
              component={CategoryScreen} 
              options={({ route }) => ({
                title: route.params.category.toUpperCase(),
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              })}
            />
            <Stack.Screen 
              name="ProductDetails" 
              component={ProductDetails} 
              options={({ navigation }) => ({
                headerRight: () => <CartIcon navigation={navigation} />,
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              })}
            />
            <Stack.Screen 
              name="Cart" 
              component={Cart} 
              options={{
                headerStyle: { backgroundColor: '#6C63FF' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
  );
};

export default App;