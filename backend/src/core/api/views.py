import io
from random import randrange
from typing import Any, Dict, List, Set
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from core.recommend import Rating, UserItem, recommend_items
from django.db.models import QuerySet
from core.models import Rating as RatingModel, Sentence, Story, Word
from core.apps import CoreConfig
from core.tts import TextToSpeech
from core.word_comparater import compare_sentence
from .serializers import SentenceSerializer, WordSerializer, RatingSerializer
from django.core.files.uploadedfile import InMemoryUploadedFile
import json
from pydub import AudioSegment
import nltk
from rest_framework import status
from django.contrib.auth.models import User


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_sentences(request):
    sentences = Sentence.objects.filter(story=None)
    serializer = SentenceSerializer(sentences, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, ])
def get_ratings(request):
    user = request.user
    sentences = user.rating_set.all()
    serializer = RatingSerializer(sentences, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_mask_save(request):

    # Get all required variables from the request
    user = request.user
    sound_file: InMemoryUploadedFile = request.FILES['sound_file']
    sentence_id: int = int(request.POST['sentence_id'])

    # Fail case
    if isinstance(CoreConfig.vosk_asr, str):
        return Response("[0, 0, 0, 0]")

    # Convert obtained audio into a VOSK suitable format
    audio = AudioSegment.from_file_using_temporary_files(sound_file)
    audio_buffer = io.BytesIO()
    audio.export(audio_buffer, format='wav')
    audio_buffer.seek(0)

    # Use Vosk for speech recognition
    CoreConfig.vosk_asr.AcceptWaveform(audio_buffer.getvalue())

    result = json.loads(CoreConfig.vosk_asr.FinalResult())

    # Load the sentence to be compared
    sentence = Sentence.objects.get(pk=int(sentence_id))

    # Compare true sentence with decoded speech
    mask = compare_sentence(sentence.text, result['text'])
    words = [word for word in nltk.word_tokenize(
        sentence.text) if word.isalnum()]

    # Assign required attributes to response
    result['sentence_id'] = sentence_id
    result['mask'] = mask

    # Save the words as a pronunciation statistic
    for word, rating in zip(words, mask):
        w = Word.objects.get_or_create(text=word)[0]
        read_status = RatingModel(word=w, user=user, score=rating)
        read_status.save()
    print(result)

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_wordmask_save(request):

    # Get all required variables from the request
    user = request.user
    sound_file: InMemoryUploadedFile = request.FILES['sound_file']
    sentence_id: int = int(request.POST['sentence_id'])

    # Fail case
    if isinstance(CoreConfig.vosk_asr, str):
        return Response("[0, 0, 0, 0]")

    decoded_words = TextToSpeech.decode(sound_file)

    # Load the sentence to be compared
    sentence = Sentence.objects.get(pk=int(sentence_id))

    # Compare true sentence with decoded speech
    mask = compare_sentence(sentence.text, decoded_words)
    words = [word for word in nltk.word_tokenize(
        sentence.text) if word.isalnum()]

    # Assign required attributes to response
    result: Dict[str, Any] = {
        'sentence_id': sentence_id,
        'mask': mask,
        'words': words
    }

    # Save the words as a pronunciation statistic
    for word, rating in zip(nltk.word_tokenize(sentence.text), mask):
        w = Word.objects.get_or_create(text=word)[0]
        read_status = RatingModel(word=w, user=user, score=rating)
        read_status.save()

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_mask_nosave(request):

    # Get all required variables from the request
    user = request.user
    sound_file: InMemoryUploadedFile = request.FILES['sound_file']
    sentence_id: int = int(request.POST['sentence_id'])

    # Fail case
    if isinstance(CoreConfig.vosk_asr, str):
        return Response("[0, 0, 0, 0]")

    # Convert obtained audio into a VOSK suitable format
    audio = AudioSegment.from_file_using_temporary_files(sound_file)
    audio_buffer = io.BytesIO()
    audio.export(audio_buffer, format='wav')
    audio_buffer.seek(0)

    # Use Vosk for speech recognition
    CoreConfig.vosk_asr.AcceptWaveform(audio_buffer.getvalue())

    result = json.loads(CoreConfig.vosk_asr.FinalResult())

    # Load the sentence to be compared
    sentence = Sentence.objects.get(pk=int(sentence_id))

    # Compare true sentence with decoded speech
    mask = compare_sentence(sentence.text, result['text'])

    # Assign required attributes to response
    result['sentence_id'] = sentence_id
    result['mask'] = mask

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_wordmask_nosave(request):

    # Get all required variables from the request
    user = request.user
    sound_file: InMemoryUploadedFile = request.FILES['sound_file']
    sentence_id: int = int(request.POST['sentence_id'])

    # Fail case
    if isinstance(CoreConfig.vosk_asr, str):
        return Response("[0, 0, 0, 0]")

    # Convert obtained audio into a VOSK suitable format
    audio = AudioSegment.from_file_using_temporary_files(sound_file)
    audio_buffer = io.BytesIO()
    audio.export(audio_buffer, format='wav')
    audio_buffer.seek(0)

    # Use Vosk for speech recognition
    CoreConfig.vosk_asr.AcceptWaveform(audio_buffer.getvalue())

    result = json.loads(CoreConfig.vosk_asr.FinalResult())

    # Load the sentence to be compared
    sentence = Sentence.objects.get(pk=int(sentence_id))

    # Compare true sentence with decoded speech
    mask = compare_sentence(sentence.text, result['text'])
    words = [word for word in nltk.word_tokenize(
        sentence.text) if word.isalnum()]

    # Assign required attributes to response
    result['sentence_id'] = sentence_id
    result['words'] = words
    result['mask'] = mask

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_mispronunciation_wordmask_scaffold(request):

    # Get all required variables from the request
    user = request.user
    sound_file: InMemoryUploadedFile = request.FILES['sound_file']
    word_str: str = (request.POST['word'])

    # Fail case
    if isinstance(CoreConfig.vosk_asr, str):
        return Response("[0, 0, 0, 0]")

    decoded_words = TextToSpeech.decode(sound_file)

    # Load the sentence to be compared
    try:
        word = Word.objects.get(text=word_str)
    except Word.DoesNotExist:
        return Response(data={'message': 'word not found'}, status=status.HTTP_404_NOT_FOUND)

    print(word.text)
    print(decoded_words)

    # Compare true sentence with decoded speech
    mask = compare_sentence(word.text, decoded_words)

    # Assign required attributes to response
    result: Dict[str, Any] = {
        'word': word.text,
        'mask': mask,
    }

    read_status = RatingModel(word=word, user=user, score=mask[0])
    read_status.save()

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def get_mispronunciation_wordmask_practice(request):

    # Get all required variables from the request
    user = request.user
    sound_file: InMemoryUploadedFile = request.FILES['sound_file']
    word_str: str = (request.POST['word'])

    # Fail case
    if isinstance(CoreConfig.vosk_asr, str):
        return Response("[0, 0, 0, 0]")

    decoded_words = TextToSpeech.decode(sound_file)

    # Load the sentence to be compared
    try:
        word = Word.objects.get(text=word_str)
    except Word.DoesNotExist:
        return Response(data={'message': 'word not found'}, status=status.HTTP_404_NOT_FOUND)

    # Compare true sentence with decoded speech
    mask = compare_sentence(word.text, decoded_words)

    # Assign required attributes to response
    result: Dict[str, Any] = {
        'word': word.text,
        'mask': mask,
    }

    read_status = RatingModel(word=word, user=user, score=mask[0])
    read_status.save()

    return Response(result)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def practice_words(request):

    data = RatingModel.objects.all()

    grouped: Dict[UserItem, Rating] = {}

    for row in data:
        rating = Rating(id_=row.pk, user=row.user, item=row.word, rating=row.score)
        user_item = UserItem(user=row.user, item=row.word)
        grouped[user_item] = rating

    words: QuerySet[Word] = Word.objects.all()
    users: QuerySet[User] = User.objects.all()

    suggested_words = recommend_items(
            current_user=request.user, users=users, 
            items=words, grouped=grouped)
    suggested_words = sorted(suggested_words.items(), key=lambda x: x[1])

    suggestions = [word[0] for word in suggested_words]
    serializer = WordSerializer(suggestions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, ])
def practice_sentences(request):

    data = RatingModel.objects.all()

    grouped: Dict[UserItem, Rating] = {}

    for row in data:
        rating = Rating(id_=row.pk, user=row.user,
                        item=row.word, rating=row.score)
        user_item = UserItem(user=row.user, item=row.word)
        grouped[user_item] = rating

    words: Set[str] = Word.objects.all()
    users: Set[str] = User.objects.all()

    recc = recommend_items(
        current_user=request.user, users=users,
        items=words, grouped=grouped)
    recc = sorted(recc.items(), key=lambda x: x[1])

    top_10_words = [word[0] for word in recc[:10]]


    suggestions: List[Sentence] = []
    for i, word in enumerate(len(top_10_words)):
        random_index = randrange(0, 10)
        item = Sentence.objects.filter(text__contains=word).limit(5)[random_index]
        suggestions.append(item)
    
    serializer = SentenceSerializer(suggestions, many=True)
    return Response(serializer.data)
