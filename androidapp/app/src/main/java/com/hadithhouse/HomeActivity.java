package com.hadithhouse;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import com.facebook.AccessToken;

import org.json.JSONException;
import org.json.JSONObject;


public class HomeActivity extends ActionBarActivity {
  AccessToken accessToken;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setContentView(R.layout.activity_home);
    accessToken = AccessToken.getCurrentAccessToken();

    new FacebookProxyTask(accessToken, new FacebookProxyTask.Action() {
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
          TextView text = (TextView)findViewById(R.id.helloMsgTextView);
          text.setText("Hello " + userName);
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
    }).execute();
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_home, menu);
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
