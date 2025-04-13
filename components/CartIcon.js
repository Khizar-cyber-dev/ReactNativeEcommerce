import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from './CartContext';

const Stack = createStackNavigator();

const CartIcon = ({ navigation }) => {
  const { totalItems } = useCart();

  return (
    <TouchableOpacity 
      style={styles.cartIconContainer}
      onPress={() => navigation.navigate('Cart')}
    >
      <Ionicons name="cart-outline" size={24} color="#fff" />
      {totalItems > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartIcon;

const styles = StyleSheet.create({
    cartIconContainer: {
      marginRight: 16,
      position: 'relative',
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: '#FF0000',
      borderRadius: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    cartBadgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });