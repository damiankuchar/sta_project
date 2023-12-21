document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like_button');
    const copyLinkButtons = document.querySelectorAll('.copyLinkBtn');
    const postDivs = document.querySelectorAll('.post');

    likeButtons.forEach((likeButton) => {
        likeButton.addEventListener('click', handleLike);
    });

    copyLinkButtons.forEach((copyLinkButton) => {
        copyLinkButton.addEventListener('click', handleCopyLink);
    })

    postDivs.forEach((postDiv) => {
        postDiv.addEventListener('click', () => {
            handleDetailLink(postDiv);
        });
    });

    function handleLike(event) {
        const postId = this.getAttribute('data-post-id');

        fetch(`/forum_filmowe/like_post/${postId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({})
        })
            .then(response => response.json()).then(data => {
                const postElement = document.getElementById(`post${postId}`);
                const likesCountElement = postElement.querySelector('.likes_count');

                likesCountElement.textContent = data.likes_count;

                const toastrMessage = data.liked
                    ? 'Polubiono post!'
                    : "Wycofano polubienie!";

                toastr.success(toastrMessage);
            })
            .catch(error => console.error('Error:', error));

        event.stopPropagation();
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

    // Clipboard function
    function handleCopyLink(event) {
        event.stopPropagation();

        const copyLinkBtn = event.currentTarget;

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
            .catch(err => console.log(err));

        const orginalButton = copyLinkBtn.innerHTML;
    }

    // Add moving to detail page
    function handleDetailLink(postDiv) {
        const postId = postDiv.id.replace('post', '');
        window.location.href = '/forum_filmowe/details/' + postId;
    }
})