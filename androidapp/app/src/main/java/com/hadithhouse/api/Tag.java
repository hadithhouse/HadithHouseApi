package com.hadithhouse.api;

import com.hadithhouse.ApiClient;

import java.text.DateFormat;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by rafid on 02/07/15.
 */
public class Tag {
  public String tag;
  public Date addedOn;
  public Date addedBy;

  private final DateFormat iso8601 = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

  public Tag(JSONObject object) throws JSONException, ParseException {
    tag = object.getString("tag");
    addedOn = iso8601.parse(object.getString("added_on"));
    addedBy = iso8601.parse(object.getString("added_on"));
  }

  public void save() {
    HashMap<String, String> map = new HashMap<>();
    map.put("tag", tag);
    new ApiClient(null).postObject("hadithtags/" + tag, new JSONObject(map));
  }

  public void delete() {

  }
}

