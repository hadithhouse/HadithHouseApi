package com.hadithhouse;

import android.widget.Toast;

import com.hadithhouse.api.Hadith;
import com.hadithhouse.api.PagedResults;

import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class HadithsActivity extends GenericHadithObjectActivity<Hadith> {
  private ViewObjectBinder.BindingInfo bindingInfo = new ViewObjectBinder.BindingInfo(
      new ViewObjectBinder.BindingPoint("text", R.id.hadithBodyEditText),
      new ViewObjectBinder.BindingPoint("tags", R.id.tagsTextView)
  );

  @Override
  protected ViewObjectBinder.BindingInfo getBindingIndo() {
    return bindingInfo;
  }

  @Override
  protected int getAddButtonId() {
    return R.id.addHadithButton;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.activity_hadiths;
  }

  @Override
  protected int getListViewId() {
    return R.id.hadithsListView;
  }

  @Override
  protected int getMenuId() {
    return R.menu.menu_hadiths;
  }

  @Override
  protected int getDialogId() {
    return R.layout.dialog_hadith;
  }

  @Override
  protected int getSaveButtonId() {
    return R.id.hadithDlgSaveButton;
  }

  @Override
  protected int getCancelButtonId() {
    return R.id.hadithDlgCancelButton;
  }

  @Override
  protected int getDeleteButtonId() {
    return R.id.hadithDlgDeleteButton;
  }

  @Override
  protected Hadith newObject() {
    return new Hadith();
  }

  protected void loadObjects() {
    apiClient.getHadiths(new Callback<PagedResults<Hadith>>() {
      @Override
      public void success(PagedResults<Hadith> response, Response httpResponse) {
        setObjects(response.results);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(HadithsActivity.this,
            "Couldn't load hadiths! Error is: " + error.toString(), Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void addObject(Hadith object) {
    // Hard coded to prophet Mohammed (pbuh) until we support choosing the person.
    object.person = 1;
    apiClient.postHadith(object, new Callback<Hadith>() {
      @Override
      public void success(Hadith hadith, Response response) {
        onObjectAdded(hadith);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(HadithsActivity.this, "Couldn't add hadith. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void saveObject(Hadith object) {
    // Hard coded to prophet Mohammed (pbuh) until we support choosing the person.
    object.person = 1;
    apiClient.putHadith(object.id, object, new Callback<Hadith>() {
      @Override
      public void success(Hadith person, Response response) {
        onObjectUpdated(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(HadithsActivity.this, "Couldn't save hadith. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void deleteObject(final Hadith object) {
    apiClient.deleteHadith(object.id, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        onObjectDeleted(object);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(HadithsActivity.this, "Couldn't delete hadith. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

}
