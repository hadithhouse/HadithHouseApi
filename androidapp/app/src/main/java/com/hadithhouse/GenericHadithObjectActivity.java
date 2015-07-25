package com.hadithhouse;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.Toast;

import com.hadithhouse.api.ApiClient;

import java.lang.reflect.ParameterizedType;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

import com.hadithhouse.api.*;

public abstract class GenericHadithObjectActivity<T> extends ActionBarActivity {
  ApiClient apiClient = ApiClient.Factory.create();
  ListView objectsListView;
  ImageButton addObjectButton;
  GenericHadithObjectDialog objectDialog;

  protected abstract ViewObjectBinder.BindingInfo getBindingIndo();
  protected abstract int getAddButtonId();
  protected abstract int getLayoutId();
  protected abstract int getListViewId();
  protected abstract int getMenuId();
  protected abstract T newObject();


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(getLayoutId());

    objectsListView = (ListView) findViewById(getListViewId());
    objectsListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
      @Override
      public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        GenericHadithObjectAdapter<T> adapter = (GenericHadithObjectAdapter<T>) objectsListView.getAdapter();
        T object = adapter.getItem(position);
        objectDialog.showEdit(object);
      }
    });
    loadObjects();

    addObjectButton = (ImageButton) findViewById(getAddButtonId());
    addObjectButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        objectDialog.showAdd(newObject());
      }
    });

    objectDialog = new GenericHadithObjectDialog<T>(this, getBindingIndo()) {

      @Override
      public void addObject(T object) {
        GenericHadithObjectActivity.this.addObject(object);
      }

      @Override
      public void saveObject(T object) {
        GenericHadithObjectActivity.this.saveObject(object);
      }

      @Override
      public void deleteObject(T object) {
        GenericHadithObjectActivity.this.deleteObject(object);
      }
    };
  }

  Class<T> getGenericType() {
    ParameterizedType parameterizedType = (ParameterizedType) getClass()
        .getGenericSuperclass();
    return (Class<T>) parameterizedType.getActualTypeArguments()[0];
  }

  private void loadObjects() {
    Class<T> type = getGenericType();
    if (type == Hadith.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == HadithTag.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == Person.class) {
      apiClient.getPersons(new Callback<List<Person>>() {
        @Override
        public void success(List<Person> persons, Response response) {
          setObjects((List<T>) persons);
        }

        @Override
        public void failure(RetrofitError error) {
          Toast.makeText(GenericHadithObjectActivity.this,
              "Couldn't load persons! Error is: " + error.toString(), Toast.LENGTH_LONG).show();
        }
      });
    }
  }

  private void addObject(T object) {
    Class<T> type = getGenericType();
    if (type == Hadith.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == HadithTag.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == Person.class) {
      apiClient.postPerson((Person)object, new Callback<Person>() {
        @Override
        public void success(Person person, Response response) {
          onObjectAdded((T) person);
        }

        @Override
        public void failure(RetrofitError error) {
          Toast.makeText(GenericHadithObjectActivity.this, "Couldn't add person. Error was: " + error.toString(),
              Toast.LENGTH_LONG).show();
        }
      });
    }
  }

  private void saveObject(T object) {
    Class<T> type = getGenericType();
    if (type == Hadith.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == HadithTag.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == Person.class) {
      apiClient.putPerson(((Person)object).id, (Person)object, new Callback<Person>() {
        @Override
        public void success(Person person, Response response) {
          onObjectUpdated((T) person);
        }

        @Override
        public void failure(RetrofitError error) {
          Toast.makeText(GenericHadithObjectActivity.this, "Couldn't save person. Error was: " + error.toString(),
              Toast.LENGTH_LONG).show();
        }
      });
    }
  }

  private void deleteObject(final T object) {
    Class<T> type = getGenericType();
    if (type == Hadith.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == HadithTag.class) {
      // TODO: Implement this.
      throw new UnsupportedOperationException();
    } else if (type == Person.class) {
      apiClient.deletePerson(((Person)object).id, new Callback<Void>() {
        @Override
        public void success(Void aVoid, Response response) {
          onObjectDeleted(object);
        }

        @Override
        public void failure(RetrofitError error) {
          Toast.makeText(GenericHadithObjectActivity.this, "Couldn't delete person. Error was: " + error.toString(),
              Toast.LENGTH_LONG).show();
        }
      });
    }
  }

  public void onObjectAdded(T object) {
    GenericHadithObjectAdapter<T> adapter = (GenericHadithObjectAdapter<T>) objectsListView.getAdapter();
    adapter.add(object);
  }

  public void onObjectUpdated(T object) {
    GenericHadithObjectAdapter<T> adapter = (GenericHadithObjectAdapter<T>) objectsListView.getAdapter();
    adapter.notifyDataSetChanged();
  }

  public void onObjectDeleted(T object) {
    GenericHadithObjectAdapter<T> adapter = (GenericHadithObjectAdapter<T>) objectsListView.getAdapter();
    adapter.remove(object);
  }

  private void setObjects(List<T> objects) {
    GenericHadithObjectAdapter<T> adapter = new GenericHadithObjectAdapter<T>(this);
    adapter.addAll(objects);

    objectsListView.setAdapter(adapter);
    registerForContextMenu(objectsListView);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(getMenuId(), menu);
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
