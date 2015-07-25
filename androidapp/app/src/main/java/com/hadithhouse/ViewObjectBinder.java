package com.hadithhouse;

import android.view.View;
import android.widget.EditText;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Iterator;

public class ViewObjectBinder<T> {

  private View container;
  private T object;
  private BindingInfo bindingInfo;

  /**
   * Creates a binder for the given container view and Java object.
   * @param container The container containing the views to be bound to the Java object.
   * @param object The Java object to bind to the views.
   * @param bindingInfo The information of the binding. This is a list of tuples containing
   *                    the name of the view and the name of the field.
   */
  public ViewObjectBinder(View container, T object, BindingInfo bindingInfo) {
    this.container = container;
    this.object = object;
    this.bindingInfo = bindingInfo;
  }

  /**
   * Updates the views in the container view from the corresponding values of the object fields.
   */
  public void objectToView() {
    for (BindingPoint point : bindingInfo) {
      String viewValue = getObjectField(point.fieldName);
      setViewValue(point.viewId, viewValue);
    }
  }

  /**
   * Updates the fields of the object from the corresponding views in the container view.
   */
  public void viewToObject() {
    for (BindingPoint point : bindingInfo) {
      String viewValue = getViewValue(point.viewId);
      setObjectField(point.fieldName, viewValue);
    }
  }

  /**
   * Retrieves the object of this binding.
   * @return The object of this binding.
   */
  public T getObject() {
    return this.object;
  }

  /**
   * Retrieves the container view of this binding.
   * @return The container view of this binding.
   */
  public View getContainer() {
    return this.container;
  }

  /**
   * Gets the value of the field having the given name.
   *
   * @param fieldName The name of the field.
   * @return The value of the field.
   */
  private String getObjectField(String fieldName) {
    Class<?> cls = object.getClass();
    try {
      Field field = cls.getField(fieldName);
      Class<?> fieldType = field.getType();

      if (fieldType == Integer.class) { // Integer
        Object obj = field.get(object);
        if (obj == null) {
          return "";
        } else {
          return Integer.toString((Integer) obj);
        }
      } else if (fieldType == String.class) { // String
        return (String) field.get(object);
      } else {
        throw new UnsupportedOperationException("Unsupported field type: " + fieldType.getName());
      }
    } catch (NoSuchFieldException e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Invalid field name: " + fieldName);
    } catch (IllegalAccessException e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Field cannot be accessed: " + fieldName);
    }
  }

  /**
   * Sets the value of the field having the given name.
   *
   * @param fieldName The name of the field.
   * @param value     The value to set.
   */
  private void setObjectField(String fieldName, String value) {
    Class<?> cls = object.getClass();
    try {
      Field field = cls.getField(fieldName);
      Class<?> fieldType = field.getType();
      if (fieldType == Integer.class) { // Integer
        if (value != null && !value.isEmpty()) {
          field.set(object, Integer.parseInt(value));
        } else {
          field.set(object, null);
        }
      } else if (fieldType == String.class) { // String
        field.set(object, value);
      } else {
        throw new UnsupportedOperationException("Unsupported field type: " + fieldType.getName());
      }
    } catch (NoSuchFieldException e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Invalid field name: " + fieldName);
    } catch (IllegalAccessException e) {
      e.printStackTrace();
      throw new IllegalArgumentException("Field cannot be accessed: " + fieldName);
    }
  }

  /**
   * Gets the value of the view having the given ID.
   *
   * @param viewId the ID of the view.
   * @return The value of the view.
   */
  private String getViewValue(int viewId) {
    View view = container.findViewById(viewId);
    if (view instanceof EditText) {
      EditText editText = (EditText) view;
      return editText.getText().toString();
    } else {
      throw new IllegalArgumentException("View type is not supported.");
    }
  }

  /**
   * Sets the value of the view having the given ID.
   *
   * @param viewId The ID of the view.
   * @param value  The value to set.
   */
  private void setViewValue(int viewId, String value) {
    View view = container.findViewById(viewId);
    if (view instanceof EditText) {
      EditText editText = (EditText) view;
      editText.setText(value);
    } else {
      throw new UnsupportedOperationException("View type is not supported: " +
          view.getClass().getName());
    }
  }

  static class BindingPoint {
    /**
     * The name of the field in the object to
     */
    String fieldName;

    /**
     * The ID of the view to bind the field to.
     */
    int viewId;

    public BindingPoint(String fieldName, int viewId) {
      this.fieldName = fieldName;
      this.viewId = viewId;
    }

    @Override
    public String toString() {
      // TODO: Returning just the field name at the moment, because there isn't much point in
      // returning the video ID.
      return fieldName;
    }
  }

  static class BindingInfo implements Iterable<BindingPoint> {
    private ArrayList<BindingPoint> bindingPoints = new ArrayList<>();

    public BindingInfo(BindingPoint... bindingPoints) {
      for (BindingPoint p : bindingPoints) {
        this.bindingPoints.add(p);
      }
    }

    @Override
    public Iterator<BindingPoint> iterator() {
      return bindingPoints.iterator();
    }
  }
}
