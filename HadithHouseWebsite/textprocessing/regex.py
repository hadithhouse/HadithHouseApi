import re


class DocScanner(object):
  """
  A class used to find certain tokens in a given document. The tokens can be
  specified by regular expressions.
  """

  def __init__(self, tokens_dict, callback):
    """
    Initialize a new document scanner.
    :param tokens_dict: A dictionary whose keys are the types of tokens and
    values are the regex for finding such types of tokens.
    :param callback: A function to be called whenever a token is found.
    """
    self.types = list(tokens_dict.keys())
    self.scanning_regex = '|'.join(['(?P<%s>%s)' % (type, regex) for type, regex in tokens_dict.items()])
    self.callback = callback

  def scan(self, document, context=None):
    prev_match = None
    prev_type = None
    for match in re.finditer(self.scanning_regex, document, flags=re.MULTILINE):
      for type in self.types:
        if match.group(type) is not None:
          self.callback(
            type,
            prev_type,
            match,
            prev_match,
            document,
            context
          )
          prev_type = type
          prev_match = match
          break
