//Book Class: represent a Book
class Book {
  constructor(title, author, pages) {
    this.title = title;
    this.author = author;
    this.pages = pages;
  }
}
//UI Class:  Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
    <th>${book.title}</th>
    <th>${book.author}</th>
    <th>${book.pages}</th>
    <th><a href="#" class="btn btn-danger btn-sm delete">X</a></th>
    `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    //vanish in 2 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#pages").value = "";
  }
}
//Store Class: handle Storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBooks(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBooks(title) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks());
//Event: Add Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  // prevent form default
  e.preventDefault();
  //get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  //validate
  if (title === "" || author === "" || pages === "") {
    UI.showAlert("Please Fill All Fields", "danger");
  } else {
    //instantiate book
    const book = new Book(title, author, pages);
    //add book to the UI
    UI.addBookToList(book);
    //add books to store
    Store.addBooks(book);
    //show success message
    UI.showAlert("Book Added Successfully", "success");
    //clear form's fields
    UI.clearFields();
  }
});
//Event: Remove Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  //remove book from UI
  UI.deleteBook(e.target);
  //remove book from Store
  Store.removeBooks(
    e.target.parentElement.previousElementSibling.previousElementSibling
      .previousElementSibling.textContent
  );
  UI.showAlert("Book Deleted", "success");
});
