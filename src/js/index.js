/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-loop-func */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-tabs */
// eslint-disable-next-line max-classes-per-file
import * as mdb from 'mdb-ui-kit';
import filter from './filter';
import drag from './drag';
import Book from './book';

export default {
  mdb,
};

filter();
drag();

// Book Class: Represents a Book

// UI Class: Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static updateCount() {
    // update genre count
    const table = document.getElementById('book-list'); // ur table id
    const rows = table.getElementsByTagName('tr');
    const output = [];
    for (let i = 0; i < rows.length; i++) {
      output.push(rows[i].getElementsByTagName('td')[2].innerHTML); // instead of 1 pass column index
      var count = {};
      output.forEach((i) => {
        count[i] = (count[i] || 0) + 1;
      });
    }

    if (output.length > 0) {
      const list1 = document.querySelector('#book-list-1');
      const row1 = document.querySelector('#book-list-1');
      // eslint-disable-next-line block-scoped-var
      const count1 = JSON.stringify(count);
      const count2 = count1.replace(/"/g, '');
      const count3 = count2.replace(/}/g, '');
      const count4 = count3.replace(/{/g, '');

      row1.innerHTML = `
          <div class = "category-counter">${count4}</div>
          `;

      list1.parentNode.appendChild(row1);
    } else {
      const list2 = document.querySelector('#book-list-1');
      const row2 = document.querySelector('#book-list-1');
      row2.innerHTML = `
          <div class = "category-counter"><p>Brak książek w kolekcji</p></div>
          `;

      list2.parentNode.appendChild(row2);
    }
  }

  static addBookToList(book) {
    const books = Store.getBooks();
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.className = 'handle';

    row.innerHTML = `
        <td class="title-data edit-title"><i style = "padding: 0px 20px" class="fa fa-bars bars"></i>${book.title}</td>
        <td class="author-data">${book.author}</td>
        <td class= "genre-data">${book.genre}</td>
        <td class = "priority-data">${book.priority}</td>
        <td><a href="#" class="btn btn-danger btn-sm edit">E</a></td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
    list.appendChild(row);

    increase();
    drawCounter();
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
      decrease();
      drawCounter();
      UI.showAlert('Książka usunięta.', 'success');
    }
  }

  static editBook(el) {
    const emptyRow = document.createElement('tr');
    emptyRow.className = 'handle';
    emptyRow.innerHTML = `
    <td class="title-data edit-title"><i style = "padding: 0px 20px" class="fa fa-bars bars"></i</td>
    <td class="author-data"></td>
    <td class= "genre-data"></td>
    <td class = "priority-data"></td>
    <td><a href="#" class="btn btn-danger btn-sm edit">E</a></td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
  `;

    if (el.classList.contains('edit')) {
      UI.showAlert('Edycja Książki.', 'success');
    }
    el.parentElement.parentElement.parentElement.appendChild(emptyRow);
    el.parentElement.parentElement.remove();
    decrease();
    document.querySelector('#title').value = 'edytuj';
    document.querySelector('#author').value = 'edytuj';
    document.querySelector('#genre').value = 'edytuj';
    document.querySelector('#priority').value = 'edytuj';

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const genre = document.querySelector('#genre').value;
    const priority = document.querySelector('#priority').value;
    setTimeout(() => emptyRow.remove(), 6000);
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.page1');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#genre').value = '';
    document.querySelector('#priority').value = '';
  }
}

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(priority) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.priority === priority) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
document.addEventListener('DOMContentLoaded', UI.updateCount);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const genre = document.querySelector('#genre').value;
  const priority = document.querySelector('#priority').value;

  // Validate
  if (title === '' || author === '' || genre === '' || priority === '') {
    UI.showAlert('Wypełnij wszystkie pola, aby dodać książkę.', 'danger');
  } else {
    // Instatiate book
    const book = new Book(title, author, genre, priority);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);
    UI.updateCount();
    // Show success message
    UI.showAlert('Książka dodana.', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Add a Book
document.querySelector('#editButton').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const genre = document.querySelector('#genre').value;
  const priority = document.querySelector('#priority').value;

  // Validate
  if (title === '' || author === '' || genre === '' || priority === '') {
    UI.showAlert('Wypełnij wszystkie pola, aby dodać książkę.', 'danger');
  } else {
    // Instatiate book
    const book = new Book(title, author, genre, priority);

    // Add Book to UI
    UI.addBookToList(book);

    // Add book to store
    // Show success message
    UI.showAlert('Książka edytowana.', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);
  UI.updateCount();
  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  // Show success message
});

document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.editBook(e.target);
  UI.updateCount();
  UI.clearFields();
  // Remove book from store
  // Show success message
});
