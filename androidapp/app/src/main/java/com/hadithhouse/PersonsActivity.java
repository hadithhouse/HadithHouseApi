package com.hadithhouse;

import android.widget.Toast;

import com.hadithhouse.api.Hadith;
import com.hadithhouse.api.PagedResults;
import com.hadithhouse.api.Person;

import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PersonsActivity extends GenericHadithObjectActivity<Person> {
  private ViewObjectBinder.BindingInfo bindingInfo = new ViewObjectBinder.BindingInfo(
      new ViewObjectBinder.BindingPoint("title", R.id.titleEditText),
      new ViewObjectBinder.BindingPoint("displayName", R.id.displayNameEditText),
      new ViewObjectBinder.BindingPoint("fullName", R.id.fullNameEditText),
      new ViewObjectBinder.BindingPoint("briefDesc", R.id.briefDescEditText),
      new ViewObjectBinder.BindingPoint("birthYear", R.id.birthYearEditText),
      new ViewObjectBinder.BindingPoint("birthMonth", R.id.birthMonthEditText),
      new ViewObjectBinder.BindingPoint("birthDay", R.id.birthDayEditText),
      new ViewObjectBinder.BindingPoint("deathYear", R.id.deathYearEditText),
      new ViewObjectBinder.BindingPoint("deathMonth", R.id.deathMonthEditText),
      new ViewObjectBinder.BindingPoint("deathDay", R.id.deathDayEditText)
  );

  @Override
  protected ViewObjectBinder.BindingInfo getBindingIndo() {
    return bindingInfo;
  }

  @Override
  protected int getAddButtonId() {
    return R.id.addPersonButton;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.activity_persons;
  }

  @Override
  protected int getListViewId() {
    return R.id.personsListView;
  }

  @Override
  protected int getMenuId() {
    return R.menu.menu_persons;
  }

  @Override
  protected int getDialogId() {
    return R.layout.dialog_person;
  }

  @Override
  protected int getSaveButtonId() {
    return R.id.personDlgSaveButton;
  }

  @Override
  protected int getCancelButtonId() {
    return R.id.personDlgCancelButton;
  }

  @Override
  protected int getDeleteButtonId() {
    return R.id.personDlgDeleteButton;
  }

  @Override
  protected Person newObject() {
    return new Person();
  }

  protected void loadObjects() {
    apiClient.getPersons(new Callback<PagedResults<Person>>() {
      @Override
      public void success(PagedResults<Person> response, Response httpResponse) {
        setObjects(response.results);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this,
            "Couldn't load persons! Error is: " + error.toString(), Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void addObject(Person object) {
    apiClient.postPerson(object, new Callback<Person>() {
      @Override
      public void success(Person person, Response response) {
        onObjectAdded(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this, "Couldn't add person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void saveObject(Person object) {
    apiClient.putPerson(object.id, object, new Callback<Person>() {
      @Override
      public void success(Person person, Response response) {
        onObjectUpdated(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this, "Couldn't save person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  protected void deleteObject(final Person object) {
    apiClient.deletePerson(object.id, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        onObjectDeleted(object);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this, "Couldn't delete person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }
}
