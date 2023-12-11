from django.shortcuts import render
from django.http import HttpResponse
from .models import Movie
from django.template import loader


def index(request):
    return render(request, "forum_filmowe/index.html")


def movies_index(request):
    context = {"movies": Movie.objects.all()}
    return render(request, "forum_filmowe/index.html", context)
