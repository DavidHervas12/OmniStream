package main.java.repository;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import main.java.model.Lists;
import main.java.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    @Query("{ 'username': ?0, 'password': ?1 }")
    Optional<User> findByUsernameAndPassword(String username, String password);
    
    @Query("{ 'username': ?0 }")
    Optional<User> findByUsername(String username);
    
    @Query("{ 'email': ?0 }")
    Optional<User> findUserByEmail(String email);
    
    Optional<User> findById(ObjectId id);
    
    Optional<User> findByValidationNum(String validationNum);    
}

