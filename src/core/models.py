from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import datetime


# Create your models here.


class Story(models.Model):
    name = models.TextField()

    def __str__(self) -> str:
        return f"{self.name}"



class Sentence(models.Model):
    text = models.TextField()
    story = models.ForeignKey(Story, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.text}"


class Word(models.Model):
    text = models.CharField(unique=True, max_length=35)

    # Number of people who got the word wrong for the first time
    # num_wrong1 = models.IntegerField(default=0)
    # num_wrong2 = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f"{self.text}"


class Rating(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.FloatField()
    timestamp = models.DateTimeField(default=datetime.now)

    def __str__(self) -> str:
        return f"user={self.user.username}, word={self.word}, score={self.score}, timestamp={self.timestamp}"


