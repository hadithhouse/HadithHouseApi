package com.hadithhouse;

import android.app.Activity;
import android.app.Fragment;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;


public class HomeActivityFragment extends Fragment {
  public HomeActivityFragment() {
  }

  private void retrieveUserName() {
    new FbProxyTask(new FbProxyTask.Action() {
      @Override
      public Object doAction(FbProxy proxy) {
        try {
          return proxy.getUserInfo();
        } catch (InvalidTokenException e) {
          return null;
        }
      }
    }, new FbProxyTask.Callback() {
      @Override
      public void onSuccess(Object result) {
        JSONObject obj = (JSONObject)result;
        try {
          String userName = obj.get("name").toString();
          // Do something with the user name.
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    }).execute();
  }

  private void initNavList(View v) {
    ListView nav = (ListView)v.findViewById(R.id.navListView);

    // Creates the adapter and add the navigator items.
    ArrayAdapter<String> adap = new ArrayAdapter<>(v.getContext(),
        R.layout.adapter_item);
    final String[] navItems = getResources().getStringArray(R.array.navItems);
    for (String item : navItems) {
      adap.add(item);
    }
    nav.setAdapter(adap);

    // Sets the click handler.
    nav.setOnItemClickListener(new AdapterView.OnItemClickListener() {
      @Override
      public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        onNavItemClicked(NavItem.values()[position]);
      }
    });
  }

  private enum NavItem {
    Hadiths(0),
    Tags(1),
    Persons(2);

    private final int value;

    private NavItem(int value) {
      this.value = value;
    }
  }

  /**
   * Called on a navigator item is clicked.
   * @param item The position of the item which was clicked.
   */
  private void onNavItemClicked(NavItem item) {
    final Context context = getView().getContext();
    switch (item) {
      case Hadiths:
        startActivity(new Intent(getActivity(), HadithsActivity.class));
        break;

      case Tags:
        startActivity(new Intent(getActivity(), TagsActivity.class));
        break;

      case Persons:
        startActivity(new Intent(getActivity(), PersonsActivity.class));
        break;
    }
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
                           Bundle savedInstanceState) {
    View v = inflater.inflate(R.layout.fragment_home_activity, container, false);
    retrieveUserName();
    initNavList(v);
    return v;
  }

  @Override
  public void onAttach(Activity activity) {
    super.onAttach(activity);
  }

  @Override
  public void onDetach() {
    super.onDetach();
  }
}
