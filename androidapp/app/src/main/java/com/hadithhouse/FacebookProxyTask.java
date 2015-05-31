package com.hadithhouse;

import android.os.AsyncTask;

import com.facebook.AccessToken;

public class FacebookProxyTask {
  public interface Action {
    Object doAction(FacebookProxy proxy);
  }

  public interface Callback {
    void onSuccess(Object result);
  }

  AccessToken token;
  Action action;
  Callback callback;

  public FacebookProxyTask(AccessToken token, Action action, Callback callback) {
    this.token = token;
    this.action = action;
    this.callback = callback;
  }

  public void execute() {
    TheTask t = new TheTask();
    t.execute(this.token);
  }

  private class TheTask extends AsyncTask<AccessToken, Void, Object> {

    @Override
    protected void onPreExecute() {

    }

    @Override
    protected Object doInBackground(AccessToken... params) {
      if (params.length == 0) {
        return null;
      }
      AccessToken token = params[0];
      FacebookProxy proxy = new FacebookProxy(token);
      return FacebookProxyTask.this.action.doAction(proxy);
    }

    @Override
    protected void onProgressUpdate(Void... progress) {

    }

    @Override
    protected void onPostExecute(Object result) {
      FacebookProxyTask.this.callback.onSuccess(result);
    }
  }
}
