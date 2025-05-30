# Generated by Django 4.2.5 on 2025-04-27 19:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('opponent', models.CharField(max_length=200)),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('jersey_number', models.PositiveIntegerField()),
                ('position', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='PlayerGameStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('goals', models.PositiveIntegerField(default=0)),
                ('assists', models.PositiveIntegerField(default=0)),
                ('penalties', models.PositiveIntegerField(default=0)),
                ('ice_time_minutes', models.FloatField(default=0.0)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='roster.game')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='roster.player')),
            ],
            options={
                'unique_together': {('player', 'game')},
            },
        ),
    ]
