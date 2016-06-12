import re

from textprocessing import english


def multiline_to_singleline(text):
  """
  Convert a multi-line text to a single-line text by removing all new line
  characters.
  :param text: The text to convert.
  :return: The single-line version of the text.
  """
  return re.sub(u'\s+', u' ', text, flags=re.MULTILINE)


def remove_brackets_whitespaces(text):
  """
  Ensure that there are no whitespaces after opening brackets '(' or before
  closing brackets ')'.
  :param text: The text to process.
  :return: The processed text.
  """
  ret = re.sub(r'\s*\)', u')', text, flags=re.MULTILINE)
  ret = re.sub(r'\(\s*', u'(', ret, flags=re.MULTILINE)
  return ret


def remove_punctuation_marks_whitespaces(text,
                                         punct_marks=english.PUNCTUATION_MARKS):
  """
  Ensure that there are no whitespaces before punctuation marks. For example,
  this string "Hello , how are you?" gets converted to "Hello, how are you".
  :param text: The text to process.
  :param punct_marks: If specified,
  :return: The processed text.
  """
  return re.sub(r'\s+([' + ''.join(punct_marks) + '])', r'\1', text, flags=re.MULTILINE)


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
    remove_punctuation_marks_whitespaces(
      multiline_to_singleline(
        input
      )
    )
  ).strip()
