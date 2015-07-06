package com.hadithhouse;

import android.content.Context;
import android.widget.ArrayAdapter;

import com.hadithhouse.api.Person;

public class PersonsAdapter extends ArrayAdapter<Person> {
  public PersonsAdapter(Context context) {
    super(context, R.layout.adapter_item);
  }
}
