package com.hadithhouse;

import android.content.Context;
import android.widget.ArrayAdapter;

import com.hadithhouse.api.ApiClient;
import com.hadithhouse.api.HadithTag;

public class HadithTagsAdapter extends ArrayAdapter<HadithTag> {
  public HadithTagsAdapter(Context context) {
    super(context, R.layout.adapter_item);
  }
}
