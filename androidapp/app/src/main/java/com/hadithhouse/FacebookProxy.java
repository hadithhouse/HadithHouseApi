package com.hadithhouse;

import android.os.Bundle;

import com.facebook.AccessToken;
import com.facebook.GraphRequest;
import com.facebook.GraphResponse;

import org.json.JSONObject;

import java.io.IOException;

/**
 * This class is used to communicate with Facebook APIs using an access token.
 * The access token has to be passed to the class, then it will be used for
 * any later invokes.
 *
 * Notice that the communication is done synchronously, so it cannot be used
 * in the UI thread.
 */
public class FacebookProxy {
  private AccessToken token;

  AccessToken getToken() {
    return token;
  }

  public FacebookProxy(AccessToken token) {
    this.token = token;
  }

  /**
   * Retrieves the ID of the current user.
   * @return The ID of the current user or null.
   */
  public String getUserId() {
    if (getToken() == null) {
      // No token.
      return null;
    }
    return getToken().getUserId();
  }

  // TODO: Consider changing the method to static so that we can use it
  // without having to instantiate an object.
  /**
   * Determines whether the token
   * @return
   */
  public boolean isValidToken() {
    try {
      if (this.token == null) {
        return false;
      }
      getUserInfo();
      return true;
    } catch (InvalidTokenException ex) {
      return false;
    }
  }

  /**
   * Retrieves information
   * @throws InterruptedException
   */
  public JSONObject getUserInfo() throws InvalidTokenException {
    GraphRequest request = GraphRequest.newMeRequest(getToken(), null);
    Bundle params = new Bundle();
    params.putString("fields", "id,name,link");
    request.setParameters(params);
    GraphResponse response = request.executeAndWait();

    // Did we get a valid response?
    try {
      int code = response.getConnection().getResponseCode();
      if (code != 200) {
        throw new InvalidTokenException();
      }
    } catch (IOException ex) {
      throw new InvalidTokenException();
    }

    return response.getJSONObject();
  }

  // TODO: Implement
  /*public void getUserFriends() {
    GraphRequest request = new GraphRequest(getToken(), "me/taggable_friends");
    GraphResponse response = request.executeAndWait();

  }*/
}
