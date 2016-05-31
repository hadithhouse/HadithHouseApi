import re


def remove_arabic_diacritics(input):
  if input is None:
    return None
  return re.sub(u'[\u064B-\u0652]', '', input, flags=re.MULTILINE)


def unify_alef_letters(input):
  if input is None:
    return None
  # Source: "Arabic script in Unicode" at Wikipedia
  alef = '\u0627'
  alef_with_madda = '\u0622'
  alef_with_hamza = '\u0623'
  alef_with_hamza_below = '\u0625'
  alef_wasla = '\u0671'
  alef_with_wavy_hamza = '\u0672'
  alef_with_wavy_hamza_below = '\u0673'
  alef_high_hamza_alef = '\u0675'
  regex = '[' + ''.join([
    alef_with_madda,
    alef_with_hamza,
    alef_with_hamza_below,
    alef_wasla,
    alef_with_wavy_hamza,
    alef_with_wavy_hamza_below,
    alef_high_hamza_alef
  ]) + ']'
  return re.sub(regex, alef, input, flags=re.MULTILINE)


def simplify_arabic_text(input):
  if input is None:
    return None
  return unify_alef_letters(remove_arabic_diacritics(input))

