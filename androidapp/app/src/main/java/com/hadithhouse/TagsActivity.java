package com.hadithhouse;

import com.hadithhouse.api.HadithTag;


public class TagsActivity extends GenericHadithObjectActivity<HadithTag> {
  private ViewObjectBinder.BindingInfo bindingInfo = new ViewObjectBinder.BindingInfo(
      new ViewObjectBinder.BindingPoint("name", R.id.tagEditText)
  );

  @Override
  protected ViewObjectBinder.BindingInfo getBindingIndo() {
    return bindingInfo;
  }

  @Override
  protected int getAddButtonId() {
    return R.id.addTagButton;
  }

  @Override
  protected int getLayoutId() {
    return R.layout.activity_tags;
  }

  @Override
  protected int getListViewId() {
    return R.id.tagsListView;
  }

  @Override
  protected int getMenuId() {
    return R.menu.menu_tags;
  }

  @Override
  protected int getDialogId() {
    return R.layout.dialog_tag;
  }

  @Override
  protected int getSaveButtonId() {
    return R.id.tagDlgSaveButton;
  }

  @Override
  protected int getCancelButtonId() {
    return R.id.tagDlgCancelButton;
  }

  @Override
  protected int getDeleteButtonId() {
    return R.id.tagDlgDeleteButton;
  }

  @Override
  protected HadithTag newObject() {
    return new HadithTag();
  }
}
