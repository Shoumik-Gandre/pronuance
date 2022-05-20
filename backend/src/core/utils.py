import re

from core.models import Word


def get_words_from_sentence(sentence):
    return re.split(r'\W+', sentence.lower().replace('.', ''))


def create_words_from_sentence(sentence):
    return [Word.objects.get_or_create(text=word) for word in get_words_from_sentence(sentence)]