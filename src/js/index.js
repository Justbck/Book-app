/* eslint-disable no-tabs */
// eslint-disable-next-line max-classes-per-file
import * as mdb from 'mdb-ui-kit';

export default {
  mdb,
};

class Book {
  constructor(title, author, genre, priority) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.priority = priority;
  }
}

// filter table

(function () {
  // eslint-disable-next-line wrap-iife
  const TableFilter = (function () {
    const Arr = Array.prototype;
    let input;

    function onInputEvent(e) {
      input = e.target;
      const table1 = document.getElementsByClassName(input.getAttribute('data-table'));
      Arr.forEach.call(table1, (table) => {
        Arr.forEach.call(table.tBodies, (tbody) => {
          Arr.forEach.call(tbody.rows, filter);
        });
      });
    }

    function filter(row) {
      const text = row.textContent.toLowerCase();
      // console.log(text);
      const val = input.value.toLowerCase();
      // console.log(val);
      row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
      // eslint-disable-next-line object-shorthand
      init: function () {
        const inputs = document.getElementsByClassName('table-filter');
        Arr.forEach.call(inputs, (input) => {
          input.oninput = onInputEvent;
        });
      },
    };
  })();

  TableFilter.init();
  // eslint-disable-next-line prettier/prettier
}());

// UI class: Handle UI Tasks - display changes/alerts

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static updateCount() {
    const books = Store.getBooks();
    const list = document.querySelector('#counter');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>Liczba książek: ${books.length}</td>
      `;

    list.replaceWith(row);
  }
  // adding books

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.className = 'handle';

    row.innerHTML = `
      
      <td class="title-data"><i style = "padding: 0px 20px" class="fa fa-bars bars"></i>${book.title}</td>
      <td class="author">${book.author}</td>
      <td class="genre">${book.genre}</td>
      <td class="priority">${book.priority}</td>
      <td><a href="#" class="btn btn-edit btn-sm edit"><i class="far fa-edit"></i></a></td>
      <td><a href="#" class="btn btn-save btn-sm save"><i class="fas fa-check"></i></a></td>
      <td><a id="delete" href="#" class="btn btn-delete danger btn-sm delete"><i class="fas fa-times"></i></a></td>
      `;

    list.appendChild(row);
  }

  // we gat to ensure that what is clicked has the delete class --- using if statement
  // we make sure what is clicked contain the class delete
  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    // Vanish in 2 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#genre').value = '';
    document.querySelector('#priority').value = '';
  }
}

// made it static so we dont have to instansiate the store class
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

  static removeBook(title) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// NOTE: you can't store object in local storage it has to be a string - so we stringify our object bfr sending to local storage & parse it when pulling it out;

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  // prevent actual submit
  e.preventDefault();

  // get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const genre = document.querySelector('#genre').value;
  const priority = document.querySelector('#priority').value;

  // Validation
  if (title === ' ' || author === ' ' || genre === '' || priority === ' ') {
    UI.showAlert('Wypełnij wszystkie pola, aby dodać książke.', 'danger');
  } else {
    // instiantiate book
    const book = new Book(title, author, genre, priority);

    // add book to UI
    UI.addBookToList(book);

    // add books to store
    Store.addBook(book);
    UI.updateCount();
    UI.showAlert('Książka dodana.', 'success');

    // this method clear fields
    UI.clearFields();
  }
});

// Events: Remove a Book
// we need to use event propagation

document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
  // Remove book from Store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
