from django.urls import path
from . import views

app_name='forum_filmowe'
urlpatterns = [
    path("", views.index, name='index'),
    path("movies/", views.movies_index),
    path('add_post/', views.add_post, name='add_post'),
    path('like_post/<int:post_id>/', views.like_post, name='like_post'),
]