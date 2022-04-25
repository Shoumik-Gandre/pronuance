import json
import wave

from core.word_comparater import compare_sentence
from .serializers import SentenceSerializer, WordSerializer, RatingSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Rating as RatingModel, Sentence, Story, Word
from core import apps

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
    user = request.user
    print('-'*80)
    print(request.data)
    print(request.POST)
    print(request.FILES)
    
    print('-'*80)

    sound_file = request.FILES['sound_file']
    sentence_id = request.POST['sentence_id']

    sound_file = wave.open(sound_file, 'rb')
    apps.CoreConfig.vosk_asr.AcceptWaveform(
        sound_file.readframes(
            sound_file.getnframes()
        )
    )
    result = json.loads(
        apps.CoreConfig.vosk_asr.FinalResult()
    )
    
    sentence = Sentence.objects.get(pk=int(sentence_id))
    result['sentence_id'] = sentence_id

    mask = compare_sentence(sentence.text, result['text'])
    result['mask'] = mask
    print(mask)

    for word, rating in zip(sentence.text.split(' '), mask):
        w = Word.objects.get_or_create(text=word)[0]
        read_status = RatingModel(word=w, user=request.user, score=rating)
        read_status.save()
    
    return Response(result)