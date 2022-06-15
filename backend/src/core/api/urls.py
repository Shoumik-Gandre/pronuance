from django.urls import path
from . import views

urlpatterns = [
    path('sentences/', views.get_sentences),
    path('ratings/', views.get_ratings),
    path('get-mispronunciation-sentencemask-challenge/', views.get_mispronunciation_sentencemask_challenge),
    path('get-mispronunciation-wordmask-scaffold/', views.get_mispronunciation_wordmask_scaffold),
    path('get-mispronunciation-wordmask-practice/', views.get_mispronunciation_wordmask_practice),
    path('get-mispronunciation-sentencemask-practice/', views.get_mispronunciation_sentencemask_practice),
    path('practice-words/', views.practice_words),
    path('practice-sentences/', views.practice_sentences),
]