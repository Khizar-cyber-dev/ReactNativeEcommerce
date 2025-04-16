import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { account } from '../services/api/appwrite';

const AuthScreen = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const validatePassword = (password) => {
    if (password.length < 8 || password.length > 265) {
      return 'Password must be between 8 and 265 characters long.';
      Alert.alert('Invalid Password', 'Password must be between 8 and 265 characters long.');
    }
    const commonPasswords = ['123456', 'password', '123456789']; 
    if (commonPasswords.includes(password)) {
      return 'Password is too common. Please choose a stronger password.';
      Alert.alert('Invalid Password', 'Password is too common. Please choose a stronger password.');
    }
    return null;
  };

  const handleSignUp = async () => {
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      Alert.alert('Invalid Password', passwordError);
      return;
    }

    try {
      await account.create('unique()', formData.email, formData.password, formData.name);
      await handleLogin(); 
    } catch (e) {
      console.log('Signup Error:', e.message);
      Alert.alert('Signup Failed', e.message);
    }
  };

  const handleLogin = async () => {
    try {
      await account.createEmailPasswordSession(formData.email, formData.password);
      navigation.navigate('Home');
    } catch (e) {
      console.log('Login Error:', e.message);
      Alert.alert('Login Failed', e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await account.createOAuth2Session(
        'google',
        'yourapp://auth/callback', 
        'yourapp://auth/callback'
      );
    } catch (e) {
      console.log('Google Login Error:', e.message);
      Alert.alert('Google Login Failed', e.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await account.createOAuth2Session(
        'facebook',
        'yourapp://auth/callback',
        'yourapp://auth/callback'
      );
    } catch (e) {
      console.log('Facebook Login Error:', e.message);
      Alert.alert('Facebook Login Failed', e.message);
    }
  };

  const handleSubmit = () => {
    isSignUp ? handleSignUp() : handleLogin();
  };

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
          </View>

          <View style={styles.formContainer}>
            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <Icon name="user" size={20} color="#6c757d" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>
                
                <View style={styles.inputContainer}>
                  <Icon name="phone" size={20} color="#6c757d" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Icon name="envelope" size={20} color="#6c757d" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#6c757d" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <LinearGradient colors={['#6c63ff', '#4a42d6']} style={styles.gradient}>
                <Text style={styles.submitButtonText}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <Text style={styles.socialText}>Or continue with</Text>
              <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                  <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2b2d42',
    marginTop: 15,
  },
  formContainer: {
    marginHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#495057',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#6c63ff',
    fontSize: 14,
  },
  submitButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  socialText: {
    color: '#6c757d',
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    backgroundColor: '#ffffff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleText: {
    color: '#6c757d',
  },
  toggleLink: {
    color: '#6c63ff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default AuthScreen;