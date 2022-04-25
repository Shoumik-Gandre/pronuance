from rest_framework.serializers import ModelSerializer
from core.models import Rating
from core.models import Sentence, Word


class SentenceSerializer(ModelSerializer):
    class Meta:
        model = Sentence
        fields = '__all__'


class WordSerializer(ModelSerializer):
    class Meta:
        model = Word
        fields = '__all__'


class RatingSerializer(ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'