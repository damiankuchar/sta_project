from django.urls import path
from . import views

app_name='forum_filmowe'
urlpatterns = [
    path("", views.index, name='index'),
    path("movies/", views.movies_index),
    path('add_post/', views.add_post, name='add_post'),
    path('like_post/<int:post_id>/', views.like_post, name='like_post'),
    path('details/<int:post_id>/', views.details, name='details'),
    path('add_comment/<int:post_id>/', views.add_comment_to_post, name='add_comment'),
    path('remove_comment/<int:comment_id>/', views.remove_comment_from_post, name='remove_comment_from_post'),
    path('edit_comment/<int:comment_id>/', views.edit_comment, name='edit_comment'),
]