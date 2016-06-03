import re


def multiline_to_singleline(text):
  """
  Convert a multi-line text to a single-line text by removing all new line
  characters.
  :param text: The text to convert.
  :return: The single-line version of the text.
  """
  return re.sub(u'\s+', u' ', text)


def remove_brackets_whitespaces(text):
  """
  Ensure that there are no whitespaces after opening brackets '(' or before
  closing brackets ')'.
  :param text: The text to process.
  :return: The processed texts.
  """
  return re.sub(r'\(\s*', u'(', re.sub(r'\s*\)', u')', text))


def reformat_text(input):
  """
  Re-formats the given text according to the following rules:
  - Unnecessary whitespaces are removed.
  - The text is converted into a single-line.
  - Unnecessary whitespaces after opening brackets and before closing brackets
    are removed.
  :param input: The unformatted text.
  :return: The formatted text.
  """
  return remove_brackets_whitespaces(
    multiline_to_singleline(
      input
    )
  ).strip()
