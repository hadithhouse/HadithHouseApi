from django.http import HttpResponse
from django.template import RequestContext, loader
from hadiths.models import Person


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

