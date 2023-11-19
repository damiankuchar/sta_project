from django.db import models
from django.contrib.auth.models import User


class Actor(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)


class Director(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)


class Genre(models.Model):
    name = models.CharField(max_length=30, unique=True)


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)


class Movie(models.Model):
    title = models.CharField(max_length=70)
    description = models.TextField()
    release_date = models.DateField()
    director = models.ForeignKey(Director, on_delete=models.SET_NULL, null=True)
    tags = models.ManyToManyField(Tag)
    actors = models.ManyToManyField(Actor)
    genres = models.ManyToManyField(Genre)


class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)


class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
