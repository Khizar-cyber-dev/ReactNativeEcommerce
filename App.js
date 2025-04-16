import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import { CartProvider } from './components/CartContext';
import CartIcon from './components/CartIcon';
import LandingScreen from './components/LandingPage';
import CategoryScreen from './components/CategoryScreen';
import AuthNavigator from './auth/navigators/AuthNavigator';
import { account } from './services/api/appwrite';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await account.get();
        setInitialRoute('Home');
      } catch (error) {
        setInitialRoute('Auth');
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    return null; 
  }

  return (
    <CartProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen 
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
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