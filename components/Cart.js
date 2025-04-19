import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';

const Cart = () => {
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    userId,
    initializeUser,
    loadUserCart,
    increaseQuantity, 
    decreaseQuantity, 
    deleteFromCart 
  } = useCart();

  useEffect(() => {
    if (userId) {
      loadUserCart(userId);
    } else {
      console.warn('User ID is not set. Cannot load cart.');
    }
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => decreaseQuantity(item.productId)} 
            disabled={item.quantity === 1}
          >
            <Text 
              style={[
                styles.quantityButton, 
                item.quantity === 1 && styles.disabledButton 
              ]}
            >
              -
            </Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item.productId)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => deleteFromCart(item.productId)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛒 Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.productId}
            renderItem={renderItem}
          />
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Total Items: {totalItems}</Text>
            <Text style={styles.summaryText}>Total Price: ${totalPrice.toFixed(2)}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#2D3748',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A0AEC0',
  },
  itemContainer: {
    flexDirection: 'row', 
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#4A5568',
  },
  itemPrice: {
    fontSize: 14,
    color: '#6C63FF',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  summary: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#EDF2F7',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2D3748',
  },
  quantityButton: {
    fontSize: 18,
    color: '#6C63FF',
    paddingHorizontal: 8,
  },
  deleteButton: {
    fontSize: 14,
    color: '#E53E3E',
    marginTop: 8,
  },
  disabledButton: {
    color: '#A0AEC0', // Gray color for disabled button
  },
});

export default Cart;