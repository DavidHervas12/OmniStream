import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import {
  useFonts,
  RobotoMono_400Regular,
} from "@expo-google-fonts/roboto-mono";
import { createLists, addVideoToList } from "../services/services";
import ScreensContext from "./ScreenContext";
import i18n from "i18n-js";

const AddVideoModal = ({ modalVisible, onClose, video, availableLists }) => {
  const [fontsLoaded] = useFonts({
    RobotoMono: RobotoMono_400Regular,
  });
  const { user } = useContext(ScreensContext);
  const [newListName, setNewListName] = useState("");
  const [isCreatingNewList, setIsCreatingNewList] = useState(false);
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState((prevState) => !prevState);
  }, [language]);

  const handleCreateNewList = () => {
    setIsCreatingNewList(true);
  };

  const handleConfirmCreateNewList = async () => {
    let videoLink;
    if (video.source === "YouTube") {
      videoLink = `https://www.youtube.com/watch?v=${video.id}`;
    } else if (video.source === "Vimeo") {
      videoLink = `https://vimeo.com/${video.id}`;
    } else if (video.source === "Dailymotion") {
      videoLink = `https://www.dailymotion.com/video/${video.id}`;
    }
    try {
      const newListId = await createLists({
        idUser: user.id,
        title: newListName,
        videos: [],
        likes: 0,
        dislikes: 0,
      });
      console.log("Nueva lista creada:", newListId);

      const response = await addVideoToList({
        title: video.title,
        channel: video.channel,
        link: videoLink,
        thumbnail: video.image,
        listId: newListId,
      });
      console.log("Video agregado a la lista:", response);

      // Restablecer el estado
      setIsCreatingNewList(false);
      setNewListName("");
      onClose();
    } catch (error) {
      console.error("Error al crear la lista o agregar el video:", error);
      // Manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  const onAddToExistingList = async (selectedList) => {
    let videoLink;
    if (video.source === "YouTube") {
      videoLink = `https://www.youtube.com/watch?v=${video.id}`;
    } else if (video.source === "Vimeo") {
      videoLink = `https://vimeo.com/${video.id}`;
    } else if (video.source === "Dailymotion") {
      videoLink = `https://www.dailymotion.com/video/${video.id}`;
    }
    try {
      // Agregar el video a la lista existente
      const response = await addVideoToList({
        title: video.title,
        channel: video.channel,
        link: videoLink,
        thumbnail: video.image,
        listId: selectedList.id,
      });
      console.log("Video agregado a la lista existente:", response);

      // Cerrar el modal
      onClose();
    } catch (error) {
      console.error("Error al agregar el video a la lista existente:", error);
      // Manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  const renderUserListItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => onAddToExistingList(item)}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.createNewListButton}
            onPress={handleCreateNewList}
          >
            <Text style={styles.createNewListButtonText}>
              {i18n.t("createNewListButtonAddVideo")}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={availableLists}
            keyExtractor={(item) => item.id}
            renderItem={renderUserListItem}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>
              {i18n.t("cancelButtonAddVideo")}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={isCreatingNewList}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.popupContainer}>
              <View style={styles.popupContent}>
                <Text style={styles.popupTitle}>
                  {i18n.t("confirmButtonAddVideo")}
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setNewListName}
                  value={newListName}
                  placeholder="Nombre de la Lista"
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsCreatingNewList(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmCreateNewList}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  createNewListButton: {
    padding: 10,
    backgroundColor: "#607FF8",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  createNewListButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  confirmButton: {
    backgroundColor: "#607FF8",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popupContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    padding: 10,
  },
  listImagesContainer: {
    marginRight: 10,
  },
  listItemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 5,
  },
  actionButtonText: {
    marginLeft: 5,
  },
});

export default AddVideoModal;
