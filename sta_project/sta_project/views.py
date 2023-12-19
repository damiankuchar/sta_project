from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.shortcuts import render, redirect
from django.contrib import messages

def index(request):
    return render(request, 'index.html')


def login(request):
    if request.user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            messages.success(request, 'Zalogowano pomyślnie.')
            return redirect('/')
        else:
            messages.error(request, 'Nieprawidłowy login lub hasło.')

    return render(request, 'login.html')


def register(request):
    if request.user.is_authenticated:
        return redirect('/')

    if request.method == 'POST':
        email = request.POST['email']
        username = request.POST['username']
        password = request.POST['password']

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Użytkownik o tej nazwie już istnieje.')
            return redirect('register')

        user = User.objects.create_user(email=email, username=username, password=password)
        user.save()

        auth_login(request, user)
        
        messages.success(request, 'Rejestracja zakończona pomyślnie.')
        return redirect('/')

    return render(request, 'register.html')


def logout(request):
    auth_logout(request)
    messages.success(request, 'Wylogowano pomyślnie.')
    return redirect('/')