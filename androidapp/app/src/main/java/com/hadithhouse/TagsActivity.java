package com.hadithhouse;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.view.ContextMenu;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.hadithhouse.api.ApiClient;
import com.hadithhouse.api.HadithTag;

import java.util.ArrayList;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;


public class TagsActivity extends ActionBarActivity {
  ApiClient apiClient = ApiClient.Factory.create();
  ListView tagsListView;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_tags);

    tagsListView = (ListView) findViewById(R.id.tagsListView);
    loadTags();
  }

  private void loadTags() {
    apiClient.getHadithTags(new Callback<List<HadithTag>>() {
      @Override
      public void success(List<HadithTag> hadithTags, Response response) {
        setTags(hadithTags);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this,
            "Couldn't load tags! Error is: " + error.toString(), Toast.LENGTH_LONG).show();
      }
    });
  }

  private void setTags(List<HadithTag> tags) {
    HadithTagsAdapter adapter = new HadithTagsAdapter(this);
    adapter.addAll(tags);

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
      AdapterView.AdapterContextMenuInfo mi = (AdapterView.AdapterContextMenuInfo) menuInfo;
      String tag = (String) tagsListView.getAdapter().getItem(mi.position);
      menu.setHeaderTitle(tag);
      // TODO: Add constants for the group and item IDs.
      menu.add(0, 0, Menu.NONE, "Delete");
    }
  }

  @Override
  public boolean onContextItemSelected(MenuItem item) {
    // TODO: Add constants for the group and item IDs.
    if (item.getGroupId() == 0 && item.getItemId() == 0) {
      onDeleteTag(item);
    }
    return false;
  }

  private void onDeleteTag(MenuItem item) {
    AdapterView.AdapterContextMenuInfo mi = (AdapterView.AdapterContextMenuInfo)item.getMenuInfo();
    final HadithTag tag = (HadithTag) tagsListView.getAdapter().getItem(mi.position);
    apiClient.deleteHadithTag(tag.name, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        HadithTagsAdapter adapter = (HadithTagsAdapter)tagsListView.getAdapter();
        adapter.remove(tag);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this, "Couldn't delete tag.", Toast.LENGTH_LONG).show();
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
