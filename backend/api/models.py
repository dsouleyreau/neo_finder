from django.db import models

class Asteroid(models.Model):
  name = models.CharField(max_length=20)
  size = models.FloatField()
  distance = models.FloatField()
  danger = models.BooleanField()

class Approach(models.Model):
  date = models.DateField()
  distance = models.FloatField()
  asteroid = models.ForeignKey(Asteroid, on_delete=models.CASCADE)
