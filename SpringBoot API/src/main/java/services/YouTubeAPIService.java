package main.java.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import reactor.core.publisher.Mono;

/**
 * Youtube API service.
 */
@Service
public class YouTubeAPIService {

	private final WebClient webClient;

	@Value("${youtube.api.key}")
	private String apiKey;

	public YouTubeAPIService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("https://www.googleapis.com/youtube/v3").build();
	}

	private String nextPageToken = null; // Variable para almacenar el token de la próxima página
	private String prevPageToken = null;

	/**
	 * Obtiene la primera página de resultados de búsqueda utilizando el servicio
	 * web correspondiente.
	 *
	 * @param searchQuery La consulta de búsqueda para los videos (obligatorio).
	 * @param pageSize    El tamaño de la página de resultados (obligatorio).
	 * @return Un objeto Mono que contiene la respuesta del servicio web en formato
	 *         de cadena.
	 */
	public Mono<String> getFirstPage(String searchQuery, int pageSize) {
		return searchVideos(searchQuery, null, pageSize);
	}

	/**
	 * Obtiene la siguiente página de resultados de búsqueda utilizando el servicio
	 * web correspondiente.
	 *
	 * @param searchQuery   La consulta de búsqueda para los videos (obligatorio).
	 * @param nextPageToken El token de la siguiente página de resultados
	 *                      (obligatorio).
	 * @param pageSize      El tamaño de la página de resultados (obligatorio).
	 * @return Un objeto Mono que contiene la respuesta del servicio web en formato
	 *         de cadena.
	 */
	public Mono<String> getNextPage(String searchQuery, int pageSize) {
		return searchVideos(searchQuery, nextPageToken, pageSize);
	}

	/**
	 * Obtiene la página anterior de resultados de búsqueda utilizando el servicio
	 * web correspondiente.
	 *
	 * @param searchQuery   La consulta de búsqueda para los videos (obligatorio).
	 * @param prevPageToken El token de la página anterior de resultados
	 *                      (obligatorio).
	 * @param pageSize      El tamaño de la página de resultados (obligatorio).
	 * @return Un objeto Mono que contiene la respuesta del servicio web en formato
	 *         de cadena.
	 */
	public Mono<String> getPrevPage(String searchQuery, int pageSize) {
		return searchVideos(searchQuery, prevPageToken, pageSize);
	}

	/**
	 * Realiza una búsqueda de videos utilizando el servicio web correspondiente.
	 *
	 * @param searchQuery La consulta de búsqueda para los videos (obligatorio).
	 * @param pageToken   El token de página para la siguiente página de resultados
	 *                    (opcional).
	 * @param pageSize    El tamaño de la página de resultados (obligatorio).
	 * @return Un objeto Mono que contiene la respuesta del servicio web en formato
	 *         de cadena.
	 */
	private Mono<String> searchVideos(String searchQuery, String pageToken, int pageSize) {
		return webClient.get().uri(uriBuilder -> uriBuilder.path("/search").queryParam("part", "snippet")
				.queryParam("q", searchQuery).queryParam("maxResults", pageSize).queryParam("key", apiKey)
				.queryParam("fields",
						"nextPageToken,prevPageToken,items(id/videoId,snippet/title,snippet/channelTitle,snippet/thumbnails/default/url)")
				.queryParam("pageToken", pageToken).build()).header(HttpHeaders.CONTENT_TYPE, "application/json")
				.retrieve().bodyToMono(String.class).doOnNext(responseBody -> {
					this.nextPageToken = extractNextPageToken(responseBody);
					this.prevPageToken = extractPrevPageToken(responseBody);
				});
	}

	/**
	 * Extrae el token de página siguiente de la respuesta JSON proporcionada.
	 *
	 * @param responseBody La respuesta JSON del servicio web (obligatoria).
	 * @return El token de página siguiente si está presente en la respuesta, de lo
	 *         contrario, devuelve null.
	 */
	private String extractNextPageToken(String responseBody) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode = objectMapper.readTree(responseBody);
			JsonNode nextPageTokenNode = jsonNode.at("/nextPageToken");
			return nextPageTokenNode.isNull() ? null : nextPageTokenNode.asText();
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * Extrae el token de página anterior de la respuesta JSON proporcionada.
	 *
	 * @param responseBody La respuesta JSON del servicio web (obligatoria).
	 * @return El token de página anterior si está presente en la respuesta, de lo
	 *         contrario, devuelve null.
	 */
	private String extractPrevPageToken(String responseBody) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			JsonNode jsonNode = objectMapper.readTree(responseBody);
			JsonNode prevPageTokenNode = jsonNode.at("/prevPageToken");
			return prevPageTokenNode.isNull() ? null : prevPageTokenNode.asText();
		} catch (Exception e) {
			return null;
		}
	}
}
