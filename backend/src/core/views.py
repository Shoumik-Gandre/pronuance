from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

import wave
import json

from core.utils import get_words_from_sentence

from . import apps
from .models import Sentence, Rating as RatingModel, Word
from .word_comparater import compare_sentence
from .recommend import UserItem, recommend_items, Rating
from typing import Dict, Set


@login_required
def index(request: HttpRequest):
    return render(request, 'core/record.html', context={
        'sentences': Sentence.objects.filter(story=None)
    })


@csrf_exempt
@login_required
def upload(request: HttpRequest):
    if request.method == 'POST':
        filename = request.POST['fname']
        sound_file = request.FILES['data']
        sound_file = wave.open(sound_file, 'rb')
        # apps.CoreConfig.vosk_asr.SetWords(True)
        apps.CoreConfig.vosk_asr.AcceptWaveform(sound_file.readframes(sound_file.getnframes()))
        result = json.loads(apps.CoreConfig.vosk_asr.FinalResult())
        sentence_id = request.POST.get('sentence_id', None)
        result['sentence_id'] = sentence_id
        sentence = Sentence.objects.get(pk=int(sentence_id))
        print(result)

        ### COMPARE sentence AND result['text'] here
        mask = compare_sentence(sentence.text, result['text'])
        print(mask)
        result['mask'] = mask
        for word, rating in zip(get_words_from_sentence(sentence.text), mask):
            w = Word.objects.get_or_create(text=word)[0]
            read_status = RatingModel(word=w, user=request.user, score=rating)
            read_status.save()

    return JsonResponse(json.dumps(result), safe=False)


@csrf_exempt
@login_required
def get_mask_word_no_save(request):
    
    if request.method == 'POST':

        sound_file = request.FILES['data']
        sound_file = wave.open(sound_file, 'rb')
        word_id = request.POST.get('word_id', None)

        # apps.CoreConfig.vosk_asr.SetWords(True)
        apps.CoreConfig.vosk_asr.AcceptWaveform(sound_file.readframes(sound_file.getnframes()))

        result = json.loads(apps.CoreConfig.vosk_asr.FinalResult())

        result['word_id'] = word_id
        word_obj = Word.objects.get(pk=int(word_id))
        print(result)

        ### COMPARE sentence AND result['text'] here
        mask = compare_sentence(word_obj.text, result['text'])
        
        result['mask'] = mask

    return JsonResponse(json.dumps(result), safe=False)



def practice_words(request):

    data = RatingModel.objects.all()

    grouped: Dict[UserItem, Rating] = {}

    for row in data:
        rating = Rating(
            id_=row.pk, user=row.user, 
            item=row.word, rating=row.score
        )
        user_item = UserItem(
            user=row.user, 
            item=row.word
        )
        grouped[user_item] = rating

    words: Set[str] = Word.objects.all()
    users: Set[str] = User.objects.all()

    recc = recommend_items(
            current_user=request.user, users=users, 
            items=words, grouped=grouped)
    recc = sorted(recc.items(), key=lambda x: x[1])
    # print(recc)
    # print(type(recc[0][0]))
    # print([word[0] for word in recc])
    return render(request, 'core/recommend_words.html', context={'words': [word[0] for word in recc]})


def practice_sentences(request):

    data = RatingModel.objects.all()

    grouped: Dict[UserItem, Rating] = {}

    for row in data:
        rating = Rating(
            id_=row.pk, user=row.user, 
            item=row.word, rating=row.score
        )
        user_item = UserItem(
            user=row.user, 
            item=row.word
        )
        grouped[user_item] = rating

    words: Set[str] = Word.objects.all()
    users: Set[str] = User.objects.all()

    recc = recommend_items(
            current_user=request.user, users=users, 
            items=words, grouped=grouped)
    recc = sorted(recc.items(), key=lambda x: x[1])

    top_10_words = [word[0] for word in recc[:10]]
    i = 0
    print(top_10_words)

    q1 = Sentence.objects.filter(text__contains=top_10_words[i])
    print(q1)

    while i < 9 and len(q1) > 10:
        i += 1
        q2 = q1.filter(text__contains=top_10_words[i])
        print(q1)
        print(q2)
        if len(q2) < 10:
            break
        elif len(q2) >= 10:
            q1 = q2   

    return render(request, 'core/recommend_sentences.html', context={'words': q1})
