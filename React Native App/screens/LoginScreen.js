import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { iniciarSesion } from "../services/services";
import PasswordScreen from "./PasswordScreen";
import RegisterScreen from "./RegisterScreen";
import ScreensContext from "./ScreenContext";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { setUser } = useContext(ScreensContext);
  const { setIsLoggedIn } = useContext(ScreensContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const handleLogin = async () => {
    if (!username) {
      setUsernameError("Username is required.");
      return;
    } else {
      setUsernameError("");
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const userData = { username, password };
      const loginResponse = await iniciarSesion(userData);
      const objectResponse = JSON.parse(loginResponse);

      setUser(objectResponse);
      setIsLoggedIn(true);
      navigation.navigate("MainNavigator");

      
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  const handleForgotPassword = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsRegisterModalVisible(false);
  };

  const handleInvited = () => {
    navigation.replace("MainNavigator");
  };

  const handleRegister = () => {
    setIsRegisterModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <View style={styles.part1}>
        <Image
          source={require("../assets/logo_with_the_name.jpeg")}
          style={{ width: 200, height: 80 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.part2}>
        <Text style={styles.emailText}>
          Enter your username<Text style={styles.requiredField}> *</Text>
        </Text>
        <TextInput
          style={[styles.input, usernameError ? styles.errorInput : null]}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        <Text style={styles.passwordText}>
          Enter your password<Text style={styles.requiredField}> *</Text>
        </Text>
        <TextInput
          style={[styles.input, passwordError ? styles.errorInput : null]}
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.passwordButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.buttonText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.part3}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.accountButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer2}>
          <TouchableOpacity
            style={styles.invitedButton}
            onPress={handleInvited}
          >
            <Text style={styles.buttonText}>Invited</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para la pantalla de recuperación de contraseña */}

        <PasswordScreen  onCloseModal={closeModal} isVisible={isModalVisible}/>


      {/* Modal para la pantalla de registro */}
      <Modal
        visible={isRegisterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <RegisterScreen onCloseModal={closeModal} />
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#ffffff",
  },
  part1: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 50,
  },
  part2: {
    flex: 2,
    justifyContent: "center",
    marginVertical: 10,
    padding: 35,
  },
  passwordText: {
    color: "#607FF8",
    marginVertical: 5,
    padding: 5,
  },
  emailText: {
    color: "#607FF8",
    marginVertical: 5,
    padding: 5,
  },
  requiredField: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#607FF8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  buttonContainer2: {
    padding: 37,
  },
  passwordButton: {
    backgroundColor: "#607FF8",
    borderRadius: 40,
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#607FF8",
    borderRadius: 40,
    padding: 10,
  },
  accountButton: {
    backgroundColor: "#607FF8",
    borderRadius: 40,
    padding: 10,
  },
  invitedButton: {
    backgroundColor: "#607FF8",
    borderRadius: 40,
    padding: 10,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  part3: {
    flex: 3,
    padding: 40,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  errorInput: {
    borderColor: "red",
  },
});

export default LoginScreen;
