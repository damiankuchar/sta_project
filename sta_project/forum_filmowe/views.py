import uuid
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from .models import Category, Like, Movie, Post
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib import messages
from django.db.models import Count

def generate_unique_filename(filename):
    unique_id = uuid.uuid4().hex[:6]
    filename, ext = filename.split('.')
    new_filename = f"{filename}-{unique_id}.{ext}"
    return new_filename


def index(request):
    posts = Post.objects.annotate(num_comments=Count('comment'), num_likes=Count('like')).order_by('-created_at')

    context = { 'posts': posts }

    return render(request, "forum_filmowe/index.html", context)


def movies_index(request):
    context = {"movies": Movie.objects.all()}
    return render(request, "forum_filmowe/index.html", context)


def add_post(request):
    if request.method == 'POST':
        post = Post()

        if request.user.is_authenticated:
            post.author = request.user
        else:
            return redirect('forum_filmowe:add_post')
        
        post.title = request.POST['title']
        post.content = request.POST['content']
        
        category = request.POST['category']

        if len(request.FILES) != 0:
            image = request.FILES['image']
            unique_image_name = generate_unique_filename(image.name)
            image_file = SimpleUploadedFile(unique_image_name, image.read())
            post.image = image_file

        try:
            category = Category.objects.get(id=category)
            post.category = category
        except Category.DoesNotExist:
            messages.error(request, 'Podana kategoria nie istnieje w systemie.')
            return redirect('forum_filmowe:add_post')
        
        post.save()

        messages.success(request, 'Pomyślnie dodano wpis!')

        return redirect('/forum_filmowe')

    categories = Category.objects.all()
    context = { 'categories': categories }

    return render(request, 'forum_filmowe/add_post.html', context)


def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user

    if Like.objects.filter(user=user, post=post).exists():
        # Unlike the post
        Like.objects.filter(user=user, post=post).delete()
        post.save()
        liked = False
    else:
        # Like the post
        Like.objects.create(user=user, post=post)
        post.save()
        liked = True

    likes_count = post.like_set.count()

    return JsonResponse({ 'liked': liked, 'likes_count': likes_count })