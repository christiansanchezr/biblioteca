# Generated by Django 2.0.6 on 2018-07-08 04:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_user_imagen'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='dept',
        ),
    ]
