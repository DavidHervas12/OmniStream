import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Linking,
} from "react-native";
import { getVideoLists } from "../services/services";
import i18n from "i18n-js";
import ScreensContext from "./ScreenContext";

const ListSaveModal = ({ visible, onClose, selectedList }) => {
  const [videos, setVideos] = useState([]);
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState((prevState) => !prevState);
  }, [language]);


  useEffect(() => {
    const fetchVideos = async () => {
      try {
        if (selectedList) {
          const responseData = await getVideoLists(selectedList.id);
          setVideos(responseData);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [selectedList]);

  const handleVideoPress = (link) => {
    Linking.openURL(link);
  };

  const renderModalItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleVideoPress(item.link)}>
      <View style={styles.modalItemContainer}>
        <Text style={styles.listName}>{item.title}</Text>
        <Image
          source={
            item.thumbnail
              ? { uri: item.thumbnail }
              : require("../assets/videoThumbnail.png")
          }
          style={styles.modalItemImage}
        />
        <Text style={styles.modalItemText}>{item.channel}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={renderModalItem}
          contentContainerStyle={styles.flatListContainer}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>
            {i18n.t("listsaveButtonClose")}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  flatListContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  modalItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: "#ecf0f1",
    borderRadius: 10,
    width: 350,
    height: 220,
  },
  modalItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  modalItemText: {
    fontFamily: "RobotoMono",
    fontSize: 16,
    marginRight: 15,
    marginTop: 10,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  closeButtonText: {
    fontFamily: "RobotoMono",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  listName: {
    fontFamily: "RobotoMono",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ListSaveModal;
