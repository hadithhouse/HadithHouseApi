package com.hadithhouse;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.ContextMenu;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListAdapter;
import android.widget.ListView;

import com.hadithhouse.ApiClient;
import com.hadithhouse.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;


public class TagsActivity extends ActionBarActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_tags);

    loadTags();
  }

  private void loadTags() {
    new ApiClient(this).getArray("hadithtags", new ApiClient.ArrayCallback() {
      @Override
      public void onSuccess(JSONArray result) {
        ArrayList<String> tags = new ArrayList<>();
        for (int i = 0; i < result.length(); i++) {
          try {
            JSONObject obj = result.getJSONObject(i);
            tags.add(obj.getString("name"));
          } catch (JSONException e) {
            e.printStackTrace();
          }
        }

        setTags(tags);
      }
    });
  }

  private void setTags(ArrayList<String> tags) {
    ArrayAdapter<String> adapter = new ArrayAdapter<>(this, R.layout.adapter_item);
    adapter.addAll(tags);

    ListView tagsListView = (ListView)findViewById(R.id.tagsListView);
    tagsListView.setAdapter(adapter);
    registerForContextMenu(tagsListView);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_tags, menu);
    return true;
  }


  @Override
  public void onCreateContextMenu(ContextMenu menu, View v, ContextMenu.ContextMenuInfo menuInfo) {
    if (v.getId() == R.id.tagsListView) {
      AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo)menuInfo;
      ListView tagsListView = (ListView)v;
      String tag = (String)tagsListView.getAdapter().getItem(info.position);
      menu.setHeaderTitle(tag);
      menu.add("Delete");
    }
  }

  @Override
  public boolean onContextItemSelected(MenuItem item) {
    return false;
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
