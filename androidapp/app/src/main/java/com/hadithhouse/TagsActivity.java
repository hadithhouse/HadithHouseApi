package com.hadithhouse;

import android.widget.Toast;

import com.hadithhouse.api.HadithTag;
import com.hadithhouse.api.PagedResults;

import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;


public class TagsActivity extends GenericHadithObjectActivity<HadithTag> {
  private ViewObjectBinder.BindingInfo bindingInfo = new ViewObjectBinder.BindingInfo(
      new ViewObjectBinder.BindingPoint("name", R.id.tagEditText)
  );

  @Override
  protected ViewObjectBinder.BindingInfo getBindingIndo() {
    return bindingInfo;
  }

  @Override
  protected int getAddButtonId() {
    return R.id.addTagButton;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.activity_tags;
  }

  @Override
  protected int getListViewId() {
    return R.id.tagsListView;
  }

  @Override
  protected int getMenuId() {
    return R.menu.menu_tags;
  }

  @Override
  protected int getDialogId() {
    return R.layout.dialog_tag;
  }

  @Override
  protected int getSaveButtonId() {
    return R.id.tagDlgSaveButton;
  }

  @Override
  protected int getCancelButtonId() {
    return R.id.tagDlgCancelButton;
  }

  @Override
  protected int getDeleteButtonId() {
    return R.id.tagDlgDeleteButton;
  }

  @Override
  protected HadithTag newObject() {
    return new HadithTag();
  }

  protected void loadObjects() {
    apiClient.getHadithTags(new Callback<PagedResults<HadithTag>>() {
      @Override
      public void success(PagedResults<HadithTag> response, Response httpResponse) {
        setObjects(response.results);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this,
            "Couldn't load tags! Error is: " + error.toString(), Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void addObject(HadithTag object) {
    apiClient.postHadithTag(object, new Callback<HadithTag>() {
      @Override
      public void success(HadithTag tag, Response response) {
        onObjectAdded(tag);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this, "Couldn't add tag. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void saveObject(HadithTag object) {
    apiClient.putHadithTag(object.id, object, new Callback<HadithTag>() {
      @Override
      public void success(HadithTag tag, Response response) {
        onObjectUpdated(tag);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this, "Couldn't save tag. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void deleteObject(final HadithTag object) {
    apiClient.deleteHadithTag(object.id, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        onObjectDeleted(object);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this, "Couldn't delete tag. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }
}
