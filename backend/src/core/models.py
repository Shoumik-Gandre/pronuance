from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


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
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"user={self.user.username}, word={self.word}, score={self.score}, timestamp={self.timestamp}"

#! Working on the following code:
class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Number of items rated by this user
    num_items = models.IntegerField()
    
    # sum of ratings of items / num_items
    avg_ratings = models.FloatField()
    
    # root of sum of squares of Ratings
    rss = models.FloatField()


class UserSimilarityMatrix(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1_usersimilaritymatrix_set')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2_usersimilaritymatrix_set')
    similarity_score = models.FloatField()