const RENDER_EVENT = "render-book";
const books = [];
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const input = document.getElementById("inputBookIsComplete").checked;

  const generatedId = generateId();

  const bookObject = generateBookObject(
    generatedId,
    title,
    author,
    year,
    input
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findId(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function findIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}

function undoCompletedBook(bookId) {
  const bookTarget = findId(bookId);

  if (bookTarget === null) return;

  bookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function completedReadBook(bookId) {
  const bookTarget = findId(bookId);

  if (bookTarget === null) return;

  bookTarget.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromList(bookId) {
  const bookTarget = findIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeList(bookObject) {
  const titleField = document.createElement("h3");
  titleField.innerHTML = bookObject.title;
  const authorField = document.createElement("p");
  authorField.innerHTML = "Penulis : " + bookObject.author;
  const yearField = document.createElement("p");
  yearField.innerHTML = "Tahun : " + bookObject.year;

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(titleField, authorField, yearField);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerHTML = "Belum selesai dibaca";

    undoButton.addEventListener("click", () => {
      undoCompletedBook(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerHTML = "Hapus buku";

    removeButton.addEventListener("click", () => {
      removeBookFromList(bookObject.id);
    });

    const container = document.createElement("div");
    container.classList.add("action");
    container.append(undoButton, removeButton);

    article.append(container);
  } else {
    const doneButton = document.createElement("button");
    doneButton.classList.add("green");
    doneButton.innerHTML = "Selesai dibaca";

    doneButton.addEventListener("click", () => {
      completedReadBook(bookObject.id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerHTML = "Hapus buku";

    removeButton.addEventListener("click", () => {
      removeBookFromList(bookObject.id);
    });

    const container = document.createElement("div");
    container.classList.add("action");
    container.append(doneButton, removeButton);

    article.append(container);
  }

  return article;
}

document.addEventListener(RENDER_EVENT, () => {
  const uncompleteField = document.getElementById("incompleteBookshelfList");
  uncompleteField.innerHTML = "";

  const completedField = document.getElementById("completeBookshelfList");
  completedField.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeList(bookItem);
    const input = document.getElementById("inputBookIsComplete").checked;

    if (input) {
      if (bookItem.isComplete) {
        completedField.append(bookElement);
      } else {
        uncompleteField.append(bookElement);
      }
    } else {
      if (bookItem.isComplete) {
        completedField.append(bookElement);
      } else {
        uncompleteField.append(bookElement);
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inputBook");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});
