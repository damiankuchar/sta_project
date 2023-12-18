from django.urls import path
from . import views

app_name='forum_filmowe'
urlpatterns = [
    path("", views.index, name='index'),
    path("movies/", views.movies_index),
]
