package com.hadithhouse.api;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.internal.bind.DateTypeAdapter;

import java.util.Date;
import java.util.List;

import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.converter.GsonConverter;
import retrofit.http.DELETE;
import retrofit.http.GET;
import retrofit.http.Path;

public interface ApiClient {
  @DELETE("/hadithtags/{name}")
  void deleteHadithTag(@Path("name") String name);

  @DELETE("/hadithtags/{name}")
  void deleteHadithTag(@Path("name") String name, Callback<Void> callback);

  /**
   * Retrieves the list of hadith tags from the server.
   *
   * @return
   */
  @GET("/hadithtags")
  List<HadithTag> getHadithTags();

  /**
   * Asynchronously retrieves the list of hadith tags from the server.
   *
   * @param callback The callback to be executed when the call finishes.
   */
  @GET("/hadithtags")
  void getHadithTags(Callback<List<HadithTag>> callback);

  public static class Factory {
    private final static String getServerUrl() {
      return "http://192.168.1.6/apis";
    }

    public static ApiClient create() {
      // The fields in the retrieved JSON are lower_case_with_underscores, but to follow Java
      // conventions this has to be converted to lowerCaseWithUnderscores. This Gson configuration
      // dictates that.
      Gson gson = new GsonBuilder()
          .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
          .registerTypeAdapter(Date.class, new DateTypeAdapter())
          .create();
      // RL and use the Gson object above.
      RestAdapter adapter = new RestAdapter.Builder()
          .setEndpoint(getServerUrl())
          .setConverter(new GsonConverter(gson))
          .build();
      return adapter.create(ApiClient.class);
    }
  }
}

