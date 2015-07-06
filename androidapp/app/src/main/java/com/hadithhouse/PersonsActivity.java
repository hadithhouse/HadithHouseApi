package com.hadithhouse;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.Toast;

import com.hadithhouse.api.ApiClient;
import com.hadithhouse.api.Person;

import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PersonsActivity extends ActionBarActivity {
  ApiClient apiClient = ApiClient.Factory.create();
  ListView personsListView;
  ImageButton addPersonButton;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_persons);

    personsListView = (ListView) findViewById(R.id.personsListView);
    loadPersons();

    addPersonButton = (ImageButton) findViewById(R.id.addPersonButton);
    addPersonButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        showAddPersonDialog();
      }
    });
  }

  private void showAddPersonDialog() {
    LayoutInflater inflater = getLayoutInflater();
    AlertDialog.Builder builder = new AlertDialog.Builder(this);
    final View dlgView = inflater.inflate(R.layout.dialog_add_person, null);
    builder.setTitle("Add Person");
    builder.setView(dlgView);
    builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialog, int which) {
        EditText titleEditText = (EditText) dlgView.findViewById(R.id.titleEditText);
        EditText displayNameEditText = (EditText) dlgView.findViewById(R.id.displayNameEditText);
        EditText fullNameEditText = (EditText) dlgView.findViewById(R.id.fullNameEditText);
        EditText briefDescEditText = (EditText) dlgView.findViewById(R.id.briefDescEditText);
        String title = titleEditText.getText().toString();
        String displayName = displayNameEditText.getText().toString();
        String fullName = fullNameEditText.getText().toString();
        String briefDesc = briefDescEditText.getText().toString();
        addPerson(title, displayName, fullName, briefDesc);
      }
    });
    builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialog, int which) {

      }
    });
    builder.show();
  }

  private void loadPersons() {
    apiClient.getPersons(new Callback<List<Person>>() {
      @Override
      public void success(List<Person> persons, Response response) {
        setPersons(persons);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this,
            "Couldn't load persons! Error is: " + error.toString(), Toast.LENGTH_LONG).show();
      }
    });
  }

  private void setPersons(List<Person> persons) {
    PersonsAdapter adapter = new PersonsAdapter(this);
    adapter.addAll(persons);

    personsListView.setAdapter(adapter);
    registerForContextMenu(personsListView);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_persons, menu);
    return true;
  }

  @Override
  public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
    if (v.getId() == R.id.personsListView) {
      AdapterView.AdapterContextMenuInfo mi = (AdapterView.AdapterContextMenuInfo) menuInfo;
      Person person = (Person) personsListView.getAdapter().getItem(mi.position);
      menu.setHeaderTitle(person.displayName);
      // TODO: Add constants for the group and item IDs.
      menu.add(0, 0, Menu.NONE, "Delete");
    }
  }

  @Override
  public boolean onContextItemSelected(MenuItem item) {
    // TODO: Add constants for the group and item IDs.
    if (item.getGroupId() == 0 && item.getItemId() == 0) {
      onDeletePerson(item);
    }
    return false;
  }

  private void onDeletePerson(MenuItem item) {
    AdapterView.AdapterContextMenuInfo mi = (AdapterView.AdapterContextMenuInfo) item.getMenuInfo();
    final Person person = (Person) personsListView.getAdapter().getItem(mi.position);
    deletePerson(person);
  }

  private void addPerson(String title, String displayName, String fullName, String briefDesc) {
    Person person = new Person();
    person.title = title;
    person.displayName = displayName;
    person.fullName = fullName;
    person.briefDesc = briefDesc;

    apiClient.postPerson(person, new Callback<Person>() {
      @Override
      public void success(Person person, Response response) {
        PersonsAdapter adapter = (PersonsAdapter) personsListView.getAdapter();
        adapter.add(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this, "Couldn't add person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  private void deletePerson(final Person person) {
    apiClient.deletePerson(person.id, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        PersonsAdapter adapter = (PersonsAdapter) personsListView.getAdapter();
        adapter.remove(person);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(PersonsActivity.this, "Couldn't delete person. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, so long
    // as you specify a parent activity in AndroidManifest.xml.
    int id = item.getItemId();

    //noinspection SimplifiableIfStatement
    if (id == R.id.action_settings) {
      return true;
    }

    return super.onOptionsItemSelected(item);
  }
}
