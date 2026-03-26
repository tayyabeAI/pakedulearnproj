document.addEventListener('DOMContentLoaded', function() {
    const text = "Welcome To UrduAI Vibe Coding Learners";
    const typingElement = document.querySelector('.typing-effect');
    let index = 0;

    function type() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            typingElement.style.borderRight = 'none'; // Hide cursor after typing
        }
    }

    type();

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});
