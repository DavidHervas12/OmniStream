import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { sendRecoveryPassword, changePassword } from "../services/services";

export default function PasswordScreen({ onCloseModal, isVisible }) {
  const [email, setEmail] = useState("");
  const [verificationCodeInput, setVerificationCodeInput] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");

  const handleRecoverPassword = async () => {
    try {
      console.log(email)
      const code = await sendRecoveryPassword(email);
      console.log("Código de verificación: " + code);
      setVerificationCode(code);
      setStep("code");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "error");
    }
  };

  const handleSubmitVerificationCode = async () => {
    try {
      // Comprobar si verificationCodeInput es igual a verificationCode
      if (verificationCodeInput === verificationCode) {
        setStep("password");
      } else {
        Alert.alert("Error", "Invalid verification code");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid verification code");
    }
  };

  const handleSubmitNewPassword = async () => {
    try {
      await changePassword(password, email);
      Alert.alert("Success", "Password changed successfully");
      onCloseModal();
    } catch (error) {
      Alert.alert("Error", "Failed to change password");
    }
  };

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <>
            <Text style={styles.emailText}>Enter your email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={(txt) => setEmail(txt)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleRecoverPassword}
            >
              <Text>Send recovery code</Text>
            </TouchableOpacity>
          </>
        );
      case "code":
        return (
          <>
            <Text style={styles.emailText}>Enter verification code</Text>
            <TextInput
              style={styles.input}
              placeholder="Verification code"
              value={verificationCodeInput}
              onChangeText={(txt) => setVerificationCodeInput(txt)}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitVerificationCode}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </>
        );
      case "password":
        return (
          <>
            <Text style={styles.emailText}>Enter new password</Text>
            <TextInput
              style={styles.input}
              placeholder="New password"
              value={password}
              onChangeText={(txt) => setPassword(txt)}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitNewPassword}
            >
              <Text>Submit new password</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderStep()}
          <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#ffffff",
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
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 25,
  },
  passwordButton: {
    backgroundColor: "#607FF8",
    borderRadius: 40,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 40,
    padding: 10,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#607FF8", 
    borderRadius: 5,
    padding: 15, 
    marginTop: 10, 
    alignItems: "center", 
    justifyContent: "center", 
  },
});
