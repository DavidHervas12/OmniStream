import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { enviarDatos } from '../services/services';

export default function RegisterScreen({ onCloseModal }) {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [userError, setUserError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const defaultImage = require('../assets/UserIcon.png');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Please grant permission to access the media library.'
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    } else {
      console.log('Image selection cancelled');
    }
  };

  const handleCreateAccount = async () => {
    if (!user) {
      setUserError('Username is required.');
      return;
    } else {
      setUserError('');
    }

    if (!email) {
      setEmailError('Email is required.');
      return;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      return;
    } else {
      setPasswordError('');
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    } else {
      setPasswordError('');
    }

    let imageBase64 = '';
    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        imageBase64 = reader.result.split(',')[1];
        const userData = {
          username: user,
          password: password,
          email: email,
          savedLists: [],
          profilePicture: imageBase64,
          followers: 0,
        };
        enviarDatos(userData)
          .then(() => {
            Alert.alert(
              'Account Created',
              'Your account has been created successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => onCloseModal(),
                },
              ]
            );
            console.log('Account creation successful');
          })
          .catch((error) => {
            console.error('Error during account creation:', error);
          });
      };
      reader.readAsDataURL(blob);
    } else {
      const userData = {
        username: user,
        password: password,
        email: email,
        savedLists: [],
        profilePicture: 'defaultProfilePicture',
        followers: 0,
      };
      enviarDatos(userData)
        .then(() => {
          Alert.alert(
            'Account Created',
            'Your account has been created successfully!',
            [
              {
                text: 'OK',
                onPress: () => onCloseModal(),
              },
            ]
          );
          console.log('Account creation successful');
        })
        .catch((error) => {
          console.error('Error during account creation:', error);
        });
    }
  };

  const img64 = JSON.stringify(user.profilePicture);
  const image64 = `data:image/*;base64,${img64}`;
  return (
    <View style={styles.container}>
      <View style={styles.part1}></View>
      <View style={styles.part2}>
        <View style={{ alignItems: 'center' }}>
        <Image
  source={{ uri: `data:image/png;base64,${image64}` }}
  style={{ width: 110, height: 110 }}
/>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            <Feather name="plus" size={35} color="#607FF8" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userText}>
          Enter your username<Text style={styles.requiredField}> *</Text>
        </Text>
        <TextInput
          style={[styles.input, userError ? styles.errorInput : null]}
          placeholder="Username"
          value={user}
          onChangeText={(text) => {
            setUser(text);
            setUserError('');
          }}
        />
        {userError ? <Text style={styles.errorText}>{userError}</Text> : null}
        <Text style={styles.emailText}>
          Enter your email<Text style={styles.requiredField}> *</Text>
        </Text>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="email@gmail.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <Text style={styles.passwordText}>
          Enter your password<Text style={styles.requiredField}> *</Text>
        </Text>
        <TextInput
          style={[styles.input, passwordError ? styles.errorInput : null]}
          placeholder="********"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setPasswordError('');
          }}
          secureTextEntry
          
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.accountButton}
            onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#ffffff',
  },
  part1: {
    flex: 3,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 60,
  },
  part2: {
    justifyContent: 'center',
    marginVertical: 10,
    padding: 35,
  },
  passwordText: {
    color: '#607FF8',
    marginVertical: 5,
    padding: 5,
  },
  emailText: {
    color: '#607FF8',
    marginVertical: 5,
    padding: 5,
  },
  userText: {
    color: '#607FF8',
    marginVertical: 5,
    padding: 5,
  },
  requiredField: {
    color: 'red',
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#607FF8',
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#607FF8',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 40,
  },
  accountButton: {
    backgroundColor: '#607FF8',
    borderRadius: 40,
    padding: 10,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#E74C3C', 
    borderRadius: 40,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
});