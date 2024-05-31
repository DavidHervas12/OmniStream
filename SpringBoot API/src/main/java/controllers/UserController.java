package main.java.controllers;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.java.model.User;
import main.java.repository.UserRepository;

/**
 * Controller of all related with Users
 */
@RestController
public class UserController {
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private JavaMailSender javaMailSender;

	/**
	 * Registra un nuevo usuario en el sistema.
	 *
	 * @param newUser El nuevo usuario a registrar, proporcionado en el cuerpo de la
	 *                solicitud.
	 * @return Una respuesta HTTP que indica el resultado del registro del usuario.
	 *         Si el usuario se registra correctamente, se devuelve un código de
	 *         estado 201 (CREATED) sin contenido en el cuerpo de la respuesta. Si
	 *         el usuario ya existe en la base de datos, se devuelve un código de
	 *         estado 400 (BAD REQUEST) junto con un mensaje indicando que el
	 *         usuario ya está registrado.
	 */
	@PostMapping("/OmniStream/register")
	ResponseEntity<Object> register(@RequestBody User newUser) {
		Optional<User> existingUser = userRepository.findByUsername(newUser.getUsername());
		if (!existingUser.isPresent()) {
			String validationNum = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6);
			newUser.setValidationNum(validationNum);
			newUser.setValidated(false);
			newUser.setPassword(encriptarHash(newUser.getPassword()));
			userRepository.save(newUser);

			enviarCorreoElectronico(newUser.getEmail(), "Código de verificación",
					"Haz clic en el siguiente enlace para validar tu cuenta en Omnistream \\nClick to verify: http://3.217.102.239:8080/OmniStream/validate?number="
							+ newUser.getValidationNum());

			return ResponseEntity.status(HttpStatus.CREATED).build();
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("El el usuario ya está registrado en la base de datos");
		}
	}

	/**
	 * Valida un usuario registrado en el sistema utilizando un número de validación
	 * único.
	 *
	 * @param number El número de validación único proporcionado como parámetro de
	 *               consulta en la URL.
	 * @return Una respuesta HTTP que indica el resultado de la validación del
	 *         usuario. Si el usuario se valida correctamente, se devuelve un código
	 *         de estado 200 (OK) junto con un mensaje indicando que el usuario se
	 *         ha validado correctamente. Si el número de validación es inválido o
	 *         el usuario ya está validado, se devuelve un código de estado 400 (BAD
	 *         REQUEST) junto con un mensaje de error.
	 */
	@GetMapping("/OmniStream/validate")
	public ResponseEntity<String> validateUser(@RequestParam(value = "number") String number) {
		Optional<User> userOptional = userRepository.findByValidationNum(number);
		User user = userOptional.get();
		if (user != null && !user.isValidated()) {
			user.setValidated(true);
			userRepository.save(user);

			return ResponseEntity.ok("User validated successfully!");
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid validation request.");
		}
	}

	/**
	 * Permite que un usuario inicie sesión en el sistema proporcionando su nombre
	 * de usuario y contraseña.
	 *
	 * @param user El usuario que intenta iniciar sesión, con su nombre de usuario y
	 *             contraseña proporcionados en el cuerpo de la solicitud.
	 * @return Una respuesta HTTP que indica el resultado del intento de inicio de
	 *         sesión. Si el usuario se autentica correctamente y está validado, se
	 *         devuelve un código de estado 200 (OK) junto con los detalles del
	 *         usuario en formato JSON. Si el usuario no está validado, se devuelve
	 *         un código de estado 400 (BAD REQUEST) junto con un mensaje indicando
	 *         que el usuario no está validado. Si el usuario no se encuentra en el
	 *         sistema o las credenciales son incorrectas, se devuelve un código de
	 *         estado 404 (NOT FOUND).
	 */
	@PostMapping("OmniStream/login")
	ResponseEntity<Object> login(@RequestBody User user) {
		Optional<User> authorized = userRepository.findByUsernameAndPassword(user.getUsername(),
				encriptarHash(user.getPassword()));

		if (authorized.isPresent()) {
			User u = authorized.get();
			if (u.isValidated()) {
				StringBuilder strJSON = new StringBuilder("{");
				strJSON.append("\"id\":\"").append(u.getId()).append("\",");
				strJSON.append("\"username\":\"").append(u.getUsername()).append("\",");
				strJSON.append("\"password\":\"").append(u.getPassword()).append("\",");
				strJSON.append("\"email\":\"").append(u.getEmail()).append("\",");
				strJSON.append("\"profilePicture\":\"").append(u.getProfilePicture()).append("\",");
				strJSON.append("\"followers\":\"").append(u.getFollowers()).append("\"");
				strJSON.append("}");
				return ResponseEntity.status(HttpStatus.OK).body(strJSON);
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not validated");
			}
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	/**
	 * Envía un código de recuperación de contraseña al correo electrónico
	 * proporcionado.
	 *
	 * @param email El correo electrónico del usuario para el que se enviará el
	 *              código de recuperación de contraseña.
	 * @return Una respuesta HTTP que indica el resultado del intento de enviar el
	 *         código de recuperación. Si se encuentra un usuario con el correo
	 *         electrónico proporcionado y está validado, se devuelve un código de
	 *         estado 200 (OK) junto con el código de recuperación en formato JSON.
	 *         Si el correo electrónico no está validado, se devuelve un código de
	 *         estado 400 (BAD REQUEST) junto con un mensaje indicando que el correo
	 *         electrónico no está validado. Si no se encuentra ningún usuario con
	 *         el correo electrónico proporcionado, se devuelve un código de estado
	 *         400 (BAD REQUEST) junto con un mensaje indicando que el correo
	 *         electrónico no existe en el sistema.
	 */
	@GetMapping("/OmniStream/sendRecoveryCode")
	public ResponseEntity<String> sendRecoveryCode(@RequestParam(value = "email") String email) {
		Optional<User> userOptional = userRepository.findUserByEmail(email);
		if (userOptional.isPresent()) {
			User user = userOptional.get();
			if (user.isValidated()) {
				String validationNum = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6);

				enviarCorreoElectronico(email, "Código de verificación",
						"Código de recuperación de contraseña: " + validationNum);

				return ResponseEntity.ok("{\"validationNum\": \"" + validationNum + "\"}");
			} else {
				return ResponseEntity.badRequest().body("The email is not validated");
			}
		} else {
			return ResponseEntity.badRequest().body("The email doesn't exist");
		}
	}

	/**
	 * Cambia la contraseña del usuario asociado al correo electrónico
	 * proporcionado.
	 *
	 * @param newPassword La nueva contraseña que se asignará al usuario.
	 * @param email       El correo electrónico del usuario cuya contraseña se
	 *                    cambiará.
	 * @return Una respuesta HTTP que indica el resultado del intento de cambio de
	 *         contraseña. Si se encuentra un usuario con el correo electrónico
	 *         proporcionado y está validado, se devuelve un código de estado 200
	 *         (OK) junto con un mensaje indicando que la contraseña se ha
	 *         actualizado correctamente. Si el correo electrónico no está validado,
	 *         se devuelve un código de estado 400 (BAD REQUEST) junto con un
	 *         mensaje indicando que el correo electrónico no está validado. Si no
	 *         se encuentra ningún usuario con el correo electrónico proporcionado,
	 *         se devuelve un código de estado 400 (BAD REQUEST) junto con un
	 *         mensaje indicando que el correo electrónico no existe en el sistema.
	 */
	@PutMapping("/OmniStream/changePassword")
	public ResponseEntity<String> changePassword(@RequestParam(value = "newPassword") String newPassword,
			@RequestParam(value = "email") String email) {
		Optional<User> userOptional = userRepository.findUserByEmail(email);
		if (userOptional.isPresent()) {
			User user = userOptional.get();
			if (user.isValidated()) {
				user.setPassword(encriptarHash(newPassword));
				userRepository.save(user);
				return ResponseEntity.ok("Password updated successfully");
			} else {
				return ResponseEntity.badRequest().body("The email is not validated");
			}
		} else {
			return ResponseEntity.badRequest().body("The email doesn't exist");
		}
	}

	/**
	 * Modifica la información de un usuario existente.
	 *
	 * @param requestBody Un mapa que contiene los datos actualizados del usuario.
	 *                    Se espera que incluya los siguientes campos: - "id": El ID
	 *                    del usuario que se va a modificar (obligatorio). -
	 *                    "username": El nuevo nombre de usuario (opcional). -
	 *                    "password": La nueva contraseña del usuario (opcional). -
	 *                    "email": El nuevo correo electrónico del usuario
	 *                    (opcional). - "profilePicture": La nueva imagen de perfil
	 *                    del usuario en formato de URL (opcional).
	 * @return Una respuesta HTTP que indica el resultado de la operación de
	 *         modificación. Si se proporciona un ID válido y se encuentra un
	 *         usuario correspondiente, se actualizan los campos especificados y se
	 *         devuelve un código de estado 200 (OK) junto con un mensaje indicando
	 *         que el usuario se ha modificado correctamente. Si no se proporciona
	 *         un ID válido en la solicitud, se devuelve un código de estado 400
	 *         (BAD REQUEST) junto con un mensaje indicando que se requiere un ID en
	 *         el cuerpo de la solicitud. Si no se encuentra ningún usuario con el
	 *         ID proporcionado, se devuelve un código de estado 404 (NOT FOUND)
	 *         junto con un mensaje indicando que el usuario no se encontró en la
	 *         base de datos. Si se proporciona un ID inválido en la solicitud, se
	 *         devuelve un código de estado 400 (BAD REQUEST) junto con un mensaje
	 *         indicando que el formato del ID es inválido.
	 */
	@PutMapping("OmniStream/modifyUser")
	public ResponseEntity<Object> modifyUser(@RequestBody Map<String, Object> requestBody) {
		String id = (String) requestBody.get("id");

		if (id == null || id.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("ID is required in the request body");
		}

		try {
			ObjectId objectId = new ObjectId(id);
			Optional<User> userOptional = userRepository.findById(objectId);
			if (userOptional.isPresent()) {
				User user = userOptional.get();
				user.setUsername((String) requestBody.get("username"));
				user.setPassword((String) requestBody.get("password"));
				user.setEmail((String) requestBody.get("email"));
				user.setProfilePicture((String) requestBody.get("profilePicture"));
				userRepository.save(user);
				return ResponseEntity.status(HttpStatus.OK).body("User modified successfully");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid ID format");
		}
	}

	/**
	 * Envía un correo electrónico al destinatario especificado con el asunto y
	 * cuerpo dados.
	 *
	 * @param destinatario La dirección de correo electrónico del destinatario
	 *                     (obligatorio).
	 * @param asunto       El asunto del correo electrónico (obligatorio).
	 * @param cuerpo       El cuerpo del correo electrónico (obligatorio).
	 */
	private void enviarCorreoElectronico(String destinatario, String asunto, String cuerpo) {
		if (destinatario != null && !destinatario.isEmpty()) {
			SimpleMailMessage mensaje = new SimpleMailMessage();
			mensaje.setTo(destinatario);
			mensaje.setSubject(asunto);
			mensaje.setText(cuerpo);
			javaMailSender.send(mensaje);
		} else {
			System.out.println("La dirección de correo electrónico del destinatario es nula o vacía.");
		}
	}

	/**
	 * Genera un hash MD5 para el texto dado.
	 *
	 * @param text El texto a encriptar (obligatorio).
	 * @return El hash MD5 del texto dado.
	 */
	private String encriptarHash(String text) {
		String hashText = "";
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			byte[] messageDigest = md.digest(text.getBytes());
			BigInteger number = new BigInteger(1, messageDigest);
			hashText = number.toString(16);
			while (hashText.length() < 32) {
				hashText = "0" + hashText;
			}

		} catch (NoSuchAlgorithmException e) {
			System.err.println("Error: Algoritmo MD5 no encontrado.");
		}
		return hashText;
	}

}
