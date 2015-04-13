from django.contrib import admin
from hadiths.models import Hadith, Person, HadithTag

admin.site.register(Hadith)
admin.site.register(Person)
admin.site.register(HadithTag)
