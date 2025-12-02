let books = JSON.parse(localStorage.getItem('books')) || [];
let editIndex = -1;

const bookForm = document.getElementById('book-form');
const bookTableBody = document.getElementById('book-table-body');
const searchInput = document.getElementById('search-input');

function renderTable() {
    bookTableBody.innerHTML = '';
    const filter = searchInput.value.toLowerCase();
    books.forEach((book, index) => {
        if (
            book.id.toLowerCase().includes(filter) ||
            book.title.toLowerCase().includes(filter) ||
            book.author.toLowerCase().includes(filter)
        ) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.status}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editBook(${index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteBook(${index})">Delete</button>
                    ${book.status === 'Available'
                        ? `<button class="action-btn issue-btn" onclick="issueBook(${index})">Issue</button>`
                        : `<button class="action-btn return-btn" onclick="returnBook(${index})">Return</button>`}
                </td>
            `;
            bookTableBody.appendChild(tr);
        }
    });
}

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('book-id').value.trim();
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const status = document.getElementById('book-status').value;

    if (editIndex >= 0) {
        books[editIndex] = { id, title, author, status };
        editIndex = -1;
    } else {
        books.push({ id, title, author, status });
    }
    saveBooks();
    bookForm.reset();
    renderTable();
});

function editBook(index) {
    const book = books[index];
    document.getElementById('book-id').value = book.id;
    document.getElementById('book-title').value = book.title;
    document.getElementById('book-author').value = book.author;
    document.getElementById('book-status').value = book.status;
    editIndex = index;
}

function deleteBook(index) {
    if (confirm('Are you sure you want to delete this book?')) {
        books.splice(index, 1);
        saveBooks();
        renderTable();
    }
}

function issueBook(index) {
    books[index].status = 'Issued';
    saveBooks();
    renderTable();
}

function returnBook(index) {
    books[index].status = 'Available';
    saveBooks();
    renderTable();
}

searchInput.addEventListener('input', renderTable);

// Initial render
renderTable();
