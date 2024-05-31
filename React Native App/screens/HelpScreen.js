import React, { useEffect, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreensContext from "./ScreenContext";
import i18n from "i18n-js";

export default function HelpScreen({ onCloseModal }) {
  const navigation = useNavigation();
  const route = useRoute();
  const isModal = route.params?.isModal || false;
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState(prevState => !prevState);
  }, [language]);


  const goBack = () => {
    if (isModal) {
      navigation.goBack();
    } else {
      // Handle navigating back from the main screen
    }
  };

  const navigateToNotImplementedScreen = () => {
    Alert.alert(
      i18n.t("helpTextImplementation"),
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ],
      { cancelable: false }
    );
  };

  const goToContactScreen = () => {
    navigateToNotImplementedScreen("Contact");
  };

  const goToQuestionsScreen = () => {
    navigateToNotImplementedScreen("Frequently Questions");
  };

  const goToVersionScreen = () => {
    navigateToNotImplementedScreen("Version");
  };

  const handleClose = () => {
    if (onCloseModal) {
      onCloseModal();
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={true}
      onRequestClose={goBack}
    >
      <View style={styles.container}>
        <Text style={styles.textHelp}>{i18n.t("helpTextHelp")}</Text>
        <View style={styles.part2}>
          <TouchableOpacity onPress={goToContactScreen}>
            <Text style={styles.buttonText}>{i18n.t("helpTextContact")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToQuestionsScreen}>
            <Text style={styles.buttonText}>
              {i18n.t("helpTextFreqQuestions")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToVersionScreen}>
            <Text style={styles.buttonText}>{i18n.t("helpTextVersion")}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeButtonText}>{i18n.t("buttonClose")}</Text>
        </TouchableOpacity>
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
  textHelp: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "top",
    textAlign: "center",
  },
  part2: {
    padding: 20,
    alignItems: "center", // Centra los botones horizontalmente
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  closeButtonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
