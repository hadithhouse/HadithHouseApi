package com.hadithhouse;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;

import java.util.Arrays;

/**
 * This activity contains Facebook LoginButton which was used to login
 * to Facebook. I am changing this to use LoginManager instead so that
 * I have more control. Keeping this class for now, but it should be
 * deleted later.
 */
public class FacebookLoginActivity extends ActionBarActivity {
  CallbackManager callbackManager;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initialize Facebook SDK.
    FacebookSdk.sdkInitialize(getApplicationContext());
    callbackManager = CallbackManager.Factory.create();

    setContentView(R.layout.activity_facebooklogin);

    LoginManager.getInstance().registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
      @Override
      public void onSuccess(LoginResult loginResult) {
        // App code
        AccessToken accessToken = loginResult.getAccessToken();
        Log.i("Logging to Facebook", "Successfully logged in. Token is: " + accessToken.toString());
        Intent intent = new Intent(FacebookLoginActivity.this, HomeActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);

      }

      @Override
      public void onCancel() {
        // App code
        Log.i("Login to Facebook", "Login cancelled.");
      }

      @Override
      public void onError(FacebookException exception) {
        // App code
        Log.e("Login to Facebook", "Error while logging to Facebook. Exception is " +
            exception.toString());
      }
    });

    Button login = (Button)findViewById(R.id.loginWithFacebook);
    login.setVisibility(View.GONE);
    login.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        LoginManager.getInstance().logInWithReadPermissions(FacebookLoginActivity.this,
            Arrays.asList("public_profile", "user_friends", "email"));
      }
    });

    // Run a task to check whether the user is logged in or not.
    FacebookLoginTask task = new FacebookLoginTask();
    task.execute(AccessToken.getCurrentAccessToken());
  }

  @Override
  public boolean onCreateOptionsMenu(Menu menu) {
    // Inflate the menu; this adds items to the action bar if it is present.
    getMenuInflater().inflate(R.menu.menu_main, menu);
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

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    callbackManager.onActivityResult(requestCode, resultCode, data);
  }

  @Override
  protected void onResume() {
    super.onResume();

    // Logs 'install' and 'app activate' App Events.
    AppEventsLogger.activateApp(this);
  }

  @Override
  protected void onPause() {
    super.onPause();

    // Logs 'app deactivate' App Event.
    AppEventsLogger.deactivateApp(this);
  }

  /**
   * A task that makes a request to Facebook API to check whether a user
   * is currently logged in or not.
   */
  private class FacebookLoginTask extends AsyncTask<AccessToken, Void, Boolean> {
    @Override
    protected void onPreExecute() {

    }

    @Override
    protected Boolean doInBackground(AccessToken... params) {
      if (params.length == 0) {
        return false;
      }
      AccessToken token = params[0];
      if (token == null) {
        Log.i("FacebookLoginTask", "Given token is null, so user is not logged in.");
        // Access token is null, so the user is not logged in.
        return false;
      }
      FacebookProxy proxy = new FacebookProxy(token);
      Boolean valid = proxy.isValidToken();
      if (valid == true) {
        Log.i("FacebookLoginTask", "Facebook proxy validated the access token.");
      } else {
        Log.i("FacebookLoginTask", "Facebook proxy couldn't validate the access token.");
      }
      return valid;
    }

    @Override
    protected void onProgressUpdate(Void... progress) {
    }

    @Override
    protected void onPostExecute(Boolean result) {
      if (result) {
        // User is logged in, so we redirect to the Home activity.
        Log.i("Facebook Login", "User IS logged in; redirecting to Home activity.");
        Intent intent = new Intent(FacebookLoginActivity.this, HomeActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_CLEAR_TASK | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
      } else {
        // User is not logged in, so we show the login button.
        Log.i("Facebook Login", "User is NOT logged in; showing the login button.");
        Button login = (Button)findViewById(R.id.loginWithFacebook);
        login.setVisibility(View.VISIBLE);
      }
    }
  }
}
