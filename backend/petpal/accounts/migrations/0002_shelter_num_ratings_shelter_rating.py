# Generated by Django 4.2.7 on 2023-12-09 19:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='shelter',
            name='num_ratings',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='shelter',
            name='rating',
            field=models.FloatField(default=0),
        ),
    ]
