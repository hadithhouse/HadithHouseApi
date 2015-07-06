package com.hadithhouse.api;

import java.util.Date;

public class Person {
  public int id;
  public String title;
  public String displayName;
  public String fullName;
  public String ref;
  public String briefDesc;
  public Integer birthYear;
  public Integer birthMonth;
  public Integer birthDay;
  public Integer deathYear;
  public Integer deathMonth;
  public Integer deathDay;
  public Date addedOn;
  public Date updatedOn;

  @Override public String toString() {
    if (displayName != null && !displayName.isEmpty())
      return displayName;
    else
      return fullName;
  }
}
