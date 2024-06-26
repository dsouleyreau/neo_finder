# Generated by Django 5.0.4 on 2024-04-25 14:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Asteroid',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('size', models.FloatField()),
                ('distance', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Approach',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('distance', models.FloatField()),
                ('asteroid', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.asteroid')),
            ],
        ),
    ]
