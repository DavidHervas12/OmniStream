package main.java.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import main.java.model.Lists;
import main.java.model.Video;

public interface VideoRepository extends MongoRepository<Video, String>{
	
	Optional<Video> findById(ObjectId id);
	
    @Query("{'listId': ?0}")
    List<Video> findAllByListId(String listId);
}
