import {useContext, useState, useEffect} from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import i18n from "i18n-js";
import ScreensContext from "./ScreenContext";

export default function NotificationsScreen() {
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState(prevState => !prevState);
  }, [language]);


  return (
    <View style={styles.container}>
      <View style={styles.part2}>
        <Text style={styles.textNotifications}>{i18n.t("notificationText")}</Text>
        <View style={styles.buttonContainer}>
          <Text style={styles.textRecent}>{i18n.t("notificacionTextRecents")}</Text>
          <TouchableOpacity
            style={styles.markButton}
            onPress={() => console.log('MARK AS READ pressed')}>
            <Text style={styles.textMark}>{i18n.t("notificationsTextRead")}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.part3}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 60, height: 80, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.text}>{i18n.t("notificacionsTextWelcome")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#ffffff',
  },
  part2: {
    marginHorizontal: 10,
    marginTop: 40,
  },
  part3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  textNotifications: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  text: {
    textAlign: 'justify',
    fontSize: 18,
    marginHorizontal: 10,
    marginRight: 70,
  },
  textMark: {
    textAlign: 'justify',
    fontSize: 18,
    marginVertical: 10,
    color: '#607FF8',
  },
  textRecent: {
    textAlign: 'justify',
    fontSize: 18,
    marginVertical: 10,
    color: 'gray',
  },
  markButton: {
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
