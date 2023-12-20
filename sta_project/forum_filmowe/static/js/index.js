document.addEventListener('DOMContentLoaded', () => {
    const likeButtons = document.querySelectorAll('.like_button');

    likeButtons.forEach((likeButton) => {
        likeButton.addEventListener('click', handleLike);
    });

    function handleLike() {
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
})