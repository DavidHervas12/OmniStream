package main.java.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import main.java.model.Comments;

public interface CommentsRepository extends MongoRepository<Comments, String>{

}
