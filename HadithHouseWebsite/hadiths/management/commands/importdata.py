# -*- coding: utf-8 -*-

from django.core.management.base import BaseCommand, CommandError

from hadiths.management.commands.alkafi import import_alkafi_volume
from hadiths.management.commands.holyquran import import_holyquran


class Command(BaseCommand):
    help = 'Import data to the website'

    def add_arguments(self, parser):
        parser.add_argument('dataname', nargs=1, type=str)

    def handle(self, *args, **options):
        data_name = options['dataname'][0]
        if data_name == 'holyquran':
            import_holyquran(self)
        elif data_name == 'alkafi-v1':
            import_alkafi_volume(self, 1)
        elif data_name == 'alkafi-v2':
            import_alkafi_volume(self, 2)
        elif data_name == 'alkafi-v3':
            import_alkafi_volume(self, 3)
        elif data_name == 'alkafi-v4':
            import_alkafi_volume(self, 4)
        elif data_name == 'alkafi-v5':
            import_alkafi_volume(self, 5)
        else:
            raise CommandError('Invalid data name specified: ' + data_name)
