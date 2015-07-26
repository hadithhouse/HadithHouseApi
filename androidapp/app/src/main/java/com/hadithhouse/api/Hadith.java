package com.hadithhouse.api;

import java.util.Date;

public class Hadith {
  public int id;
  public String text;
  public int personId;
  public String[] tags;
  public Date addedOn;
  public Date updatedOn;

  @Override public String toString() {
    if (text.length() > 30) {
      return text.substring(0, 30) + "...";
    } else {
      return text;
    }
  }
}
