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
  PersonDialog personDialog;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_persons);

    personsListView = (ListView) findViewById(R.id.personsListView);
    personsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
      @Override
      public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        PersonsAdapter adapter = (PersonsAdapter)personsListView.getAdapter();
        Person person = adapter.getItem(position);
        personDialog.showEdit(person);
      }
    });
    loadPersons();

    addPersonButton = (ImageButton) findViewById(R.id.addPersonButton);
    addPersonButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        personDialog.showAdd();
      }
    });

    personDialog = new PersonDialog(this);
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

  public void onPersonAdded(Person person) {
    PersonsAdapter adapter = (PersonsAdapter) personsListView.getAdapter();
    adapter.add(person);
  }

  public void onPersonUpdated(Person person) {
    PersonsAdapter adapter = (PersonsAdapter) personsListView.getAdapter();
    adapter.notifyDataSetChanged();
  }

  public void onPersonDeleted(Person person) {
    PersonsAdapter adapter = (PersonsAdapter) personsListView.getAdapter();
    adapter.remove(person);
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
