from django.urls import path
from . import views

urlpatterns = [
    path('sentences/', views.get_sentences),
    path('ratings/', views.get_ratings),
    path('getmask/', views.get_mask_save),
    path('getwordmask/', views.get_wordmask_save),
    path('getmask-nosave/', views.get_mask_nosave),
    path('getwordmask-nosave/', views.get_wordmask_nosave),
    path('get-mispronunciation-wordmask-scaffold/', views.get_mispronunciation_wordmask_scaffold),
    path('get-mispronunciation-wordmask-practice/', views.get_mispronunciation_wordmask_practice),
    path('practice-words/', views.practice_words),
    path('practice-sentences/', views.practice_sentences),
]