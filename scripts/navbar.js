function openQuestionnaire() {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSf1nytpAv-i1xYy7wXb_Et3JU51sw7lz8TCHcpHn5jIoklmHQ/viewform", "_blank"); 
}

function scrollToTutorialContent() {
    // Get the tutorial-content element
    var tutorialContent = document.getElementById('tutorial-content');
    
    // Scroll to the tutorial-content element with smooth animation
    tutorialContent.scrollIntoView({ behavior: 'smooth' });
}

function toggleDarkMode() {
    // Toggle the dark mode class on the body element
    document.body.classList.toggle('dark-mode');
}   