from django.http import HttpResponse
from django.template import RequestContext, loader

from hadiths.models import Person, Hadith


def index(request):
  template = loader.get_template('hadiths/index.html')
  context = RequestContext(request, {
    'persons': Person.objects.all()
  })
  return HttpResponse(template.render(context))


def persons(request):
  template = loader.get_template('hadiths/persons.html')
  context = RequestContext(request, {
    'persons': Person.objects.all()
  })
  return HttpResponse(template.render(context))


def hadith(request, hadith_id):
  template = loader.get_template('hadiths/hadith.html')
  hadith = Hadith.objects.get(id=hadith_id)
  chains = [{'links': [
    {
      'person_name': link.person.full_name
    } for link in chain.chainlink_set.all()
  ]} for chain in hadith.chain_set.all()]
  context = RequestContext(request, {
    'hadith': hadith,
    'chains': chains
  })
  return HttpResponse(template.render(context))


def hadiths(request):
  template = loader.get_template('hadiths/hadiths.html')
  context = RequestContext(request, {
    'hadiths': Hadith.objects.all()
  })
  return HttpResponse(template.render(context))

