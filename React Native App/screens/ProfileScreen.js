import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useFonts,
  RobotoMono_400Regular,
} from "@expo-google-fonts/roboto-mono";
import ModifyScreen from "./ModifyScreen";
import ScreensContext from "./ScreenContext";
import ListCreateModal from "./ListCreateModal";
import ListSaveModal from "./ListSaveModal";
import { getUserLists, getUserSaveLists } from "../services/services";
import i18n from "i18n-js";

const ProfileScreen = () => {
  const { user, isLoggedIn } = useContext(ScreensContext);
  const [fontsLoaded] = useFonts({
    RobotoMono: RobotoMono_400Regular,
  });
  const [isModifyScreenVisible, setIsModifyScreenVisible] = useState(false);
  const [modalListVisible, setModalListVisible] = useState(false);
  const [modalListCreateVisible, setModalListCreateVisible] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedListCreate, setSelectedListCreate] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [savedLists, setSavedLists] = useState([]);
  const { language } = useContext(ScreensContext);
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    setDummyState((prevState) => !prevState);
  }, [language]);


  useEffect(() => {
    const fetchUserLists = async () => {
      try {
        const responseData = await getUserLists(user.id);
        setUserLists(responseData);
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    const fetchSavedLists = async () => {
      try {
        const responseData = await getUserSaveLists(user.id);
        setSavedLists(responseData);
      } catch (error) {
        console.error("Error fetching saved lists:", error);
      }
    };

    fetchUserLists();
    fetchSavedLists();
  }, [user]);

  const openModifyScreen = () => {
    setIsModifyScreenVisible(true);
  };

  const closeModifyScreen = () => {
    setIsModifyScreenVisible(false);
  };

  const openListGuardadasModal = (list) => {
    setSelectedList(list);
    setModalListVisible(true);
  };

  const closeListGuardadasModal = () => {
    setModalListVisible(false);
  };

  const openListCreadasModal = (list) => {
    setSelectedListCreate(list);
    setModalListCreateVisible(true);
  };

  const closeListCreadasModal = () => {
    setModalListCreateVisible(false);
  };

  const img64 = JSON.stringify(user.profilePicture);
  const image64 = `data:image/*;base64,${img64}`;

  return isLoggedIn ? (
    <View style={styles.container}>
      <Image source={{ uri: image64 }} style={styles.profileImage} />
      <View style={styles.userInfoContainer}>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>{user.username}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
    </View>
        <Text style={styles.sectionTitle}>{i18n.t("listsTextProfile")}</Text>
        {console.log(userLists)}
        <View style={styles.flatListContainer}>
          <FlatList
            data={userLists}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openListCreadasModal(item)}>
                <View style={styles.listItemContainer}>
                  <Image
                    source={
                      item.videos && item.videos[0] && item.videos[0].thumbnail
                        ? { uri: item.videos[0].thumbnail }
                        : require("../assets/videoThumbnail.png")
                    }
                    style={styles.listImage}
                  />
                  <Text style={styles.listName}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <Text style={styles.sectionTitle}>{i18n.t("savedTextProfile")}</Text>
        <View style={styles.flatListContainer}>
          <FlatList
            data={savedLists}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openListGuardadasModal(item)}>
                <View style={styles.listItemContainer}>
                  <Image
                    source={
                      item.videos && item.videos[0] && item.videos[0].thumbnail
                        ? { uri: item.videos[0].thumbnail }
                        : require("../assets/videoThumbnail.png")
                    }
                    style={styles.listImage}
                  />
                  <Text style={styles.listName}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <TouchableOpacity onPress={openModifyScreen} style={styles.editButton}>
          <Image
            source={require("../assets/edit.png")}
            style={styles.editIcon}
          />
        </TouchableOpacity>

        {isModifyScreenVisible && (
          <ModifyScreen
            isVisible={isModifyScreenVisible}
            onCloseModal={closeModifyScreen}
          />
        )}

        {modalListVisible && (
          <ListSaveModal
            visible={modalListVisible}
            onClose={closeListGuardadasModal}
            selectedList={selectedList}
          />
        )}

        {modalListCreateVisible && (
          <ListCreateModal
            visible={modalListCreateVisible}
            onClose={closeListCreadasModal}
            selectedList={selectedListCreate}
          />
        )}
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <Text>{i18n.t("profileTextNotLogged")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    marginTop: 50,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#607FF8",
  },
  userInfoContainer: {
    marginLeft: 20,
    justifyContent: "center",
  },
  userName: {
    fontFamily: "RobotoMono",
    fontSize: 18,
    marginBottom: 5,
    color: "white",
    backgroundColor: "#607FF8"
  },
  userEmail: {
    fontFamily: "RobotoMono",
    fontSize: 12,
    color: "white",
    backgroundColor: "#607FF8"
  },
  sectionTitle: {
    fontFamily: "RobotoMono",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 30,
  },
  flatListContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: -100,
    marginRight: 20,
  },
  listItemContainer: {
    alignItems: "center",
    marginRight: 20,
  },
  listImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  listName: {
    fontFamily: "RobotoMono",
    fontSize: 14,
    color: "black",
  },
  editButton: {
    position: "absolute",
    top: 7,
    right: 90,
    backgroundColor: "transparent",
    padding: 20,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  userInfo: {
    backgroundColor: "#607FF8",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 100,
  },
  userName: {
    fontFamily: "RobotoMono",
    fontSize: 18,
    marginBottom: 5,
    color: "white",
  },
  userEmail: {
    fontFamily: "RobotoMono",
    fontSize: 12,
    color: "white",
  },
});

export default ProfileScreen;
