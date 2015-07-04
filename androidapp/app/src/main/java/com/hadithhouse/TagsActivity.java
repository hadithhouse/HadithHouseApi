package com.hadithhouse;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.preference.DialogPreference;
import android.support.v7.app.ActionBarActivity;
import android.view.ContextMenu;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.Toast;

import com.hadithhouse.api.ApiClient;
import com.hadithhouse.api.HadithTag;

import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;


public class TagsActivity extends ActionBarActivity {
  ApiClient apiClient = ApiClient.Factory.create();
  ListView tagsListView;
  ImageButton addTagButton;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_tags);

    tagsListView = (ListView) findViewById(R.id.tagsListView);
    loadTags();

    addTagButton = (ImageButton)findViewById(R.id.addTagButton);
    addTagButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        showAddTagDialog();
      }
    });
  }

  private void showAddTagDialog() {
    LayoutInflater inflater = getLayoutInflater();
    AlertDialog.Builder builder = new AlertDialog.Builder(this);
    final View dlgView = inflater.inflate(R.layout.dialog_add_tag, null);
    builder.setTitle("Add Tag");
    builder.setView(dlgView);
    builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialog, int which) {
        EditText tagEditText = (EditText) dlgView.findViewById(R.id.tagEditText);
        String tagName = tagEditText.getText().toString();
        addTag(tagName);
      }
    });
    builder.setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
      @Override
      public void onClick(DialogInterface dialog, int which) {

      }
    });
    builder.show();
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
      HadithTag tag = (HadithTag) tagsListView.getAdapter().getItem(mi.position);
      menu.setHeaderTitle(tag.name);
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
    deleteTag(tag);
  }

  private void addTag(String name) {
    HadithTag tag = new HadithTag();
    tag.name = name;
    apiClient.postHadithTag(tag, new Callback<HadithTag>() {
      @Override
      public void success(HadithTag hadithTag, Response response) {
        HadithTagsAdapter adapter = (HadithTagsAdapter)tagsListView.getAdapter();
        adapter.add(hadithTag);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this, "Couldn't add tag. Error was: " + error.toString(),
            Toast.LENGTH_LONG).show();
      }
    });
  }

  private void deleteTag(final HadithTag tag) {
    apiClient.deleteHadithTag(tag.name, new Callback<Void>() {
      @Override
      public void success(Void aVoid, Response response) {
        HadithTagsAdapter adapter = (HadithTagsAdapter)tagsListView.getAdapter();
        adapter.remove(tag);
      }

      @Override
      public void failure(RetrofitError error) {
        Toast.makeText(TagsActivity.this, "Couldn't delete tag. Error was: " + error.toString(),
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
