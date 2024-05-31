import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { actualizarUsuario } from "../services/services";
import ScreensContext from "./ScreenContext";
import i18n from "i18n-js";


export default function ModifyScreen({ onCloseModal, isVisible }) {
  const { user } = useContext(ScreensContext);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(null);
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const defaultImage = require("../assets/UserIcon.png");
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState((prevState) => !prevState);
  }, [language]);

  useEffect(() => {
    chargeUserData();
    (async () => {
      if (status !== "granted") {
        const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        Alert.alert(
          i18n.t("modifyTextPremission")
        );
      }
    })();
  }, []);

  const chargeUserData = () => {
    setUsername(user.username);
    setEmail(user.email);
  };

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
      console.log("Image selection cancelled");
    }
  };

  const handleUpdateUser = async () => {
    if (!username) {
      setUsernameError(i18n.t("modifyTextUserRequired"));
      return;
    } else {
      setUsernameError("");
    }

    if (!email) {
      setEmailError(i18n.t("modifyTextEmailRequired"));
      return;
    } else {
      setEmailError("");
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError(i18n.t("modifyTextEmailNotValid"));
      return;
    } else {
      setEmailError("");
    }

    let profilePictureBase64 = null;

    if (image) {
      const imageBase64 = await convertImageToBase64(image);
      profilePictureBase64 = imageBase64;
    }

    const updatedData = {
      id: user.id,
      username: username,
      password: user.password,
      email: email,
      profilePicture: profilePictureBase64,
    };

    try {
      await actualizarUsuario(updatedData);
      Alert.alert(
        i18n.t("modifyTextAccUpdate"),
        [
          {
            text: "OK",
            onPress: () => onCloseModal(),
          },
        ]
      );
    } catch (error) {
      console.error("Error during account update:", error);
    }
  };

  const img64 = JSON.stringify(user.profilePicture);
  const image64 = `data:image/*;base64,${img64}`;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.container}>
        <View style={styles.part1}></View>
        <View style={styles.part2}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{ uri: image64}}
              style={{ width: 110, height: 110 }}
            />
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              <Feather name="plus" size={35} color="#607FF8" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userText}>
          {i18n.t("modifyTextUser")}<Text style={styles.requiredField}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, usernameError ? styles.errorInput : null]}
            placeholder={i18n.t("modifyTextUser")}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setUsernameError("");
            }}
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}
          <Text style={styles.emailText}>
          {i18n.t("modifyTextInsertEmail")}<Text style={styles.requiredField}> *</Text>
          </Text>
          <TextInput
            style={[styles.input, emailError ? styles.errorInput : null]}
            placeholder="email@gmail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.accountButton}
              onPress={handleUpdateUser}
            >
              <Text style={styles.buttonText}>{i18n.t("modifyButtonUpdate")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onCloseModal}>
              <Text style={styles.buttonText}>{i18n.t("buttonClose")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#ffffff",
  },
  part1: {
    flex: 3,
    alignItems: "center",
    marginTop: 50,
    marginBottom: 60,
  },
  part2: {
    justifyContent: "center",
    marginVertical: 10,
    padding: 35,
  },
  emailText: {
    color: "#607FF8",
    marginVertical: 5,
    padding: 5,
  },
  userText: {
    color: "#607FF8",
    marginVertical: 5,
    padding: 5,
  },
  requiredField: {
    color: "red",
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "#607FF8",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    padding: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#607FF8",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 40,
  },
  accountButton: {
    backgroundColor: "#607FF8",
    borderRadius: 40,
    padding: 10,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#E74C3C",
    borderRadius: 40,
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
  errorInput: {
    borderColor: "red",
  },
});
