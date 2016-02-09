# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-09 23:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128, unique=True)),
                ('brief_desc', models.CharField(blank=True, max_length=256, null=True)),
                ('pub_year', models.SmallIntegerField(blank=True, null=True)),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('added_by', models.BigIntegerField(null=True)),
                ('updated_by', models.BigIntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Chain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='ChainLink',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.SmallIntegerField()),
                ('chain', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chainlinks', to='hadiths.Chain')),
            ],
        ),
        migrations.CreateModel(
            name='Hadith',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('added_by', models.BigIntegerField(null=True)),
                ('updated_by', models.BigIntegerField(null=True)),
                ('book', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='hadiths', to='hadiths.Book')),
            ],
        ),
        migrations.CreateModel(
            name='HadithTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, unique=True)),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('added_by', models.BigIntegerField(null=True)),
                ('updated_by', models.BigIntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Permission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
                ('desc', models.CharField(max_length=512)),
                ('code', models.BigIntegerField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=16)),
                ('display_name', models.CharField(blank=True, max_length=128, null=True, unique=True)),
                ('full_name', models.CharField(max_length=255, unique=True)),
                ('brief_desc', models.CharField(blank=True, max_length=512, null=True)),
                ('birth_year', models.SmallIntegerField(blank=True, null=True)),
                ('birth_month', models.SmallIntegerField(blank=True, null=True)),
                ('birth_day', models.SmallIntegerField(blank=True, null=True)),
                ('death_year', models.SmallIntegerField(blank=True, null=True)),
                ('death_month', models.SmallIntegerField(blank=True, null=True)),
                ('death_day', models.SmallIntegerField(blank=True, null=True)),
                ('added_on', models.DateTimeField(auto_now_add=True)),
                ('updated_on', models.DateTimeField(auto_now=True)),
                ('added_by', models.BigIntegerField(null=True)),
                ('updated_by', models.BigIntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fb_id', models.BigIntegerField(db_index=True, unique=True)),
                ('permissions', models.BigIntegerField()),
            ],
        ),
        migrations.AddField(
            model_name='hadith',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hadiths', to='hadiths.Person'),
        ),
        migrations.AddField(
            model_name='hadith',
            name='tags',
            field=models.ManyToManyField(related_name='hadiths', to='hadiths.HadithTag'),
        ),
        migrations.AddField(
            model_name='chainlink',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chainlinks', to='hadiths.Person'),
        ),
        migrations.AddField(
            model_name='chain',
            name='hadith',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chains', to='hadiths.Hadith'),
        ),
    ]
