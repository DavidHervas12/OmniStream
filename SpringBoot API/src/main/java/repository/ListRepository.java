package main.java.repository;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import main.java.model.Lists;

public interface ListRepository extends MongoRepository<Lists, String> {
	@Query("{ 'title': ?0 }")
	Optional<Lists> findByTitle(String title);
	
    @Query("{'idUser': ?0}")
    List<Lists> findAllByUserId(String idUser);

	@Query("{ 'idUser': ?0 }")
	Optional<Lists> findByUserId(String idUser);

	Optional<Lists> findById(ObjectId id);
	
    @Query("{'title': {$regex : ?0, $options: 'i'}}")
    List<Lists> findByTitleContaining(String keyword);
    
    @Query("{ '_id': ?0, 'videos._id': ?1 }")
	Optional<Lists> findByListIdAndVideoId(ObjectId listId, ObjectId videoId);
}
