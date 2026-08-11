// Toggle the GitBook left sidebar (used by the top-nav hamburger, esp. on mobile)
function gitbookToggleSummary() {
    var book = document.querySelector('.book');
    if (book) {
        book.classList.toggle('with-summary');
    }
}
