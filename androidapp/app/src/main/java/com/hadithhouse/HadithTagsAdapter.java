package com.hadithhouse;

import android.content.Context;
import android.widget.ArrayAdapter;

import com.hadithhouse.R;
import com.hadithhouse.api.HadithTag;

/**
 * Created by rafid on 04/07/15.
 */
public class HadithTagsAdapter extends ArrayAdapter<HadithTag> {
  public HadithTagsAdapter(Context context) {
    super(context, R.layout.adapter_item);
  }
}
