package com.hadithhouse;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;


public class HomeActivity extends ActionBarActivity {
  CallbackManager callbackManager;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initialize Facebook SDK.
    FacebookSdk.sdkInitialize(getApplicationContext());
    callbackManager = CallbackManager.Factory.create();

    setContentView(R.layout.activity_home);

    registerFbCallbackManager();

    // Make a request to check whether the token is valid or not.
    new FbProxyTask(new FbProxyTask.Action() {
      @Override
      public Object doAction(FbProxy proxy) {
        if (!proxy.isValidToken()) {
          // User is not logged in, so we should the login fragment.
          Log.i("Facebook Login", "User IS NOT logged in; showing the login fragment.");
          showFbLoginFragment();
        } else {
          // User is not logged in, so we should the login fragment.
          Log.i("Facebook Login", "User IS logged in; showing the login fragment.");
          showNormalFragment();
        }
        return null;
      }
    }).execute();
  }

  /**
   * If the user is logged in, this shows the normal fragment of the home activity.
   */
  private void showNormalFragment() {
    HomeActivityFragment frag = new HomeActivityFragment();
    getFragmentManager()
        .beginTransaction()
        .replace(R.id.fragmentContainer, frag)
        .commit();
  }

  /**
   * If the user is NOT logged in, this shows the Facebook login fragment.
   */
  private void showFbLoginFragment() {
    getFragmentManager()
        .beginTransaction()
        .replace(R.id.fragmentContainer, new HomeActivityFbLoginFragment())
        .commit();
  }

  private void logoutFromFacebook() {
    LoginManager.getInstance().logOut();
    showFbLoginFragment();
  }

  private void registerFbCallbackManager() {
    LoginManager.getInstance().registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
      @Override
      public void onSuccess(LoginResult loginResult) {
        // App code
        AccessToken accessToken = loginResult.getAccessToken();
        Log.i("Logging to Facebook", "Successfully logged in. Token is: " + accessToken.toString());
        showNormalFragment();
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
  }
  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    callbackManager.onActivityResult(requestCode, resultCode, data);
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
    if (id == R.id.settingsItem) {
      return true;
    } else if (id == R.id.logoutItem) {
      logoutFromFacebook();
    }

    return super.onOptionsItemSelected(item);
  }
}
