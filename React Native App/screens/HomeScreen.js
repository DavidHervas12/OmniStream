import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Linking,
} from "react-native";
import {
  useFonts,
  RobotoMono_400Regular,
} from "@expo-google-fonts/roboto-mono";

import {
  search,
  searchLists,
  getUserLists,
  getVideoLists,
  createLists,
  addVideoToList,
} from "../services/services";
import AddVideoModal from "./AddVideoModal";
import ListModal from "./ListModal";
import ScreensContext from "./ScreenContext";
import { SaveList } from "../services/services";
import i18n from "i18n-js";

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({
    RobotoMono: RobotoMono_400Regular,
  });
  const { user } = useContext(ScreensContext);
  const [activeTab, setActiveTab] = useState("lists");
  const [modalListVisible, setModalListVisible] = useState(false);
  const [addVideoModalVisible, setAddVideoModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [videosData, setVideosData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listsData, setListsData] = useState([]);
  const [availableLists, setAvailableLists] = useState([]);
  const [videoToAdd, setVideoToAdd] = useState(null);
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState((prevState) => !prevState);
  }, [language]);

  const handleSearch = async () => {
    try {
      const responseData = await search(searchQuery);
      const videos = responseData || [];
  
      const youtubeVideos = responseData.youtube ? responseData.youtube.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        image: item.snippet.thumbnails.default.url,
        source: "YouTube",
        channel: item.snippet.channelTitle,
      })) : [];
  
      const vimeoVideos = responseData.vimeo ? responseData.vimeo.data.map((item) => ({
        id: item.link.substring(item.link.lastIndexOf("/") + 1),
        title: item.name,
        image: item.pictures.base_link,
        source: "Vimeo",
        channel: item.user.name,
      })) : [];
  
      const dailymotionVideos = responseData.daylimotion ? responseData.daylimotion.list.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.thumbnail_360_url,
        source: "Dailymotion",
        channel: item.owner && item.owner.screenname ? item.owner.screenname : "unknown",
      })) : [];
  
      const combinedVideosData = [
        ...youtubeVideos,
        ...vimeoVideos,
        ...dailymotionVideos,
      ];
  
      setVideosData(combinedVideosData);
    } catch (error) {
      console.error("Error al buscar videos:", error);
    }
  };
  

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItemContainer}
      onPress={() => handleVideoPress(item.id, item.source)} // Cambia item.link a item.id
    >
      <Image source={{ uri: item.image }} style={styles.videoItemImage} />
      <Text style={styles.videoItemText}>{item.title}</Text>
      <Text style={styles.videoItemText}>{item.channel}</Text>
      {/* Botón de la cruz */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openAddVideoModal(item)}
      >
        <Image source={require("../assets/add.png")} style={styles.closeIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleVideoPress = (id, source) => {
    if (id) {
      let videoLink;
      if (source === "YouTube") {
        videoLink = `https://www.youtube.com/watch?v=${id}`;
      } else if (source === "Vimeo") {
        videoLink = `https://vimeo.com/${id}`;
      } else if (source === "Dailymotion") {
        videoLink = `https://www.dailymotion.com/video/${id}`;
      } else {
        console.error("Fuente de video desconocida:", source);
        return;
      }
      Linking.openURL(videoLink).catch((err) =>
        console.error("Error al abrir el enlace:", err)
      );
    } else {
      console.error("El ID del video es inválido:", id);
    }
  };

  const handleListSearch = async () => {
    try {
      const responseData = await searchLists(searchQuery);
      setListsData(responseData);
    } catch (error) {
      console.error("Error al buscar listas:", error);
    }
  };

  const getUserListsHome = async () => {
    const responseData = await getUserLists(user.id);
    const lists = responseData || [];
    console.log("respuesta userLists" + responseData);
    setAvailableLists(lists);
  };

  const openAddVideoModal = (video) => {
    getUserListsHome();
    setVideoToAdd(video);
    setAddVideoModalVisible(true);
  };

  const closeAddVideoModal = () => {
    setAddVideoModalVisible(false);
  };

  const openListModal = async (list) => {
    setSelectedList(list);
    const videosInList = await getVideoLists(list.id);
    // Guardar la lista actualizada con los videos con un nombre diferente
    const updatedList = { ...list, videos: videosInList };
    setSelectedList(updatedList); // Actualizar la lista seleccionada
    setModalListVisible(true);
  };

  const closeListModal = () => {
    setModalListVisible(false); // Cambiar de addVideoModalVisible a modalListVisible
  };

  if (!fontsLoaded) {
    return null;
  }

  const handleSaveList = async () => {
    try {
      // Aquí puedes preparar los datos necesarios para la solicitud, como userId y listId
      const userId = user.id; // Asegúrate de obtener el userId adecuado
      const listId = selectedList.id; // Asegúrate de obtener el listId adecuado

      // Realiza la solicitud para guardar la lista
      await SaveList({ userId, listId });
    } catch (error) {
      console.error("Error al guardar la lista:", error);
    }
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => openListModal(item)}
    >
      <View style={styles.listImagesContainer}>
        {item.videos &&
          item.videos
            .slice(0, 3)
            .map((video, index) => (
              <Image
                key={index}
                source={{ uri: video.thumbnail }}
                style={styles.listItemImage}
              />
            ))}
      </View>
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.iconImage}
        />
        <TextInput
          style={styles.textInput}
          placeholder={i18n.t("searchPlaceHolderHome")}
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={activeTab === "lists" ? handleListSearch : handleSearch}
        >
          <Image
            source={require("../assets/searchIcon.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, activeTab === "lists" && styles.activeButton]}
          onPress={() => setActiveTab("lists")}
        >
          <Text
            style={[
              styles.buttonText,
              activeTab === "lists" && styles.activeButtonText,
            ]}
          >
            {i18n.t("searchListsButtonHome")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeTab === "videos" && styles.activeButton]}
          onPress={() => setActiveTab("videos")}
        >
          <Text
            style={[
              styles.buttonText,
              activeTab === "videos" && styles.activeButtonText,
            ]}
          >
            {i18n.t("searchVideosButtonHome")}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === "lists" ? listsData : videosData}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === "lists" ? renderListItem : renderVideoItem}
      />

      {addVideoModalVisible && (
        <AddVideoModal
          modalVisible={addVideoModalVisible}
          onClose={closeAddVideoModal}
          video={videoToAdd}
          availableLists={availableLists}
        />
      )}
      <ListModal
        visible={modalListVisible}
        onClose={closeListModal}
        selectedList={selectedList}
        onSaveList={handleSaveList} // Pasar la función handleSaveList como prop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e8ee",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#607FF8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textInput: {
    flex: 0.8,
    fontFamily: "RobotoMono",
    borderRadius: 20,
    paddingVertical: 10,
    fontSize: 16,
    width: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#607FF8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: "#607FF8",
    borderColor: "#607FF8",
  },
  buttonText: {
    fontFamily: "RobotoMono",
    color: "#607FF8",
    fontSize: 16,
    textAlign: "center",
  },
  activeButtonText: {
    color: "white",
  },
  listItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
    marginLeft: 2,
    marginRight: 1,
    marginTop: 10,
    backgroundColor: "#ecf0f1",
    borderColor: "#607FF8",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "#607FF8",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    width: "96%",
  },
  listImagesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    marginLeft: 15,
  },
  listItemImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "95%", // Ajustar el ancho para que ocupe todo el contenedor
    paddingHorizontal: 10,
  },
  listItemTitle: {
    fontFamily: "RobotoMono",
    fontSize: 16,
    color: "#607FF8", // Color azul para el título
    flex: 1, // Para que ocupe el espacio disponible
  },
  actionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "Black",
    borderWidth: 1, // Añade un borde alrededor de la zona de los iconos y el texto
    borderRadius: 5, // Borde redondeado
    padding: 5, // Añade un espacio interno para separar el borde del contenido
  },
  actionButton: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#607FF8", // Borde azul
    paddingHorizontal: 5, // Reduce el espacio horizontal dentro del botón
    paddingVertical: 2, // Reduce el espacio vertical dentro del botón
    marginLeft: 5,
  },
  actionButtonText: {
    fontFamily: "RobotoMono",
    color: "#607FF8", // Texto azul
    fontSize: 12,
    marginLeft: 5,
  },
  videoItemContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    margin: 20,
    backgroundColor: "#ecf0f1",
    borderColor: "#607FF8",
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: "#607FF8",
    shadowOffset: {
      width: 10,
      height: 10, // Ajusta la altura para que la sombra sea más grande verticalmente
    },
    shadowOpacity: 0.8, // Ajusta la opacidad de la sombra
    shadowRadius: 20, // Ajusta el radio de la difuminación de la sombra
    elevation: 10,
  },
  videoItemImage: {
    width: 300,
    height: 200,
    marginBottom: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  videoItemText: {
    fontFamily: "RobotoMono",
    fontSize: 15,
    color: "#607FF8",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#607FF8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#ffffff",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#607FF8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  closeIconList: {
    width: 18,
    height: 18,
  },
});

export default HomeScreen;
