# Generated by Django 3.1.1 on 2020-09-29 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0006_blsoesfakes'),
    ]

    operations = [
        migrations.CreateModel(
            name='StateAbbPairs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('state_name', models.CharField(max_length=100)),
                ('abbreviation', models.CharField(max_length=2)),
            ],
        ),
    ]
