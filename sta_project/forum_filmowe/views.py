import uuid
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from .models import Category, Comment, Like, Movie, Post
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib import messages
from django.db.models import Count, Case, When, Exists, OuterRef, Q


def generate_unique_filename(filename):
    unique_id = uuid.uuid4().hex[:6]
    filename, ext = filename.split(".")
    new_filename = f"{filename}-{unique_id}.{ext}"
    return new_filename


def index(request):
    posts = Post.objects.annotate(
        num_comments=Count("comment", distinct=True),
        num_likes=Count("like", distinct=True),
        post_liked=Exists(Like.objects.filter(user=request.user, post=OuterRef("pk"))),
    ).order_by("-created_at")

    context = {"posts": posts}

    return render(request, "forum_filmowe/index.html", context)

def categories(request):
    categories = Category.objects.annotate(num_posts=Count('post')).all()    
    context = {"categories": categories}

    return render(request, "forum_filmowe/categories.html",context)

def category(request, category_name):
    posts = Post.objects.filter(category__name=category_name).annotate(
        num_comments=Count("comment", distinct=True),
        num_likes=Count("like", distinct=True),
        post_liked=Exists(Like.objects.filter(user=request.user, post=OuterRef("pk"))),
    ).order_by("-created_at")

    context = {"posts": posts}

    return render(request, "forum_filmowe/index.html", context)

def search(request):
    search_text = request.GET.get('search_text', '')

    posts = Post.objects.filter(
        Q(title__icontains=search_text) | Q(content__icontains=search_text)
    ).annotate(
        num_comments=Count("comment", distinct=True),
        num_likes=Count("like", distinct=True),
        post_liked=Exists(Like.objects.filter(user=request.user, post=OuterRef("pk"))),
    ).order_by("-created_at")

    context = {"posts": posts}

    return render(request, "forum_filmowe/index.html", context)

def movies_index(request):
    context = {"movies": Movie.objects.all()}
    return render(request, "forum_filmowe/index.html", context)


def add_post(request):
    if request.method == "POST":
        post = Post()

        if request.user.is_authenticated:
            post.author = request.user
        else:
            return redirect("forum_filmowe:add_post")

        post.title = request.POST["title"]
        post.content = request.POST["content"]

        category = request.POST["category"]

        if len(request.FILES) != 0:
            image = request.FILES["image"]
            unique_image_name = generate_unique_filename(image.name)
            image_file = SimpleUploadedFile(unique_image_name, image.read())
            post.image = image_file

        try:
            category = Category.objects.get(id=category)
            post.category = category
        except Category.DoesNotExist:
            messages.error(request, "Podana kategoria nie istnieje w systemie.")
            return redirect("forum_filmowe:add_post")

        post.save()

        messages.success(request, "Pomyślnie dodano wpis!")

        return redirect("/forum_filmowe")

    categories = Category.objects.all()
    context = {"categories": categories}

    return render(request, "forum_filmowe/add_post.html", context)


def like_post(request, post_id):
    try:
        if not request.user.is_authenticated:
            raise Exception("Musisz być zalogowany aby polubić post!")

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

        return JsonResponse(
            {"success": True, "liked": liked, "likes_count": likes_count}
        )
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})


def details(request, post_id):
    post = get_object_or_404(Post, id=post_id)

    comments_number = post.comment_set.count()
    likes_number = post.like_set.count()
    post_liked = Like.objects.filter(user=request.user, post=post).exists()
    comments = post.comment_set.all().order_by("-created_at")

    context = {
        "post": post,
        "comments": comments,
        "comments_number": comments_number,
        "likes_number": likes_number,
        "post_liked": post_liked,
    }

    return render(request, "forum_filmowe/details.html", context)


def add_comment_to_post(request, post_id):
    try:
        if not request.user.is_authenticated:
            raise Exception("Musisz być zalogowany aby dodać komentarz!")

        post = get_object_or_404(Post, id=post_id)

        if request.method == "POST":
            text = request.POST["comment"]
            user = request.user

            comment = Comment.objects.create(user=user, post=post, text=text)
            comment.save()

            messages.success(request, "Pomyślnie dodano komentarz!")

        return redirect("forum_filmowe:details", post_id=post_id)
    except Exception as e:
        messages.error(request, str(e))
        return redirect("forum_filmowe:details", post_id=post_id)

def remove_comment_from_post(request, comment_id):
    try:
        if not request.user.is_authenticated:
            raise Exception("Musisz być zalogowany aby usunąć komentarz!")


        comment = get_object_or_404(Comment, id=comment_id)

        if request.method == "DELETE":
            if comment.user != request.user:
                raise Exception("Nie masz uprawnień do usunięcia tego komentarza!")

            comment.delete()

            return JsonResponse({"success": True, "message": "Pomyślnie usunięto komentarz!"})

        return redirect("forum_filmowe:details", post_id=post_id)
    except Exception as e:
        messages.error(request, str(e))
        return redirect("forum_filmowe:details", post_id=post_id)
    
def edit_comment(request, comment_id):
    try:
        if not request.user.is_authenticated:
            raise Exception("Musisz być zalogowany, aby edytować komentarze!")

        comment = get_object_or_404(Comment, id=comment_id, user=request.user)

        if request.method == "POST":
            if comment.user != request.user:
                raise Exception("Nie masz uprawnień do edytowania tego komentarza!")
            new_text = request.POST.get('new_text', '')
            
            comment.text = new_text
            comment.save()

            return JsonResponse({"success": True, "message": "Pomyślnie zaktualizowano komentarz!"})

    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)})