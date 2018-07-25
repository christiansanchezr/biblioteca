# Generated by Django 2.0.6 on 2018-07-02 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.TextField(max_length=64)),
                ('apellido', models.TextField(max_length=64)),
                ('direccion', models.TextField(max_length=54)),
                ('telefono', models.TextField(max_length=8)),
                ('correo', models.ImageField(upload_to='')),
                ('password', models.TextField()),
                ('genero', models.TextField()),
                ('date', models.DateField()),
                ('cui', models.TextField(max_length=14)),
                ('dept', models.TextField(max_length=32)),
                ('municipio', models.TextField(max_length=32)),
                ('zona', models.TextField(max_length=2)),
                ('institucion', models.TextField()),
                ('escolaridad', models.TextField()),
            ],
        ),
    ]