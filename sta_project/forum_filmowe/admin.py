from django.contrib import admin
from .models import Actor, Director, Genre, Tag, Movie, Category, Post, Comment
from django.contrib.auth.models import User

admin.site.register(Actor)
admin.site.register(Director)
admin.site.register(Genre)
admin.site.register(Tag)
admin.site.register(Movie)
admin.site.register(Category)
admin.site.register(Post)
admin.site.register(Comment)
