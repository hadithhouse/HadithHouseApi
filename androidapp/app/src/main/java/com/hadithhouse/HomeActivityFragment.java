package com.hadithhouse;

import android.app.Activity;
import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;


public class HomeActivityFragment extends Fragment {
  public HomeActivityFragment() {
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    retrieveUserName();
  }

  private void retrieveUserName() {
    new FacebookProxyTask(new FacebookProxyTask.Action() {
      @Override
      public Object doAction(FacebookProxy proxy) {
        try {
          return proxy.getUserInfo();
        } catch (InvalidTokenException e) {
          return null;
        }
      }
    }, new FacebookProxyTask.Callback() {
      @Override
      public void onSuccess(Object result) {
        JSONObject obj = (JSONObject)result;
        try {
          String userName = obj.get("name").toString();
          TextView text = (TextView)getView().findViewById(R.id.helloTextView);
          text.setText("Hello " + userName);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    }).execute();
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
                           Bundle savedInstanceState) {
    return inflater.inflate(R.layout.fragment_home_activity, container, false);
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
