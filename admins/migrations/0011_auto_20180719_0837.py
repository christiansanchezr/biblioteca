# Generated by Django 2.0.6 on 2018-07-19 14:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0010_auto_20180718_2054'),
    ]

    operations = [
        migrations.AddField(
            model_name='biblioteca',
            name='descripcion',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='biblioteca',
            name='latitud',
            field=models.CharField(default=0, max_length=128),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='biblioteca',
            name='longitud',
            field=models.CharField(default=0, max_length=128),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='biblioteca',
            name='ubicacion',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
    ]
