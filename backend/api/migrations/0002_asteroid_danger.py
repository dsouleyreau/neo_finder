# Generated by Django 5.0.4 on 2024-04-25 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='asteroid',
            name='danger',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]