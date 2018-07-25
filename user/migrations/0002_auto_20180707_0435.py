# Generated by Django 2.0.6 on 2018-07-07 04:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='password',
        ),
        migrations.AddField(
            model_name='user',
            name='contra',
            field=models.CharField(default=10, max_length=120),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='apellido',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='user',
            name='correo',
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name='user',
            name='cui',
            field=models.CharField(max_length=14),
        ),
        migrations.AlterField(
            model_name='user',
            name='dept',
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name='user',
            name='direccion',
            field=models.CharField(max_length=54),
        ),
        migrations.AlterField(
            model_name='user',
            name='escolaridad',
            field=models.CharField(max_length=120),
        ),
        migrations.AlterField(
            model_name='user',
            name='genero',
            field=models.CharField(max_length=42),
        ),
        migrations.AlterField(
            model_name='user',
            name='institucion',
            field=models.CharField(max_length=120),
        ),
        migrations.AlterField(
            model_name='user',
            name='municipio',
            field=models.CharField(max_length=32),
        ),
        migrations.AlterField(
            model_name='user',
            name='nombre',
            field=models.CharField(max_length=64),
        ),
        migrations.AlterField(
            model_name='user',
            name='telefono',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='user',
            name='zona',
            field=models.CharField(max_length=2),
        ),
    ]
