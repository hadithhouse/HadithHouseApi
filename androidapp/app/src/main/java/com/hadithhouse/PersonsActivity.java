package com.hadithhouse;

import com.hadithhouse.api.Person;

public class PersonsActivity extends GenericHadithObjectActivity<Person> {
  private ViewObjectBinder.BindingInfo bindingInfo = new ViewObjectBinder.BindingInfo(
      new ViewObjectBinder.BindingPoint("title", R.id.titleEditText),
      new ViewObjectBinder.BindingPoint("displayName", R.id.displayNameEditText),
      new ViewObjectBinder.BindingPoint("fullName", R.id.fullNameEditText),
      new ViewObjectBinder.BindingPoint("briefDesc", R.id.briefDescEditText),
      new ViewObjectBinder.BindingPoint("birthYear", R.id.birthYearEditText),
      new ViewObjectBinder.BindingPoint("birthMonth", R.id.birthMonthEditText),
      new ViewObjectBinder.BindingPoint("birthDay", R.id.birthDayEditText),
      new ViewObjectBinder.BindingPoint("deathYear", R.id.deathYearEditText),
      new ViewObjectBinder.BindingPoint("deathMonth", R.id.deathMonthEditText),
      new ViewObjectBinder.BindingPoint("deathDay", R.id.deathDayEditText)
  );

  @Override
  protected ViewObjectBinder.BindingInfo getBindingIndo() {
    return bindingInfo;
  }

  @Override
  protected int getAddButtonId() {
    return R.id.addPersonButton;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.activity_persons;
  }

  @Override
  protected int getListViewId() {
    return R.id.personsListView;
  }

  @Override
  protected int getMenuId() {
    return R.menu.menu_persons;
  }

  @Override
  protected int getDialogId() {
    return R.layout.dialog_person;
  }

  @Override
  protected int getSaveButtonId() {
    return R.id.personDlgSaveButton;
  }

  @Override
  protected int getCancelButtonId() {
    return R.id.personDlgCancelButton;
  }

  @Override
  protected int getDeleteButtonId() {
    return R.id.personDlgDeleteButton;
  }

  @Override
  protected Person newObject() {
    return new Person();
  }
}
