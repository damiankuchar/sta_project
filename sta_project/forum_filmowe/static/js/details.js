function handleSingleLike() {
    const likeButton = document.getElementById('like_button');
    const postId = likeButton.getAttribute('data-post-id');


    fetch(`/forum_filmowe/like_post/${postId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const postElement = document.getElementById(`post${postId}`);
                const likesCountElement = postElement.querySelector('.likes_count');
                if (data.liked) {
                    likeButton.classList = []
                    likeButton.classList.add(
                        'like_button',
                        'inline-flex',
                        'items-center',
                        'px-2',
                        'py-1',
                        'text-sm',
                        'font-medium',
                        'bg-green-500',
                        'border',
                        'border-gray-200',
                        'rounded-s-lg',
                        'hover:bg-gray-100',
                        'focus:z-10',
                        'focus:ring-2',
                        'dark:bg-green-200',
                        'dark:border-gray-600',
                        'dark:bg-green-200',
                        'dark:hover:text-white',
                        'dark:hover:bg-green-200',
                        'dark:focus:text-white'
                    );
                } else {
                    likeButton.classList = []
                    likeButton.classList.add(
                        'like_button',
                        'inline-flex',
                        'items-center',
                        'px-2',
                        'py-1',
                        'text-sm',
                        'font-medium',
                        'bg-white',
                        'border',
                        'border-gray-200',
                        'rounded-s-lg',
                        'hover:bg-gray-100',
                        'focus:z-10',
                        'focus:ring-2',
                        'dark:bg-gray-700',
                        'dark:border-gray-600',
                        'dark:text-white',
                        'dark:hover:text-white',
                        'dark:hover:bg-gray-600',
                        'dark:focus:text-white'
                    );
                }

                likesCountElement.textContent = data.likes_count;

                const toastrMessage = data.liked
                    ? 'Polubiono post!'
                    : "Wycofano polubienie!";

                toastr.success(toastrMessage);
            } else {
                toastr.error(data.message);
            }
        })
        .catch(error => {
            console.log("Error in handleSingleLike()")
        });
}


function handleSingleCopyLink() {
    const copyLinkBtn = document.getElementById('copyLinkBtn');

    const postId = copyLinkBtn.getAttribute('data-post-id');

    navigator.clipboard
        .writeText(`${window.location.origin}/forum_filmowe/details/${postId}`)
        .then(() => {
            const orginalButton = copyLinkBtn.innerHTML;
            copyLinkBtn.innerHTML = '<svg class="w-4 h-4 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/></svg> Copied';
            setTimeout(function () {
                copyLinkBtn.innerHTML = orginalButton;
            }, 2000);
        })
        .catch(err => {
            console.log("Error")
        });

    const orginalButton = copyLinkBtn.innerHTML;
}

// Function to get CSRF token from cookies
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Search for a name/value pair with '='
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function funkcjaPoRenderze() {
    const likeButton = document.getElementById('like_button');
    const postId = likeButton.getAttribute('data-post-id');
    const postElement = document.getElementById(`post${postId}`);
    const postLiked = postElement.dataset.postLiked === 'true';
    if (postLiked) {
        likeButton.classList = []
        likeButton.classList.add(
            'like_button',
            'inline-flex',
            'items-center',
            'px-2',
            'py-1',
            'text-sm',
            'font-medium',
            'bg-green-500',
            'border',
            'border-gray-200',
            'rounded-s-lg',
            'hover:bg-gray-100',
            'focus:z-10',
            'focus:ring-2',
            'dark:bg-green-100',
            'dark:border-gray-600',
            'dark:bg-green-100',
            'dark:hover:text-white',
            'dark:hover:bg-green-100',
            'dark:focus:text-white'
        );
    } else {
        likeButton.classList = []
        likeButton.classList.add(
            'like_button',
            'inline-flex',
            'items-center',
            'px-2',
            'py-1',
            'text-sm',
            'font-medium',
            'bg-white',
            'border',
            'border-gray-200',
            'rounded-s-lg',
            'hover:bg-gray-100',
            'focus:z-10',
            'focus:ring-2',
            'dark:bg-gray-700',
            'dark:border-gray-600',
            'dark:text-white',
            'dark:hover:text-white',
            'dark:hover:bg-gray-600',
            'dark:focus:text-white'
        );
    }
    const editCommentLinks = document.querySelectorAll('.edit-comment');

    editCommentLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const commentId = this.getAttribute('data-comment-id');
            handleEditComment(commentId)
        });
    });

    const deleteCommentLinks = document.querySelectorAll('.delete-comment');

    deleteCommentLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const commentId = this.getAttribute('data-comment-id');
            handleDeleteComment(commentId)
        });
    });
}

window.addEventListener('load', funkcjaPoRenderze);

function handleEditComment(commentId){
    const commentTextElement = document.getElementById(`commentText${commentId}`);
    const editCommentElement = document.getElementById(`editComment${commentId}`);
    const saveButton = document.getElementById(`saveButton${commentId}`);
    
    commentTextElement.style.display = 'none';
    editCommentElement.style.display = 'block';
    saveButton.classList.remove('hidden')

    saveButton.addEventListener('click', () => saveEditedComment(commentId));
}

function saveEditedComment(commentId) {
    const editCommentElement = document.getElementById(`editComment${commentId}`);
    const saveButton = document.getElementById(`saveButton${commentId}`);
    const newCommentText = editCommentElement.value;

    fetch(`/forum_filmowe/edit_comment/${commentId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: `new_text=${encodeURIComponent(newCommentText)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const commentTextElement = document.getElementById(`commentText${commentId}`);
                commentTextElement.innerText = newCommentText;

                commentTextElement.style.display = 'block';
                editCommentElement.style.display = 'none';
                saveButton.classList.add('hidden')
            } else {
                console.error(data.message);
            }
        })
        .catch(error => {
            console.log("Error in saveEditedComment()")
        });
}

function handleDeleteComment(commentId) {
    const commentElement = document.getElementById(`Comment${commentId}`);
    fetch(`/forum_filmowe/remove_comment/${commentId}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (commentElement) {
                    commentElement.remove(); 
                } else {
                    console.error(`Element komentarza o ID ${commentId} nie został znaleziony.`);
                }
            } else {
                console.error(data.message);
            }
        })
        .catch(error => {
            console.log("Error in handleDeleteComment()")
        });
}