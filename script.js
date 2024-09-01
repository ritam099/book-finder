const searchInput = document.getElementById('search');
const submitForm = document.getElementById('submit');
const randomBtn = document.querySelector('.random-btn');
const showAllBtn = document.querySelector('.show-all-btn');
const booksEl = document.getElementById('books');
const resultHeading = document.getElementById('result-heading');
const genreButtons = document.querySelectorAll('.genre-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

let currentPage = 1;
const booksPerPage = 6;
let currentBooks = []; 

// fetching the JSON data
async function getBooks() {
  const res = await fetch('books.json');
  const data = await res.json();
  return data.books;
}

// pagination
function displayBooks(books) {
  currentBooks = books; // Update the current books to be paginated
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToShow = books.slice(startIndex, endIndex);

  if (booksToShow.length === 1) {
    booksEl.classList.add('single-book');
  } else {
    booksEl.classList.remove('single-book');
  }

  booksEl.innerHTML = booksToShow
    .map(book => `
      <div class="book">
        <img src="${book.cover}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p>${book.description}</p>
      </div>
    `)
    .join('');

  displayPaginationControls(books.length); 
}

// Function to display pagination controls
function displayPaginationControls(totalBooks) {
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const paginationEl = document.getElementById('pagination');
  paginationEl.innerHTML = `
    <button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
    Page ${currentPage} of ${totalPages}
    <button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
  `;

  // Add event listeners for pagination buttons
  document.querySelector('.prev-btn').addEventListener('click', prevPage);
  document.querySelector('.next-btn').addEventListener('click', nextPage);
}


async function showAllBooks() {
  const books = await getBooks();
  currentPage = 1; // Reset to the first page
  resultHeading.innerHTML = '<h2>All Books:</h2>';
  displayBooks(books);
}

// Search books
async function searchBooks(e) {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  const books = await getBooks();
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm) ||
    book.description.toLowerCase().includes(searchTerm)
  );

  currentPage = 1; // Reset to the first page
  resultHeading.innerHTML = `<h2>Search Results for '${searchTerm}':</h2>`;
  displayBooks(filteredBooks);
  searchInput.value = '';
}

// random book
async function showRandomBook() {
  const books = await getBooks();
  const randomIndex = Math.floor(Math.random() * books.length);
  const randomBook = [books[randomIndex]];
  resultHeading.innerHTML = `<h2>Random Book:</h2>`;
  displayBooks(randomBook);
}

//book genre
async function showBooksByGenre(e) {
  const genre = e.target.innerText.toLowerCase();
  const books = await getBooks();
  const filteredBooks = books.filter(book => book.genre.toLowerCase() === genre);
  currentPage = 1; // Reset to the first page
  resultHeading.innerHTML = `<h2>Books in the '${genre}' Genre:</h2>`;
  displayBooks(filteredBooks);
}


function nextPage() {
  currentPage++;
  displayBooks(currentBooks);
}


function prevPage() {
  currentPage--;
  displayBooks(currentBooks);
}

// Sorting by author
async function sortBooksByAuthor(author) {
  const books = await getBooks();
  const sortedBooks = books.filter(book => book.author === author);
  currentPage = 1; // Reset to the first page
  resultHeading.innerHTML = `<h2>Books by ${author}:</h2>`;
  displayBooks(sortedBooks);
}


submitForm.addEventListener('submit', searchBooks);
randomBtn.addEventListener('click', showRandomBook);
showAllBtn.addEventListener('click', showAllBooks);
genreButtons.forEach(button => button.addEventListener('click', showBooksByGenre));
sortButtons.forEach(button => {
  button.addEventListener('click', () => {
    const author = button.getAttribute('data-author');
    sortBooksByAuthor(author);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  resultHeading.innerHTML = ''; 
  booksEl.innerHTML = ''; 
  document.getElementById('pagination').innerHTML = ''; 
});
