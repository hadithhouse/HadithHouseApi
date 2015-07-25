package com.hadithhouse;

import android.content.Context;
import android.widget.ArrayAdapter;

import com.hadithhouse.api.Person;

public class GenericHadithObjectAdapter<T> extends ArrayAdapter<T> {
  public GenericHadithObjectAdapter(Context context) {
    super(context, R.layout.adapter_item);
  }
}
