package main.java.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

/**
 * Vimeo API service.
 */
@Service
public class VimeoAPIService {

	private final WebClient webClient;

	@Value("${vimeo.api.client-id}")
	private String clientId;

	@Value("${vimeo.api.client-secret}")
	private String clientSecret;

	@Value("${vimeo.api.access-token}")
	private String accessToken;

	public VimeoAPIService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("https://api.vimeo.com").build();
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
		int offset = (pageNumber - 1) * pageSize;
		return webClient.get()
				.uri(uriBuilder -> uriBuilder.path("/videos").queryParam("query", searchQuery)
						.queryParam("fields", "name,link,pictures.base_link,user.name").queryParam("per_page", pageSize)
						.queryParam("page", pageNumber).queryParam("offset", offset).build())
				.headers(headers -> {
					headers.setBasicAuth(clientId, clientSecret);
					headers.setBearerAuth(accessToken);
				}).retrieve().bodyToMono(String.class);
	}
}
