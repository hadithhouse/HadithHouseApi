import re


def remove_arabic_diactrictics(input):
  if input is None:
    return None
  return re.sub(u'[\u064B-\u0652]', '', input, flags=re.MULTILINE)


def unify_alif_letters(input):
  if input is None:
    return None
  return re.sub(u'[\u0622\u0623\u0625]', u'\u0627', input, flags=re.MULTILINE)


def simplify_arabic_text(input):
  if input is None:
    return None
  return unify_alif_letters(remove_arabic_diactrictics(input))