package com.hadithhouse;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.hadithhouse.api.ApiClient;
import com.hadithhouse.api.Person;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PersonDialog {
  private PersonsActivity activity;
  ApiClient apiClient = ApiClient.Factory.create();

  public PersonDialog(PersonsActivity activity) {
    this.activity = activity;
  }

  private Integer readNullableNumericField(EditText editText) {
    String text = editText.getText().toString();
    try {
      return Integer.parseInt(text);
    } catch (NumberFormatException ex) {
      return null;
    }
  }

  private void setNullableNumericField(EditText editText, Integer number) {
    if (number != null) {
      editText.setText(number.toString());
    }
  }

  private void fieldsToPerson(View dlgView, Person person) {
    EditText titleEditText = (EditText) dlgView.findViewById(R.id.titleEditText);
    EditText displayNameEditText = (EditText) dlgView.findViewById(R.id.displayNameEditText);
    EditText fullNameEditText = (EditText) dlgView.findViewById(R.id.fullNameEditText);
    EditText briefDescEditText = (EditText) dlgView.findViewById(R.id.briefDescEditText);
    // Birth date fields
    EditText birthYearEditText = (EditText) dlgView.findViewById(R.id.birthYearEditText);
    EditText birthMonthEditText = (EditText) dlgView.findViewById(R.id.birthMonthEditText);
    EditText birthDayEditText = (EditText) dlgView.findViewById(R.id.birthDayEditText);
    // Death date fields
    EditText deathYearEditText = (EditText) dlgView.findViewById(R.id.deathYearEditText);
    EditText deathMonthEditText = (EditText) dlgView.findViewById(R.id.deathMonthEditText);
    EditText deathDayEditText = (EditText) dlgView.findViewById(R.id.deathDayEditText);

    person.title = titleEditText.getText().toString();
    person.displayName = displayNameEditText.getText().toString();
    person.fullName = fullNameEditText.getText().toString();
    person.briefDesc = briefDescEditText.getText().toString();
    // Birth date fields
    person.birthYear = readNullableNumericField(birthYearEditText);
    person.birthMonth = readNullableNumericField(birthMonthEditText);
    person.birthDay = readNullableNumericField(birthDayEditText);
    // Death date fields
    person.deathYear = readNullableNumericField(deathYearEditText);
    person.deathMonth = readNullableNumericField(deathMonthEditText);
    person.deathDay = readNullableNumericField(deathDayEditText);
  }

  private void personToFields(Person person, View dlgView) {
    EditText titleEditText = (EditText) dlgView.findViewById(R.id.titleEditText);
    EditText displayNameEditText = (EditText) dlgView.findViewById(R.id.displayNameEditText);
    EditText fullNameEditText = (EditText) dlgView.findViewById(R.id.fullNameEditText);
    EditText briefDescEditText = (EditText) dlgView.findViewById(R.id.briefDescEditText);
    // Birth date fields
    EditText birthYearEditText = (EditText) dlgView.findViewById(R.id.birthYearEditText);
    EditText birthMonthEditText = (EditText) dlgView.findViewById(R.id.birthMonthEditText);
    EditText birthDayEditText = (EditText) dlgView.findViewById(R.id.birthDayEditText);
    // Death date fields
    EditText deathYearEditText = (EditText) dlgView.findViewById(R.id.deathYearEditText);
    EditText deathMonthEditText = (EditText) dlgView.findViewById(R.id.deathMonthEditText);
    EditText deathDayEditText = (EditText) dlgView.findViewById(R.id.deathDayEditText);

    titleEditText.setText(person.title);
    displayNameEditText.setText(person.displayName);
    fullNameEditText.setText(person.fullName);
    briefDescEditText.setText(person.briefDesc);
    // Birth date fields
    setNullableNumericField(birthYearEditText, person.birthYear);
    setNullableNumericField(birthMonthEditText, person.birthMonth);
    setNullableNumericField(birthDayEditText, person.birthDay);

    // Death date fields
    setNullableNumericField(deathYearEditText, person.deathYear);
    setNullableNumericField(deathMonthEditText, person.deathMonth);
    setNullableNumericField(deathDayEditText, person.deathDay);
  }

  public void showAdd() {
    LayoutInflater inflater = activity.getLayoutInflater();
    final View dlgView = inflater.inflate(R.layout.dialog_person, null);

    final Dialog dlg = new Dialog(activity);
    dlg.setContentView(dlgView);
    dlg.setTitle("Add Person");

    Button saveButton = (Button)dlgView.findViewById(R.id.saveTagButton);
    saveButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        Person person = new Person();
        fieldsToPerson(dlgView, person);
        addPerson(person);
        dlg.dismiss();
      }
    });

    Button cancelButton = (Button)dlgView.findViewById(R.id.cancelTagButton);
    cancelButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        dlg.dismiss();
      }
    });

    Button deleteButton = (Button)dlgView.findViewById(R.id.deleteTagButton);
    deleteButton.setVisibility(View.INVISIBLE);

    dlg.show();
  }

  public void showEdit(final Person person) {
    LayoutInflater inflater = activity.getLayoutInflater();
    final View dlgView = inflater.inflate(R.layout.dialog_person, null);
    personToFields(person, dlgView);

    final Dialog dlg = new Dialog(activity);
    dlg.setContentView(dlgView);
    dlg.setTitle("Add Person");

    Button saveButton = (Button) dlgView.findViewById(R.id.saveTagButton);
    saveButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        fieldsToPerson(dlgView, person);
        savePerson(person);
        dlg.dismiss();
      }
    });

    Button cancelButton = (Button) dlgView.findViewById(R.id.cancelTagButton);
    cancelButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        dlg.dismiss();
      }
    });

    Button deleteButton = (Button) dlgView.findViewById(R.id.deleteTagButton);
    deleteButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        deletePerson(person);
        dlg.dismiss();
      }
    });

    dlg.show();
  }

  private void addPerson(Person person) {
    apiClient.postPerson(person, new Callback<Person>() {
      @Override
      public void success(Person person, Response response) {
        activity.onPersonAdded(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(activity, "Couldn't add person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  private void savePerson(Person person) {
    apiClient.putPerson(person.id, person, new Callback<Person>() {
      @Override
      public void success(Person person, Response response) {
        activity.onPersonUpdated(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(activity, "Couldn't save person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  private void deletePerson(final Person person) {
    apiClient.deletePerson(person.id, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        activity.onPersonDeleted(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(activity, "Couldn't delete person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

}
