package com.hadithhouse;

import com.hadithhouse.api.Hadith;

public class HadithsActivity extends GenericHadithObjectActivity<Hadith> {
  private ViewObjectBinder.BindingInfo bindingInfo = new ViewObjectBinder.BindingInfo(
      new ViewObjectBinder.BindingPoint("text", R.id.hadithBodyEditText)
  );

  @Override
  protected ViewObjectBinder.BindingInfo getBindingIndo() {
    return bindingInfo;
  }

  @Override
  protected int getAddButtonId() {
    return R.id.addHadithButton;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.activity_hadiths;
  }

  @Override
  protected int getListViewId() {
    return R.id.hadithsListView;
  }

  @Override
  protected int getMenuId() {
    return R.menu.menu_hadiths;
  }

  @Override
  protected int getDialogId() {
    return R.layout.dialog_hadith;
  }

  @Override
  protected int getSaveButtonId() {
    return R.id.hadithDlgSaveButton;
  }

  @Override
  protected int getCancelButtonId() {
    return R.id.hadithDlgCancelButton;
  }

  @Override
  protected int getDeleteButtonId() {
    return R.id.hadithDlgDeleteButton;
  }

  @Override
  protected Hadith newObject() {
    return new Hadith();
  }
}
