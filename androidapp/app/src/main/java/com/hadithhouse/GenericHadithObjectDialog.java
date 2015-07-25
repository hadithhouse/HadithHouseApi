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

  public GenericHadithObjectDialog(Activity activity, ViewObjectBinder.BindingInfo bindingInfo) {
    this.activity = activity;
    this.bindingInfo = bindingInfo;
  }

  public abstract void addObject(T object);

  public abstract void saveObject(T object);

  public abstract void deleteObject(T object);

  public void showAdd(final T object) {
    LayoutInflater inflater = activity.getLayoutInflater();
    final View dlgView = inflater.inflate(R.layout.dialog_person, null);

    final Dialog dlg = new Dialog(activity);
    dlg.setContentView(dlgView);
    dlg.setTitle("Add Person");

    // Binds the dialog view and the object.
    binder = new ViewObjectBinder<T>(dlgView, object, bindingInfo);
    binder.objectToView();

    Button saveButton = (Button) dlgView.findViewById(R.id.saveTagButton);
    saveButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        binder.viewToObject();
        addObject(binder.getObject());
        dlg.dismiss();
      }
    });

    Button cancelButton = (Button) dlgView.findViewById(R.id.cancelTagButton);
    cancelButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        dlg.dismiss();
      }
    });

    Button deleteButton = (Button) dlgView.findViewById(R.id.deleteTagButton);
    deleteButton.setVisibility(View.INVISIBLE);

    dlg.show();
  }

  public void showEdit(final T object) {
    LayoutInflater inflater = activity.getLayoutInflater();
    final View dlgView = inflater.inflate(R.layout.dialog_person, null);

    final Dialog dlg = new Dialog(activity);
    dlg.setContentView(dlgView);
    // TODO: Consider allowing the name to be sent.
    dlg.setTitle("Add " + object.getClass().getName());

    // Binds the dialog view and the object.
    binder = new ViewObjectBinder<>(dlgView, object, bindingInfo);
    binder.objectToView();

    Button saveButton = (Button) dlgView.findViewById(R.id.saveTagButton);
    saveButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        binder.viewToObject();
        saveObject(object);
        dlg.dismiss();
      }
    });

    Button cancelButton = (Button) dlgView.findViewById(R.id.cancelTagButton);
    cancelButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        dlg.dismiss();
      }
    });

    Button deleteButton = (Button) dlgView.findViewById(R.id.deleteTagButton);
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
