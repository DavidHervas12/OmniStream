package main.java.controllers;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.java.model.Lists;
import main.java.model.User;
import main.java.model.Video;
import main.java.repository.ListRepository;
import main.java.repository.UserRepository;
import main.java.repository.VideoRepository;

/**
 * Controller of all related with lists
 */
@RestController
public class ListController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ListRepository listRepository;

	@Autowired
	private VideoRepository videoRepository;

	/**
	 * Crea una nueva lista de reproducción.
	 *
	 * @param newList La nueva lista de reproducción a crear, representada como un
	 *                objeto de tipo {@code Lists}.
	 * @return Una respuesta HTTP que indica el estado de la operación de creación
	 *         de la lista de reproducción. Si la lista se crea correctamente, se
	 *         devuelve un código de estado 201 (CREATED) junto con el ID de la
	 *         lista creada. En caso de error, se devuelve un código de estado y un
	 *         mensaje explicativo.
	 */
	@PostMapping("/OmniStream/createList")
	public ResponseEntity<Object> create(@RequestBody Lists newList) {
		Lists savedList = listRepository.save(newList);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedList.getId());
	}

	/**
	 * Elimina una lista de reproducción existente.
	 *
	 * @param requestBody Un mapa que contiene los datos de la solicitud, donde se
	 *                    espera que haya una clave "id" que representa el ID de la
	 *                    lista de reproducción a eliminar.
	 * @return Una respuesta HTTP que indica el resultado de la operación de
	 *         eliminación de la lista de reproducción. Si la lista se elimina
	 *         correctamente, se devuelve un código de estado 204 (NO CONTENT). Si
	 *         el ID proporcionado no corresponde a ninguna lista de reproducción
	 *         existente, se devuelve un código de estado 404 (NOT FOUND). Si la
	 *         solicitud no contiene un ID válido o está mal formada, se devuelve un
	 *         código de estado 400 (BAD REQUEST) junto con un mensaje descriptivo.
	 */
	@DeleteMapping("/OmniStream/deleteList")
	public ResponseEntity<Object> deleteList(@RequestBody Map<String, String> requestBody) {
		String id = requestBody.get("id");
		if (id == null || id.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID is required in the request body");
		}

		try {
			ObjectId objectId = new ObjectId(id);
			Optional<Lists> list = listRepository.findById(objectId);
			if (list.isPresent()) {
				listRepository.delete(list.get());
				return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID format");
		}
	}

	/**
	 * Modifica una lista de reproducción existente.
	 *
	 * @param requestBody Un mapa que contiene los datos de la solicitud, donde se
	 *                    espera que haya una clave "id" que representa el ID de la
	 *                    lista de reproducción a modificar, y opcionalmente una
	 *                    clave "title" que representa el nuevo título de la lista.
	 * @return Una respuesta HTTP que indica el resultado de la operación de
	 *         modificación de la lista de reproducción. Si la lista se modifica
	 *         correctamente, se devuelve un código de estado 200 (OK) junto con un
	 *         mensaje indicando que la lista se modificó con éxito. Si el ID
	 *         proporcionado no corresponde a ninguna lista de reproducción
	 *         existente, se devuelve un código de estado 404 (NOT FOUND) junto con
	 *         un mensaje indicando que la lista no existe. Si la solicitud no
	 *         contiene un ID válido o está mal formada, se devuelve un código de
	 *         estado 400 (BAD REQUEST) junto con un mensaje descriptivo.
	 */
	@PutMapping("OmniStream/modifyList")
	public ResponseEntity<Object> modifyList(@RequestBody Map<String, Object> requestBody) {
		String id = (String) requestBody.get("id");
		if (id == null || id.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID is required in the request body");
		}

		try {
			ObjectId objectId = new ObjectId(id);
			Optional<Lists> savedListOptional = listRepository.findById(objectId);
			if (savedListOptional.isPresent()) {
				Lists savedList = savedListOptional.get();
				savedList.setTitle((String) requestBody.get("title"));
				listRepository.save(savedList);
				return ResponseEntity.status(HttpStatus.OK).body("List modified successfully");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La lista no existe");
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID format");
		}
	}

	/**
	 * Guarda una lista de reproducción en la lista de reproducciones guardadas de
	 * un usuario.
	 *
	 * @param requestBody Un mapa que contiene los datos de la solicitud, donde se
	 *                    espera que haya claves "userId" y "listId" que representan
	 *                    respectivamente el ID del usuario y el ID de la lista de
	 *                    reproducción a guardar.
	 * @return Una respuesta HTTP que indica el resultado de la operación de guardar
	 *         la lista de reproducción. Si la lista se guarda correctamente, se
	 *         devuelve un código de estado 200 (OK) junto con un mensaje indicando
	 *         que la lista se guardó con éxito. Si el ID del usuario o de la lista
	 *         no corresponde a ninguna entidad existente, se devuelve un código de
	 *         estado 404 (NOT FOUND) junto con un mensaje indicando que el usuario
	 *         o la lista no se encontró. Si la lista ya está guardada por el
	 *         usuario, se devuelve un código de estado 400 (BAD REQUEST) junto con
	 *         un mensaje indicando que la lista ya está guardada por el usuario. Si
	 *         la solicitud no contiene los parámetros requeridos o están mal
	 *         formados, se devuelve un código de estado 400 (BAD REQUEST) junto con
	 *         un mensaje descriptivo.
	 */
	@PutMapping("OmniStream/saveList")
	public ResponseEntity<Object> saveList(@RequestBody Map<String, Object> requestBody) {
		String userId = (String) requestBody.get("userId");
		String listId = (String) requestBody.get("listId");

		if (userId == null || listId == null || userId.isEmpty() || listId.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Both userId and listId are required in the request body");
		}

		try {
			ObjectId userObjectId = new ObjectId(userId);
			ObjectId listObjectId = new ObjectId(listId);

			Optional<User> userOptional = userRepository.findById(userObjectId);
			Optional<Lists> listOptional = listRepository.findById(listObjectId);

			if (userOptional.isEmpty() || listOptional.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or List not found");
			}

			Lists list = listOptional.get();
			User user = userOptional.get();

			if (user.getSavedLists().contains(list)) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("List already saved by the user");
			}

			user.getSavedLists().add(list);
			userRepository.save(user);

			return ResponseEntity.status(HttpStatus.OK).body("List saved successfully");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID format");
		}
	}

	/**
	 * Agrega un nuevo video a una lista de reproducción existente.
	 *
	 * @param newVideo El objeto de video que se va a agregar a la lista de
	 *                 reproducción.
	 * @return Una respuesta HTTP que indica el resultado de la operación de agregar
	 *         el video a la lista de reproducción. Si la lista de reproducción
	 *         existe y el video se agrega correctamente, se devuelve un código de
	 *         estado 200 (OK) junto con un mensaje indicando que el video se agregó
	 *         a la lista y se guardó correctamente. Si el ID de la lista de
	 *         reproducción no corresponde a ninguna entidad existente, se devuelve
	 *         un código de estado 404 (NOT FOUND) junto con un mensaje indicando
	 *         que la lista no se encontró. Si el formato del ID proporcionado es
	 *         inválido, se devuelve un código de estado 400 (BAD REQUEST) junto con
	 *         un mensaje indicando que el formato del ID es inválido.
	 */
	@PostMapping("OmniStream/addVideo")
	public ResponseEntity<Object> addVideoToList(@RequestBody Video newVideo) {
		try {
			ObjectId listObjectId = new ObjectId(newVideo.getListId());
			Optional<Lists> listOptional = listRepository.findById(listObjectId);

			if (listOptional.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List not found");
			}

			videoRepository.save(newVideo);

			Lists list = listOptional.get();
			list.getVideos().add(newVideo);
			listRepository.save(list);

			return ResponseEntity.status(HttpStatus.OK).body("Video added to list and saved successfully");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID format");
		}
	}

	/**
	 * Obtiene las listas de reproducción de un usuario específico.
	 *
	 * @param userId El ID del usuario del que se desean obtener las listas de
	 *               reproducción.
	 * @return Una respuesta HTTP que contiene las listas de reproducción del
	 *         usuario en formato JSON. Si se encuentra al menos una lista de
	 *         reproducción para el usuario especificado, se devuelve un código de
	 *         estado 200 (OK) junto con un cuerpo de respuesta que contiene las
	 *         listas de reproducción en formato JSON. Si no se encuentra ninguna
	 *         lista de reproducción para el usuario especificado, se devuelve un
	 *         código de estado 200 (OK) junto con un cuerpo de respuesta vacío.
	 */
	@GetMapping("OmniStream/getUserLists")
	public ResponseEntity<String> getUserLists(@RequestParam(value = "id") String userId) {
		List<Lists> userLists = listRepository.findAllByUserId(userId);

		StringBuilder strJSON = new StringBuilder("[");
		for (Lists userList : userLists) {
			strJSON.append("{");
			strJSON.append("\"id\":\"").append(userList.getId()).append("\",");
			strJSON.append("\"title\":\"").append(userList.getTitle()).append("\",");
			strJSON.append("\"videos\":[");

			List<Video> listaVideos = videoRepository.findAllByListId(userList.getId());
			for (Video video : listaVideos) {
				strJSON.append("{");
				strJSON.append("\"title\":\"").append(video.getTitle()).append("\",");
				strJSON.append("\"channel\":\"").append(video.getChannel()).append("\",");
				strJSON.append("\"link\":\"").append(video.getLink()).append("\",");
				strJSON.append("\"thumbnail\":\"").append(video.getThumbnail()).append("\",");
				strJSON.append("\"listId\":\"").append(video.getListId()).append("\"");
				strJSON.append("},");
			}
			if (!listaVideos.isEmpty()) {
				strJSON.deleteCharAt(strJSON.length() - 1);
			}

			strJSON.append("],");
			strJSON.append("\"likes\":").append(userList.getLikes()).append(",");
			strJSON.append("\"dislikes\":").append(userList.getDislikes());
			strJSON.append("},");
		}
		if (!userLists.isEmpty()) {
			strJSON.deleteCharAt(strJSON.length() - 1);
		}
		strJSON.append("]");

		return ResponseEntity.status(HttpStatus.OK).body(strJSON.toString());
	}

	/**
	 * Obtiene las listas de reproducción guardadas por un usuario específico.
	 *
	 * @param userId El ID del usuario del que se desean obtener las listas de
	 *               reproducción guardadas.
	 * @return Una respuesta HTTP que contiene las listas de reproducción guardadas
	 *         por el usuario en formato JSON. Si se encuentra al menos una lista de
	 *         reproducción guardada para el usuario especificado, se devuelve un
	 *         código de estado 200 (OK) junto con un cuerpo de respuesta que
	 *         contiene las listas de reproducción guardadas en formato JSON. Si no
	 *         se encuentra ninguna lista de reproducción guardada para el usuario
	 *         especificado, se devuelve un código de estado 200 (OK) junto con un
	 *         cuerpo de respuesta vacío. Si no se encuentra el usuario
	 *         especificado, se devuelve un código de estado 404 (NOT FOUND) junto
	 *         con un cuerpo de respuesta indicando que el usuario no ha sido
	 *         encontrado.
	 */
	@GetMapping("OmniStream/getSavedLists")
	public ResponseEntity<String> getSavedLists(@RequestParam(value = "id") String userId) {

		Optional<User> userOptional = userRepository.findById(new ObjectId(userId));
		if (userOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		User user = userOptional.get();
		List<Lists> savedLists = user.getSavedLists();

		StringBuilder strJSON = new StringBuilder("[");
		for (Lists savedList : savedLists) {
			strJSON.append("{");
			strJSON.append("\"id\":\"").append(savedList.getId()).append("\",");
			strJSON.append("\"title\":\"").append(savedList.getTitle()).append("\",");
			strJSON.append("\"videos\":[");
			List<Video> listaVideos = videoRepository.findAllByListId(savedList.getId());
			for (Video video : listaVideos) {
				strJSON.append("{");
				strJSON.append("\"title\":\"").append(video.getTitle()).append("\",");
				strJSON.append("\"channel\":\"").append(video.getChannel()).append("\",");
				strJSON.append("\"link\":\"").append(video.getLink()).append("\",");
				strJSON.append("\"thumbnail\":\"").append(video.getThumbnail()).append("\",");
				strJSON.append("\"listId\":\"").append(video.getListId()).append("\"");
				strJSON.append("},");
			}
			if (!listaVideos.isEmpty()) {
				strJSON.deleteCharAt(strJSON.length() - 1);
			}
			strJSON.append("],");
			strJSON.append("\"likes\":").append(savedList.getLikes()).append(",");
			strJSON.append("\"dislikes\":").append(savedList.getDislikes());
			strJSON.append("},");
		}

		if (!savedLists.isEmpty()) {
			strJSON.deleteCharAt(strJSON.length() - 1);
		}
		strJSON.append("]");

		return ResponseEntity.status(HttpStatus.OK).body(strJSON.toString());
	}

	/**
	 * Obtiene los videos contenidos en una lista de reproducción específica.
	 *
	 * @param listId El ID de la lista de reproducción de la que se desean obtener
	 *               los videos.
	 * @return Una respuesta HTTP que contiene los videos de la lista de
	 *         reproducción especificada en formato JSON. Si se encuentran videos en
	 *         la lista de reproducción especificada, se devuelve un código de
	 *         estado 200 (OK) junto con un cuerpo de respuesta que contiene los
	 *         videos en formato JSON. Si la lista de reproducción especificada no
	 *         contiene ningún video, se devuelve un código de estado 200 (OK) junto
	 *         con un cuerpo de respuesta vacío.
	 */
	@GetMapping("OmniStream/getVideosInList")
	public ResponseEntity<String> getVideosInList(@RequestParam(value = "id") String listId) {

		StringBuilder strJSON = new StringBuilder("[");
		List<Video> listaVideos = videoRepository.findAllByListId(listId);
		for (Video video : listaVideos) {
			strJSON.append("{");
			strJSON.append("\"title\":\"").append(video.getTitle()).append("\",");
			strJSON.append("\"channel\":\"").append(video.getChannel()).append("\",");
			strJSON.append("\"link\":\"").append(video.getLink()).append("\",");
			strJSON.append("\"thumbnail\":\"").append(video.getThumbnail()).append("\",");
			strJSON.append("\"listId\":\"").append(video.getListId()).append("\"");
			strJSON.append("},");
		}
		if (!listaVideos.isEmpty()) {
			strJSON.deleteCharAt(strJSON.length() - 1);
		}
		strJSON.append("]");

		return ResponseEntity.status(HttpStatus.OK).body(strJSON.toString());
	}

	/**
	 * Busca listas de reproducción que contengan una palabra clave en su título.
	 *
	 * @param keyWord La palabra clave utilizada para buscar listas de reproducción
	 *                por título.
	 * @return Una respuesta HTTP que contiene las listas de reproducción que
	 *         coinciden con la palabra clave en formato JSON. Si se encuentran
	 *         listas de reproducción que coinciden con la palabra clave, se
	 *         devuelve un código de estado 200 (OK) junto con un cuerpo de
	 *         respuesta que contiene las listas de reproducción en formato JSON. Si
	 *         no se encuentran listas de reproducción que coincidan con la palabra
	 *         clave, se devuelve un código de estado 200 (OK) junto con un cuerpo
	 *         de respuesta vacío.
	 */
	@GetMapping("OmniStream/searchLists")
	public ResponseEntity<String> searchLists(@RequestParam(value = "keyWord") String keyWord) {

		List<Lists> searchedList = listRepository.findByTitleContaining(keyWord);

		StringBuilder strJSON = new StringBuilder("[");
		for (Lists list : searchedList) {
			strJSON.append("{");
			strJSON.append("\"id\":\"").append(list.getId()).append("\",");
			strJSON.append("\"title\":\"").append(list.getTitle()).append("\",");
			strJSON.append("\"videos\":[");
			List<Video> listaVideos = videoRepository.findAllByListId(list.getId());
			for (Video video : listaVideos) {
				strJSON.append("{");
				strJSON.append("\"title\":\"").append(video.getTitle()).append("\",");
				strJSON.append("\"channel\":\"").append(video.getChannel()).append("\",");
				strJSON.append("\"link\":\"").append(video.getLink()).append("\",");
				strJSON.append("\"thumbnail\":\"").append(video.getThumbnail()).append("\",");
				strJSON.append("\"listId\":\"").append(video.getListId()).append("\"");
				strJSON.append("},");
			}
			if (!listaVideos.isEmpty()) {
				strJSON.deleteCharAt(strJSON.length() - 1);
			}
			strJSON.append("],");
			strJSON.append("\"likes\":").append(list.getLikes()).append(",");
			strJSON.append("\"dislikes\":").append(list.getDislikes());
			strJSON.append("},");
		}

		if (!searchedList.isEmpty()) {
			strJSON.deleteCharAt(strJSON.length() - 1);
		}
		strJSON.append("]");

		return ResponseEntity.status(HttpStatus.OK).body(strJSON.toString());
	}

	/**
	 * Elimina una lista de reproducción guardada por un usuario.
	 *
	 * @param requestBody Un mapa que contiene los identificadores de usuario
	 *                    (userId) y de lista (listId) en el cuerpo de la solicitud.
	 * @return Una respuesta HTTP que indica el resultado de la eliminación de la
	 *         lista de reproducción guardada. Si la lista de reproducción guardada
	 *         se elimina correctamente, se devuelve un código de estado 200 (OK)
	 *         junto con un mensaje indicando el éxito de la operación. Si el
	 *         usuario o la lista de reproducción no se encuentran, se devuelve un
	 *         código de estado 404 (NOT FOUND) junto con un mensaje indicando que
	 *         el usuario o la lista de reproducción guardada no se encontraron.
	 */
	@PutMapping("/OmniStream/deleteSavedList")
	public ResponseEntity<Object> deleteSavedList(@RequestBody Map<String, String> requestBody) {

		String userId = requestBody.get("userId");
		String listId = requestBody.get("listId");

		Optional<User> userOptional = userRepository.findById(userId);

		if (userOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}
		User user = userOptional.get();

		List<Lists> savedLists = user.getSavedLists();

		boolean found = false;
		Iterator<Lists> iterator = savedLists.iterator();
		while (iterator.hasNext()) {
			Lists savedList = iterator.next();
			if (savedList.getId().equals(listId)) {
				iterator.remove();
				found = true;
				break;
			}
		}
		if (!found) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Saved list not found for the user");
		}

		userRepository.save(user);
		return ResponseEntity.status(HttpStatus.OK).body("Saved list deleted successfully");
	}

	/**
	 * Elimina un video de una lista de reproducción.
	 *
	 * @param requestBody Un mapa que contiene los identificadores de usuario
	 *                    (userId), de lista (listId) y de video (videoId) en el
	 *                    cuerpo de la solicitud.
	 * @return Una respuesta HTTP que indica el resultado de la eliminación del
	 *         video de la lista de reproducción. Si el video se elimina
	 *         correctamente de la lista de reproducción, se devuelve un código de
	 *         estado 200 (OK) junto con un mensaje indicando el éxito de la
	 *         operación. Si la lista de reproducción o el video no se encuentran,
	 *         se devuelve un código de estado 404 (NOT FOUND) junto con un mensaje
	 *         indicando que la lista de reproducción o el video no se encontraron.
	 */
	@PutMapping("/OmniStream/deleteVideoFromList")
	public ResponseEntity<Object> deleteVideoFromList(@RequestBody Map<String, String> requestBody) {
		String userId = requestBody.get("userId");
		String listId = requestBody.get("listId");
		String videoId = requestBody.get("videoId");
		ObjectId videoObjectId = new ObjectId(videoId);
		ObjectId listObjectId = new ObjectId(listId);

		Optional<Lists> listOptional = listRepository.findById(listObjectId);
		if (listOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("List not found");
		}

		Lists list = listOptional.get();

		List<Video> videoList = list.getVideos();

		boolean found = false;
		Iterator<Video> iterator = videoList.iterator();
		while (iterator.hasNext()) {
			Video video = iterator.next();
			if (video.getId().equals(videoId)) {
				iterator.remove();
				found = true;
				break;
			}
		}
		if (!found) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Video not found in the list");
		}

		listRepository.save(list);

		return ResponseEntity.status(HttpStatus.OK).body("Video deleted from the list successfully");
	}

}
