package main.java.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.java.services.DailyMotionAPIService;
import main.java.services.VimeoAPIService;
import main.java.services.YouTubeAPIService;
import reactor.core.publisher.Mono;

/**
 * Controller of all related with APIS
 */
@RestController
public class ApisController {

	@Autowired
	private YouTubeAPIService youTubeAPIService;

	@Autowired
	private VimeoAPIService vimeoAPIService;

	@Autowired
	private DailyMotionAPIService dailyMotionAPIService;

	/**
	 * Maneja las solicitudes GET para buscar videos en diferentes plataformas de
	 * streaming.
	 *
	 * @param searchQuery   La consulta de búsqueda.
	 * @param page          El número de página para la paginación de resultados
	 *                      (predeterminado: 1).
	 * @param platformParam Parámetro opcional para filtrar la búsqueda por
	 *                      plataforma.
	 * @return Un Mono que emite una ResponseEntity que contiene una respuesta JSON
	 *         con los videos encontrados.
	 * @throws IOException Si ocurre un error de E/S al realizar la búsqueda.
	 */
	@GetMapping("/OmniStream/search")
	public Mono<ResponseEntity<String>> searchVideos(@RequestParam(value = "q") String searchQuery,
			@RequestParam(value = "page", defaultValue = "1") String page,
			@RequestParam(value = "platform", required = false) String platformParam) throws IOException {
		int pageSize = 10;
		int actualPage = Integer.parseInt(page);
		List<String> platforms = new ArrayList<>();
		if (platformParam != null && !platformParam.isEmpty()) {
			platforms = Arrays.asList(platformParam.split(","));
		}

		List<Mono<String>> responses;
		if (platforms != null && !platforms.isEmpty()) {
			responses = platforms.stream()
					.map(platform -> makeRequestForPlatform(searchQuery, platform, actualPage, pageSize))
					.collect(Collectors.toList());
		} else {
			responses = new ArrayList<>();

			Mono<String> youtubeResponse = youTubeAPIService.getFirstPage(searchQuery, pageSize)
					.map(response -> "\"youtube\":" + response.toString());

			if (actualPage > 0) {
				for (int i = 1; i < actualPage; i++) {
					youtubeResponse = youTubeAPIService.getNextPage(searchQuery, pageSize)
							.map(response -> "\"youtube\":" + response.toString());
				}
			}

			responses.add(youtubeResponse);
			responses.add(vimeoAPIService.searchVideos(searchQuery, actualPage, pageSize)
					.map(response -> "\"vimeo\":" + response.toString()));
			responses.add(dailyMotionAPIService.searchVideos(searchQuery, actualPage, pageSize)
					.map(response -> "\"daylimotion\":" + response.toString()));
		}

		List<Mono<String>> errorHandledMonos = responses.stream()
				.map(mono -> mono.onErrorResume(throwable -> Mono.just(""))).collect(Collectors.toList());

		return Mono.zip(errorHandledMonos, objects -> {
			StringBuilder jsonBuilder = new StringBuilder("{");
			for (Object obj : objects) {
				if (obj instanceof String && !((String) obj).isEmpty()) {
					jsonBuilder.append((String) obj).append(",");
				}
			}
			if (jsonBuilder.length() > 1) {
				jsonBuilder.deleteCharAt(jsonBuilder.length() - 1);
			}
			jsonBuilder.append("}");
			return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(jsonBuilder.toString());
		});
	}

	/**
	 * Realiza una solicitud de búsqueda de videos para una plataforma específica.
	 *
	 * @param searchQuery La consulta de búsqueda.
	 * @param platform    La plataforma para la cual se realiza la búsqueda (p. ej.,
	 *                    "youtube", "vimeo", "daylimotion").
	 * @param actualPage  El número de página actual para la paginación de
	 *                    resultados.
	 * @param pageSize    El tamaño de la página para la paginación de resultados.
	 * @return Un Mono que emite una cadena JSON que representa los videos
	 *         encontrados en la plataforma especificada.
	 */
	private Mono<String> makeRequestForPlatform(String searchQuery, String platform, int actualPage, int pageSize) {
		switch (platform.toLowerCase()) {
		case "youtube":
			Mono<String> youtubeResponse = youTubeAPIService.getFirstPage(searchQuery, pageSize)
					.map(response -> "\"youtube\":" + response.toString());

			if (actualPage > 0) {
				for (int i = 1; i < actualPage; i++) {
					youtubeResponse = youTubeAPIService.getNextPage(searchQuery, pageSize)
							.map(response -> "\"youtube\":" + response.toString());
				}
			}
			return youtubeResponse;
		case "vimeo":
			return vimeoAPIService.searchVideos(searchQuery, actualPage, pageSize)
					.map(response -> "\"vimeo\":" + response.toString());
		case "daylimotion":
			return dailyMotionAPIService.searchVideos(searchQuery, actualPage, pageSize)
					.map(response -> "\"daylimotion\":" + response.toString());
		default:
			return Mono.empty();
		}
	}
}
