const bookTableBody = document.querySelector('#bookTable tbody');
const messageDiv = document.getElementById('message');

// Hent bøker fra backend
function fetchBooks() {
  fetch('http://localhost:3000/api/books')
    .then(res => res.json())
    .then(books => {
      bookTableBody.innerHTML = '';
      books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.genre}</td>
          <td>${book.status}</td>
          <td>
            <button onclick="editBook(${book.id})">Rediger</button>
            <button class="delete-btn" onclick="deleteBook(${book.id})">Slett</button>
          </td>
        `;
        bookTableBody.appendChild(row);
      });
    });
}

function deleteBook(id) {
  fetch(`http://localhost:3000/api/books/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    showMessage(data.message);
    fetchBooks();
  });
}

function showMessage(msg) {
  messageDiv.innerText = msg;
  setTimeout(() => messageDiv.innerText = '', 3000);
}

const bookForm = document.getElementById('bookForm');

bookForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Forhindrer at siden laster på nytt

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;

  const bookData = { title, author, genre };

  fetch('http://localhost:3000/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message);
      fetchBooks(); // Oppdater listen
      bookForm.reset(); // Tøm skjema
    })
    .catch(err => {
      showMessage('Noe gikk galt...');
      console.error(err);
    });
});

let editBookId = null;

function editBook(id) {
  fetch(`http://localhost:3000/api/books/${id}`)
    .then(res => res.json())
    .then(book => {
      document.getElementById('editTitle').value = book.title;
      document.getElementById('editAuthor').value = book.author;
      document.getElementById('editGenre').value = book.genre;
      editBookId = book.id;
      document.getElementById('editBookForm').style.display = 'block';
    });
}

document.getElementById('editBookForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('editTitle').value;
  const author = document.getElementById('editAuthor').value;
  const genre = document.getElementById('editGenre').value;

  const updatedBookData = { title, author, genre };

  fetch(`http://localhost:3000/api/books/${editBookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBookData),
  })
    .then(res => res.json())
    .then(data => {
      showMessage(data.message);
      fetchBooks(); // Oppdater listen etter redigering
      document.getElementById('editBookForm').reset();
      document.getElementById('editBookForm').style.display = 'none';
    })
    .catch(err => {
      showMessage('Noe gikk galt...');
      console.error(err);
    });
});


const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Lagre brukerens valg i localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Sjekk brukerens preferanse ved lasting av siden
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}


// Kjør når siden lastes
fetchBooks();