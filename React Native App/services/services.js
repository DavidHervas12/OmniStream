import { Alert } from "react-native";

const enviarDatos = async (userData) => {
  try {
    

    const response = await fetch(
      "http://3.217.102.239:8080/OmniStream/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};

const iniciarSesion = async (userData) => {
  try {
    

    const response = await fetch("http://3.217.102.239:8080/OmniStream/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const textResponse = await response.text(); // Obtener el texto de la respuesta

    // Puedes hacer algo con el texto de la respuesta si es necesario
    return textResponse;
  } catch (error) {
    console.error("Error during login request:", error);
    // Mostrar una alerta al usuario en caso de error
    Alert.alert(
      "Login Failed",
      "An error occurred during login. Please try again later."
    );
    throw error;
  }
};

const fetchData = async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );
    const data = await response.json();
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};

const actualizarUsuario = async (datosActualizados) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/modifyUser`,
      {
        // Asegúrate de usar el endpoint correcto
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosActualizados), // Ya no necesitas incluir el id aquí, ya que lo pasamos en la URL
      }
    );

    const responseData = await response.text();
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
};

const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`URL_DEL_SERVIDOR/OmniStream/users/${id}`, {
      method: "DELETE",
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

const createLists = async (listsData) => {
  try {
    const response = await fetch(
      "http://3.217.102.239:8080/OmniStream/createList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listsData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.text();
    return responseData;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};

const search = async (searchQuery) => {
  try {
    console.log(searchQuery);
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/search?q=${searchQuery}`
    );
    const responseData = await response.json();
    return responseData; // Devuelve los datos de la búsqueda
  } catch (error) {
    console.error("Error al buscar videos:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
};

const searchLists = async (searchQuery) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/searchLists?keyWord=${searchQuery}`
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error al buscar listas:", error);
    throw error;
  }
};

const addVideoToList = async (video) => {
  try {
    const response = await fetch(
      "http://3.217.102.239:8080/OmniStream/addVideo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(video),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = response.text();
    return responseData;
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    throw error;
  }
};

const getUserLists = async (userId) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/getUserLists?id=${userId}`
    );
    const responseJSON = await response.json();
    
    return responseJSON;
  } catch (error) {
    console.error("Error al buscar listas:", error);
    throw error;
  }
};

const getUserSaveLists = async (userId) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/getSavedLists?id=${userId}`
    );
    const responseData = await response.json();
   
    return responseData;
  } catch (error) {
    console.error("Error al buscar listas:", error);
    throw error;
  }
};

const getVideoLists = async (listId) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/getVideosInList?id=${listId}`
    );
    const responseData = await response.json();
    
    return responseData;
  } catch (error) {
    console.error("Error al buscar listas:", error);
    throw error;
  }
};

const sendRecoveryPassword = async (email) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/sendRecoveryCode?email=${email}`
    );
    const responseData = await response.json();
    
    return responseData.validationNum;
  } catch (error) {
    console.error("Error al buscar listas:", error);
    throw error;
  }
};

const changePassword = async (email, password) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/changePassword?newPassword=${password}&email=${email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.text();
    return responseData;
  } catch (error) {
    console.error("Error al buscar listas:", error);
    throw error;
  }
};

const SaveList = async (userId, listId) => {
  try {
    const response = await fetch(
      `http://3.217.102.239:8080/OmniStream/saveList`,
      {
        
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userId, listId), 
      }
    );
    const responseData = await response.text();
  } catch (error) {
    console.error("Error al guardar lista:", error);
  }
};

export {
  fetchData,
  actualizarUsuario,
  eliminarUsuario,
  createLists,
  search,
  enviarDatos,
  iniciarSesion,
  searchLists,
  getVideoLists,
  getUserLists,
  addVideoToList,
  getUserSaveLists,
  sendRecoveryPassword,
  SaveList,
  changePassword,
};
