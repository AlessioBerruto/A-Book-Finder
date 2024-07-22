document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');
    const searchContainer = document.querySelector('.search-container');
    let activeBookItem = null;

    searchButton.addEventListener('click', async () => {
        const category = document.getElementById('category').value.trim();
        if (category) {
            await fetchBooksByCategory(category);
        }
    });

    async function fetchBooksByCategory(category) {
        showLoading(true);
        try {
            const response = await fetch(`https://openlibrary.org/subjects/${category}.json`);
            const data = await response.json();
            displayBooks(data.works);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            showLoading(false);
        }
    }

    function displayBooks(books) {
        if (books.length > 0) {
            resultsContainer.style.display = 'block';
            searchContainer.classList.remove('centered');
            searchContainer.classList.add('top');
            document.body.classList.add('search-active');
            resultsContainer.innerHTML = '';
            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.className = 'book-item';
                bookItem.innerHTML = `<h3>${book.title}</h3><p>Authors: ${book.authors.map(author => author.name).join(', ')}</p><div class="book-description"></div>`;
                bookItem.addEventListener('click', () => {
                    if (activeBookItem === bookItem) {
                        toggleDescription(bookItem);
                    } else {
                        fetchBookDescription(book.key, bookItem);
                    }
                });
                resultsContainer.appendChild(bookItem);
            });
        } else {
            resultsContainer.style.display = 'none';
        }
    }

    async function fetchBookDescription(bookKey, bookItem) {
        try {
            const url = `https://openlibrary.org${bookKey}.json`;
            const response = await fetch(url);
            const data = await response.json();
            const description = (typeof data.description === 'string' ? data.description : data.description?.value) || 'No description available';
            showDescription(bookItem, description);
        } catch (error) {
            console.error('Error fetching book description:', error);
        }
    }

    function showDescription(bookItem, description) {
        document.querySelectorAll('.book-description').forEach(desc => {
            desc.innerHTML = '';
        });

        const descriptionDiv = bookItem.querySelector('.book-description');
        descriptionDiv.innerHTML = `<p>${description}</p>`;
        activeBookItem = bookItem;
    }

    function toggleDescription(bookItem) {
        const descriptionDiv = bookItem.querySelector('.book-description');
        if (descriptionDiv.innerHTML === '') {
            fetchBookDescription(bookItem.key, bookItem);
        } else {
            descriptionDiv.innerHTML = '';
            activeBookItem = null;
        }
    }

    function showLoading(isLoading) {
        const searchButton = document.getElementById('search-button');
        if (isLoading) {
            resultsContainer.innerHTML = '<div class="loading">Loading...</div>';
            resultsContainer.style.display = 'block';
            searchButton.disabled = true;
        } else {
            searchButton.disabled = false;
        }
    }
});

