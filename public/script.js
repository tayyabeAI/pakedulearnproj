document.addEventListener('DOMContentLoaded', function () {
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined') {
        console.error('Firebase is not loaded. Make sure you have included the Firebase scripts and configured them correctly.');
        return;
    }

    // Firebase Database Reference
    const db = firebase.database();

    // --- Visitor Counter ---
    const visitorCounter = db.ref('siteStats/visitors');
    visitorCounter.transaction(function (currentValue) {
        return (currentValue || 0) + 1;
    });
    visitorCounter.on('value', (snapshot) => {
        document.getElementById('visitor-counter').textContent = snapshot.val() || 0;
    });

    // --- Like Button ---
    const likeCounter = db.ref('siteStats/likes');
    const likeButton = document.getElementById('like-button');
    const likedInSession = 'likedInSession';

    likeCounter.on('value', (snapshot) => {
        document.getElementById('like-counter').textContent = snapshot.val() || 0;
    });

    // Check if the user has already liked in this session
    if (sessionStorage.getItem(likedInSession)) {
        likeButton.disabled = true;
        likeButton.classList.add('liked');
        likeButton.textContent = 'Liked';
    }

    likeButton.addEventListener('click', () => {
        if (!sessionStorage.getItem(likedInSession)) {
            likeCounter.transaction(function (currentValue) {
                return (currentValue || 0) + 1;
            });
            sessionStorage.setItem(likedInSession, 'true');
            likeButton.disabled = true;
            likeButton.classList.add('liked');
            likeButton.textContent = 'Liked';
        }
    });

    // --- Comment Section ---
    const commentsRef = db.ref('comments');
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('comment-name').value;
        const text = document.getElementById('comment-text').value;

        if (name && text) {
            const newComment = {
                author: name,
                text: text,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            commentsRef.push(newComment);
            document.getElementById('comment-form').reset();
        }
    });

    // Listen for new comments
    commentsRef.orderByChild('timestamp').on('child_added', (snapshot) => {
        const commentData = snapshot.val();
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const authorElement = document.createElement('div');
        authorElement.classList.add('comment-author');
        authorElement.textContent = commentData.author;

        const dateElement = document.createElement('span');
        dateElement.classList.add('comment-date');
        dateElement.textContent = new Date(commentData.timestamp).toLocaleString();

        const textElement = document.createElement('p');
        textElement.textContent = commentData.text;

        authorElement.appendChild(dateElement);
        commentElement.appendChild(authorElement);
        commentElement.appendChild(textElement);

        commentsList.prepend(commentElement); // Prepend to show newest first
    });
});
