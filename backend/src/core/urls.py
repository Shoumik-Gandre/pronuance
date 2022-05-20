from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='quiz-sentences'),
    path('upload', views.upload, name='upload-mask'),
    path('getmask-words-nosave/', views.get_mask_word_no_save, name='getmask-words-nosave'),
    path('practice_words', views.practice_words, name='recommend-words'),
    path('practice_sentences', views.practice_sentences, name='recommend-sentences'),
]