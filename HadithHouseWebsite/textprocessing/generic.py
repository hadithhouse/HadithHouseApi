import re


def multiline_to_singleline(text):
  """
  Convert a multi-line text to a single-line text by removing all new line
  characters.
  :param text: The text to convert.
  :return: The single-line version of the text.
  """
  return re.sub('\s{2,}', ' ', text)


def remove_brackets_whitespaces(text):
  """
  Ensure that there are no whitespaces after opening brackets '(' or before
  closing brackets ')'.
  :param text: The text to process.
  :return: The processed texts.
  """
  return re.sub(r'\(\s*(\S*)\s*\)', r'(\1)', text)
