# Generated by Django 2.0.6 on 2018-07-19 05:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('admins', '0010_auto_20180718_2054'),
        ('user', '0009_prestamo_codigo'),
    ]

    operations = [
        migrations.CreateModel(
            name='Historial',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_prestamo', models.DateField()),
                ('fecha_entrega', models.DateField()),
                ('codigo', models.CharField(max_length=54)),
                ('estado', models.BooleanField()),
                ('libro', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admins.Libro')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.User')),
            ],
        ),
    ]
