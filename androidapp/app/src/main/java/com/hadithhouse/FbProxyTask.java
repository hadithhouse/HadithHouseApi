package com.hadithhouse;

import android.os.AsyncTask;

import com.facebook.AccessToken;

public class FbProxyTask {
  AccessToken token;
  Action action;
  Callback callback;

  /**
   * Creates a proxy that will asynchronously execute the given action.
   * @param action The action to be executed.
   */
  public FbProxyTask(Action action) {
    this(action, null);
  }

  /**
   * Creates a proxy that will asynchronously execute the given action. In
   * addition to the action, this constructor accepts a callback to be
   * called when the action returns successfully with some result.
   * @param action The action to be executed.
   * @param callback The callback to call when the result
   */
  public FbProxyTask(Action action, Callback callback) {
    this.token = AccessToken.getCurrentAccessToken();
    this.action = action;
    if (this.action == null) {
      throw new NullPointerException("The argument 'action' shouldn't be null.");
    }
    this.callback = callback;
  }

  /**
   * Execute the asynchronous task.
   */
  public void execute() {
    TheTask t = new TheTask();
    t.execute(this.token);
  }

  public interface Action {
    Object doAction(FbProxy proxy);
  }

  public interface Callback {
    void onSuccess(Object result);
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
      FbProxy proxy = new FbProxy(token);
      return action.doAction(proxy);
    }

    @Override
    protected void onProgressUpdate(Void... progress) {

    }

    @Override
    protected void onPostExecute(Object result) {
      if (callback != null) {
        callback.onSuccess(result);
      }
    }
  }
}
