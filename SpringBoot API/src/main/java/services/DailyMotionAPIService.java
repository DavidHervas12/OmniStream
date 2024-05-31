package main.java.services;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

/**
 * Dailymotion API service.
 */
@Service
public class DailyMotionAPIService {

	private final WebClient webClient;

	public DailyMotionAPIService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("https://api.dailymotion.com").build();
	}

	/**
	 * Busca videos utilizando el servicio web correspondiente.
	 *
	 * @param searchQuery La consulta de búsqueda para los videos (obligatorio).
	 * @param pageNumber  El número de página de resultados (obligatorio).
	 * @param pageSize    El tamaño de la página de resultados (obligatorio).
	 * @return Un objeto Mono que contiene la respuesta del servicio web en formato
	 *         de cadena.
	 */
	public Mono<String> searchVideos(String searchQuery, int pageNumber, int pageSize) {

		return webClient.get()
				.uri(uriBuilder -> uriBuilder.path("/videos").queryParam("search", searchQuery)
						.queryParam("fields", "id,title,url,thumbnail_360_url,owner.screenname")
						.queryParam("limit", pageSize).queryParam("page", pageNumber).build())
				.retrieve().bodyToMono(String.class);
	}
}
