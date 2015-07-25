package com.hadithhouse;

import android.app.Activity;
import android.app.Dialog;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;

public abstract class GenericHadithObjectDialog<T> {
  ViewObjectBinder<T> binder;
  private Activity activity;
  private ViewObjectBinder.BindingInfo bindingInfo;
  private int dialogId;
  // TODO: Check if it is possible to retrieve views by name so that we don't have to pass those.
  private int saveButtonId;
  private int cancelButtonId;
  private int deleteButtonId;

  public GenericHadithObjectDialog(Activity activity, ViewObjectBinder.BindingInfo bindingInfo,
                                   int dialogId, int saveButtonId, int cancelButtonId,
                                   int deleteButtonId) {
    this.activity = activity;
    this.bindingInfo = bindingInfo;
    this.dialogId = dialogId;
    this.saveButtonId = saveButtonId;
    this.cancelButtonId = cancelButtonId;
    this.deleteButtonId = deleteButtonId;
  }

  public abstract void addObject(T object);

  public abstract void saveObject(T object);

  public abstract void deleteObject(T object);

  public void showAdd(final T object) {
    LayoutInflater inflater = activity.getLayoutInflater();
    final View dlgView = inflater.inflate(dialogId, null);

    final Dialog dlg = new Dialog(activity);
    dlg.setContentView(dlgView);
    dlg.setTitle("Add Person");

    // Binds the dialog view and the object.
    binder = new ViewObjectBinder<T>(dlgView, object, bindingInfo);
    binder.objectToView();

    Button saveButton = (Button) dlgView.findViewById(saveButtonId);
    saveButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        binder.viewToObject();
        addObject(binder.getObject());
        dlg.dismiss();
      }
    });

    Button cancelButton = (Button) dlgView.findViewById(cancelButtonId);
    cancelButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        dlg.dismiss();
      }
    });

    Button deleteButton = (Button) dlgView.findViewById(deleteButtonId);
    deleteButton.setVisibility(View.INVISIBLE);

    dlg.show();
  }

  public void showEdit(final T object) {
    LayoutInflater inflater = activity.getLayoutInflater();
    final View dlgView = inflater.inflate(dialogId, null);

    final Dialog dlg = new Dialog(activity);
    dlg.setContentView(dlgView);
    // TODO: Consider allowing the name to be sent.
    dlg.setTitle("Add " + object.getClass().getName());

    // Binds the dialog view and the object.
    binder = new ViewObjectBinder<>(dlgView, object, bindingInfo);
    binder.objectToView();

    Button saveButton = (Button) dlgView.findViewById(saveButtonId);
    saveButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        binder.viewToObject();
        saveObject(object);
        dlg.dismiss();
      }
    });

    Button cancelButton = (Button) dlgView.findViewById(cancelButtonId);
    cancelButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        dlg.dismiss();
      }
    });

    Button deleteButton = (Button) dlgView.findViewById(deleteButtonId);
    deleteButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        deleteObject(object);
        dlg.dismiss();
      }
    });

    dlg.show();
  }
}
