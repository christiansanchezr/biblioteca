# Generated by Django 2.0.6 on 2018-07-11 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0008_auto_20180711_1004'),
    ]

    operations = [
        migrations.AddField(
            model_name='prestamo',
            name='codigo',
            field=models.CharField(default=0, max_length=54),
            preserve_default=False,
        ),
    ]
