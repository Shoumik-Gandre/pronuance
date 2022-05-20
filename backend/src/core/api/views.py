import io
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Rating as RatingModel, Sentence, Story, Word
from core.apps import CoreConfig
from core.word_comparater import compare_sentence

from .serializers import SentenceSerializer, WordSerializer, RatingSerializer
from django.core.files.uploadedfile import InMemoryUploadedFile

import json
from pydub import AudioSegment
import nltk


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def get_sentences(request):
    sentences = Sentence.objects.filter(story=None)
    serializer = SentenceSerializer(sentences, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated,])
def get_ratings(request):
    user = request.user
    sentences = user.rating_set.all()
    serializer = RatingSerializer(sentences, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated,])
def get_mask(request):

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
    print(mask)

    # Save the words as a pronunciation statistic
    for word, rating in zip(nltk.word_tokenize(sentence.text), mask):
        w = Word.objects.get_or_create(text=word)[0]
        read_status = RatingModel(word=w, user=user, score=rating)
        read_status.save()
    print(result)
    
    return Response(result)