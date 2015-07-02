package com.hadithhouse;

import android.content.Context;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONObject;

public class ApiClient {
  Context context;

  public ApiClient(Context context) {
    this.context = context;
  }

  private final static String getServerUrl() {
    return "http://192.168.1.6/apis/";
  }

  public void getArray(String path, final ArrayCallback callback) {
    RequestQueue queue = Volley.newRequestQueue(context);
    JsonRequest request = new JsonArrayRequest(getServerUrl() + path,
        new Response.Listener<JSONArray>() {
          @Override
          public void onResponse(JSONArray response) {
            callback.onSuccess(response);
          }
        },
        new Response.ErrorListener() {
          @Override
          public void onErrorResponse(VolleyError error) {
            // TODO: Add error handling.
          }
        });
    queue.add(request);
  }

  public void getObject(String path, final ObjectCallback callback) {
    RequestQueue queue = Volley.newRequestQueue(context);
    JsonRequest request = new JsonObjectRequest(getServerUrl() + path,
        new Response.Listener<JSONObject>() {
          @Override
          public void onResponse(JSONObject response) {
            callback.onSuccess(response);
          }
        },
        new Response.ErrorListener() {
          @Override
          public void onErrorResponse(VolleyError error) {

          }
        });
    queue.add(request);
  }

  public void postObject(String path, JSONObject object) {
    RequestQueue queue = Volley.newRequestQueue(context);
    JsonRequest request = new JsonObjectRequest(Request.Method.POST, getServerUrl() + path,
        object,
        new Response.Listener<JSONObject>() {
          @Override
          public void onResponse(JSONObject response) {
          }
        },
        new Response.ErrorListener() {
          @Override
          public void onErrorResponse(VolleyError error) {

          }
        });
    queue.add(request);
  }

  public void patchObject(String path, JSONObject object) {
    RequestQueue queue = Volley.newRequestQueue(context);
    JsonRequest request = new JsonObjectRequest(Request.Method.PATCH, getServerUrl() + path,
        object,
        new Response.Listener<JSONObject>() {
          @Override
          public void onResponse(JSONObject response) {
          }
        },
        new Response.ErrorListener() {
          @Override
          public void onErrorResponse(VolleyError error) {

          }
        });
    queue.add(request);
  }

  public void delete(String path) {
    RequestQueue queue = Volley.newRequestQueue(context);
    new StringRequest(path, new Response.Listener<String>() {
      @Override
      public void onResponse(String response) {

      }
    }, new Response.ErrorListener() {
      @Override
      public void onErrorResponse(VolleyError error) {

      }
    });
  }

  interface ArrayCallback {
    void onSuccess(JSONArray result);
  }

  interface ObjectCallback {
    void onSuccess(JSONObject result);
  }
}
