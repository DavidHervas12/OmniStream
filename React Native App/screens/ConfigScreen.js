import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import HelpScreen from "./HelpScreen";
import ScreensContext from "./ScreenContext";
import i18n from "i18n-js";

const ConfigScreen = ({ mainNavigation }) => {
  const { language, setLanguage } = useContext(ScreensContext);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(language === "en");
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState(prevState => !prevState);
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "es" : "en";
    setLanguage(newLanguage); // Actualizar el estado del idioma
    setSwitchValue(newLanguage === "en"); // Actualizar el estado del interruptor
  };

  const handleHelp = () => {
    setIsHelpModalVisible(true);
  };

  const closeHelpModal = () => {
    setIsHelpModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t("titleSettings")}</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{i18n.t("languageSettings")}</Text>
        <Switch
          value={switchValue}
          onValueChange={() => {
            setSwitchValue(!switchValue);
            toggleLanguage();
          }}
          thumbColor={"#607FF8"}
          trackColor={{ false: "#d3d3d3", true: "#393e46" }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleHelp}>
        <Text style={styles.buttonText}>{i18n.t("helpSettings")}</Text>
      </TouchableOpacity>

      {/* Modal para la pantalla de ayuda */}
      <Modal
        visible={isHelpModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeHelpModal}
      >
        <HelpScreen onCloseModal={closeHelpModal} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    marginTop: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  button: {
    backgroundColor: "#607FF8",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
});

export default ConfigScreen;
