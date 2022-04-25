from django.urls import path
from . import views

urlpatterns = [
    path('sentences/', views.get_sentences),
    path('ratings/', views.get_ratings),
    path('getmask/', views.get_mask)
]