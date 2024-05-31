package main.java.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

	@Id
	private String id;
	private String validationNum;
	private boolean isValidated;
	private String username;
	private String password;
	private String email;
	private String profilePicture;
	private int followers;
	@DBRef
    private List<Lists> savedLists;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	
	
	public String getValidationNum() {
		return validationNum;
	}

	public void setValidationNum(String validationNum) {
		this.validationNum = validationNum;
	}

	public boolean isValidated() {
		return isValidated;
	}

	public void setValidated(boolean isValidated) {
		this.isValidated = isValidated;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getProfilePicture() {
		return profilePicture;
	}

	public void setProfilePicture(String profilePicture) {
		this.profilePicture = profilePicture;
	}

	public int getFollowers() {
		return followers;
	}

	public void setFollowers(int followers) {
		this.followers = followers;
	}

	public List<Lists> getSavedLists() {
		return savedLists;
	}

	public void setSavedLists(List<Lists> savedLists) {
		this.savedLists = savedLists;
	}
	
}