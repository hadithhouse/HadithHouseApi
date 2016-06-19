package com.hadithhouse.api;

import com.facebook.AccessToken;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit.Callback;
import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.converter.GsonConverter;
import retrofit.http.Body;
import retrofit.http.DELETE;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.PUT;
import retrofit.http.Path;

public interface ApiClient {
  /**
   * Posts a new person.
   *
   * @param person The person object to be posted.
   * @return The posted person object retrieved from the server.
   */
  @POST("/persons/")
  void postPerson(@Body Person person, Callback<Person> callback);

  /**
   * Updates an existing person.
   *
   * @param id     The ID of the person to update.
   * @param person The updated person object.
   * @return The updated person object retrieved from the server.
   */
  @PUT("/persons/{id}")
  void putPerson(@Path("id") int id, @Body Person person, Callback<Person> callback);

  /**
   * Asynchronously deletes the person with the given ID.
   *
   * @param id       The ID of the person to delete.
   * @param callback The callback to execute when the call finishes.
   */
  @DELETE("/persons/{id}")
  void deletePerson(@Path("id") int id, Callback<Void> callback);

  /**
   * Asynchronously retrieves the list of persons from the server.
   *
   * @param callback The callback to execute when the call finishes.
   */
  @GET("/persons")
  void getPersons(Callback<PagedResults<Person>> callback);

  /**
   * Posts a new hadith tag.
   *
   * @param tag      The tag object to be posted.
   * @param callback A callback to be executed when the call finishes.
   */
  @POST("/hadithtags/")
  void postHadithTag(@Body HadithTag tag, Callback<HadithTag> callback);

  /**
   * Updates an existing tag.
   *
   * @param id  The ID of the tag to update.
   * @param tag The updated tag object.
   * @return The updated tag object retrieved from the server.
   */
  @PUT("/hadithtags/{id}")
  void putHadithTag(@Path("id") int id, @Body HadithTag tag, Callback<HadithTag> callback);

  /**
   * Asynchronously deletes the given tag.
   *
   * @param id       The ID of the tag to delete.
   * @param callback The callback to execute when the call finishes.
   */
  @DELETE("/hadithtags/{id}")
  void deleteHadithTag(@Path("id") int id, Callback<Void> callback);

  /**
   * Asynchronously retrieves the list of hadith tags from the server.
   *
   * @param callback The callback to execute when the call finishes.
   */
  @GET("/hadithtags")
  void getHadithTags(Callback<PagedResults<HadithTag>> callback);

  /**
   * Posts a new hadith.
   *
   * @param hadith   The hadith object to be posted.
   * @param callback A callback to be executed when the call finishes.
   */
  @POST("/hadiths/")
  void postHadith(@Body Hadith hadith, Callback<Hadith> callback);

  /**
   * Updates an existing hadith.
   *
   * @param id     The ID of the hadith to update.
   * @param hadith The updated hadith object.
   * @return The updated hadith object retrieved from the server.
   */
  @PUT("/hadiths/{id}")
  void putHadith(@Path("id") int id, @Body Hadith hadith, Callback<Hadith> callback);

  /**
   * Asynchronously deletes the given hadith.
   *
   * @param callback The callback to execute when the call finishes.
   * @paraidme The ID of the hadith to delete.
   */
  @DELETE("/hadiths/{id}")
  void deleteHadith(@Path("id") int id, Callback<Void> callback);

  /**
   * Asynchronously retrieves the list of hadiths from the server.
   *
   * @param callback The callback to execute when the call finishes.
   */
  @GET("/hadiths")
  void getHadiths(Callback<PagedResults<Hadith>> callback);


  class Factory {
    private final static String getServerUrl() {
      //return "http://192.168.1.6/apis";
      return "http://www.hadithhouse-dev.net/apis";
    }

    public static ApiClient create() {
      RequestInterceptor fbTokenAdder = new RequestInterceptor() {
        @Override
        public void intercept(RequestFacade request) {
          request.addQueryParam("fb_token", AccessToken.getCurrentAccessToken().getToken());
        }
      };

      // The fields in the retrieved JSON are lower_case_with_underscores, but to follow Java
      // conventions this has to be converted to lowerCaseWithUnderscores. This Gson configuration
      // dictates that.
      Gson gson = new GsonBuilder()
          .setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
          .serializeNulls()
          .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
          .create();
      // RL and use the Gson object above.
      RestAdapter adapter = new RestAdapter.Builder()
          .setEndpoint(getServerUrl())
          .setConverter(new GsonConverter(gson))
          .setRequestInterceptor(fbTokenAdder)
          .setLogLevel(RestAdapter.LogLevel.FULL)
          .build();
      return adapter.create(ApiClient.class);
    }
  }
}

