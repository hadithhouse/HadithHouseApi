package com.hadithhouse.views;

import android.content.Context;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.widget.ArrayAdapter;
import android.widget.MultiAutoCompleteTextView;

import com.hadithhouse.R;
import com.hadithhouse.api.ApiClient;
import com.hadithhouse.api.HadithTag;
import com.hadithhouse.api.PagedResults;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class TagTextView extends MultiAutoCompleteTextView {
  private ArrayAdapter<String> tagsAdapter;

  public TagTextView(Context context) {
    super(context);
    initialize();
  }

  public TagTextView(Context context, AttributeSet attrs) {
    super(context, attrs);
    initialize();
  }

  public TagTextView(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
    initialize();
  }

  private void initialize() {
    tagsAdapter = new ArrayAdapter<>(getContext(), R.layout.adapter_item);
    setAdapter(tagsAdapter);
    setTokenizer(new DashTokenizer());

    if (isInEditMode()) {
      tagsAdapter.add("tag1");
      tagsAdapter.add("tag2");
      tagsAdapter.add("tag3");
    } else {
      // Asynchronously load tags.
      // TODO: We shouldn't be loading the whole tag objects, just names are enough, but this
      // requires implementation on the server side.
      ApiClient api = ApiClient.Factory.create();
      api.getHadithTags(new Callback<PagedResults<HadithTag>>() {
        @Override
        public void success(PagedResults<HadithTag> response, Response httpResponse) {
          for (HadithTag tag : response.results) {
            tagsAdapter.add(tag.name);
          }
        }

        @Override
        public void failure(RetrofitError error) {
          // TODO: Show error message.
        }
      });
    }
  }

  /**
   * Used for lists where the items are separated by a dash
   */
  public static class DashTokenizer implements Tokenizer {
    public int findTokenStart(CharSequence text, int cursor) {
      int i = cursor;

      while (i > 0 && text.charAt(i - 1) != '-') {
        i--;
      }
      while (i < cursor && text.charAt(i) == ' ') {
        i++;
      }

      return i;
    }

    public int findTokenEnd(CharSequence text, int cursor) {
      int i = cursor;
      int len = text.length();

      while (i < len) {
        if (text.charAt(i) == '-') {
          return i;
        } else {
          i++;
        }
      }

      return len;
    }

    public CharSequence terminateToken(CharSequence text) {
      int i = text.length();

      while (i > 0 && text.charAt(i - 1) == ' ') {
        i--;
      }

      if (i > 0 && text.charAt(i - 1) == '-') {
        return text;
      } else {
        if (text instanceof Spanned) {
          SpannableString sp = new SpannableString(text + " - ");
          TextUtils.copySpansFrom((Spanned) text, 0, text.length(),
              Object.class, sp, 0);
          return sp;
        } else {
          return text + " - ";
        }
      }
    }
  }
}
