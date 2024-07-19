document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');

    searchButton.addEventListener('click', () => {
        const category = document.getElementById('category').value.trim();
        if (category) {
            fetchBooksByCategory(category);
        }
    });

    function fetchBooksByCategory(category) {
        showLoading(true); 
        fetch(`https://openlibrary.org/subjects/${category}.json`)
            .then(response => response.json())
            .then(data => {
                displayBooks(data.works);
            })
            .catch(error => console.error('Error fetching books:', error))
            .finally(() => showLoading(false)); 
    }

    function displayBooks(books) {
        resultsContainer.innerHTML = '';
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `<h3>${book.title}</h3><p>Authors: ${book.authors.map(author => author.name).join(', ')}</p><div class="book-description"></div>`;
            bookItem.addEventListener('click', () => {
                fetchBookDescription(book.key, bookItem);
            });
            resultsContainer.appendChild(bookItem);
        });
    }

    function fetchBookDescription(bookKey, bookItem) {
        const url = `https://openlibrary.org${bookKey}.json`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const description = (typeof data.description === 'string' ? data.description : data.description?.value) || 'No description available';
                showDescription(bookItem, description);
            })
            .catch(error => console.error('Error fetching book description:', error));
    }

    function showDescription(bookItem, description) {
        
        document.querySelectorAll('.book-description').forEach(desc => {
            desc.innerHTML = '';
        });
        
        const descriptionDiv = bookItem.querySelector('.book-description');
        descriptionDiv.innerHTML = `<p>${description}</p>`;
    }

    function showLoading(isLoading) {
        if (isLoading) {
            resultsContainer.innerHTML = '<div class="loading">Loading...</div>';
        }
    }
});
