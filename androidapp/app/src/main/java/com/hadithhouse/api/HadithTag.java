package com.hadithhouse.api;

import java.util.Date;

public class HadithTag {
  public int id;
  public String name;
  public Date addedOn;
  public Date updatedOn;

  @Override public String toString() {
    return name;
  }
}
