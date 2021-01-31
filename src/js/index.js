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

// filter

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

  /* console.log(document.readyState);
	document.addEventListener('readystatechange', function() {
		if (document.readyState === 'complete') {
      console.log(document.readyState);
			TableFilter.init();
		}
	}); */

  TableFilter.init();
  // eslint-disable-next-line prettier/prettier
}());

// UI class: Handle UI Tasks

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  // ilość książek

  static displayBookCount() {
    const books = Store.getBooks();
    const list = document.querySelector('#count');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td> Liczba książek: </td><td>${books.length}</td>
      `;

    list.appendChild(row);
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.priority}</td>
      <td><a href="#" class="btn btn-edit btn-sm edit"><i class="far fa-edit"></i></a></td>
      <td><a href="#" class="btn btn-save btn-sm delete"><i class="fas fa-check"></i></a></td>
      <td><a id="decrease" href="#" class="btn btn-delete btn-sm delete"><i class="fas fa-times"></i></a></td>
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

  static editBook(el) {
    if (el.classList.contains('edit')) {
      el.parentElement.parentElement.remove();
    }
  }

  // custom alert
  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    // grab and put in
    const container = document.querySelector('.container');
    const form = document.querySelector('#table');
    container.insertBefore(div, form);

    // Vanish in 3s
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
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

// NOTE: you can't store object in local storage it has to be a string - so we stringify our object bfr sending to local storage & parse it when pulling it out;

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
document.addEventListener('submit', UI.displayBookCount);

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
  if (title === '' || author === '' || genre === '' || priority === '') {
    UI.showAlert('Wypełnij wszystkie pola');
  } else {
    // instiantiate book
    const book = new Book(title, author, genre, priority);

    // add book to UI
    UI.addBookToList(book);

    // add books to store
    Store.addBook(book);

    UI.showAlert('Książka dodana');

    // this method clear fields
    UI.clearFields();
  }
});

// Events: Remove a Book
// we need to use event propagation

document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
});
