const RENDER_PAGES = 'page-render';
const DATAS_KEY = 'books-datas';

var books = [];


window.addEventListener('DOMContentLoaded', function () {
    const submit = document.getElementById('form');

    submit.addEventListener('submit', function (event) {
        event.preventDefault();
        makeData();
        console.log(books);
    });

    loadLocal();
    console.log(books);
    this.document.dispatchEvent(new Event(RENDER_PAGES));
});

function loadLocal() {
    const localDatas = JSON.parse(localStorage.getItem(DATAS_KEY));

    if (localDatas !== null) {
        books = localDatas;
    }
};

document.addEventListener(RENDER_PAGES, function () {
    const unread = document.getElementById('unread');
    const readed = document.getElementById('readed');

    unread.innerHTML = '';
    readed.innerHTML = '';

    for (const booksData of books) {
        const showList = showDataConstructor(booksData);
        if (booksData.isComplete == true) {
            readed.append(showList);
        } else if (booksData.isComplete == false) {
            unread.append(showList);
        }
    }
});

function dataStructure(id, title, author, release, isComplete) {
    return {
        id,
        title,
        author,
        release,
        isComplete
    }
};

function generateId() {
    return +new Date();
};

function makeData() {

    const judul = document.getElementById('judul').value;
    const penulis = document.getElementById('penulis').value;
    const tahun = document.getElementById('tahun').value;
    const status = document.getElementById('input-status');


    const trueFalse = (stat) => {
        if (stat.checked == true) {
            return true;
        } else {
            return false;
        }
    }

    const dataId = generateId();
    const newData = dataStructure(dataId, judul, penulis, tahun, trueFalse(status));
    books.unshift(newData);
    inputLocalStorage();
    document.dispatchEvent(new Event(RENDER_PAGES));
};

function inputLocalStorage() {
    const stringBooksData = JSON.stringify(books);
    localStorage.setItem(DATAS_KEY, stringBooksData);
};


function showDataConstructor(bookLists) {
    const container = document.createElement('div');
    container.setAttribute('id', `books-${bookLists.id}`);
    container.setAttribute('class', 'book-container')

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookLists.title;

    const authorText = document.createElement('p');
    authorText.innerText = `Penulis: ${bookLists.author}`;

    const releaseText = document.createElement('p');
    releaseText.innerText = `Tahun: ${bookLists.release}`;

    function findData(ids) {
        for (const book of books) {
            if (book.id === ids) {
                return book;
            }
        }
    };

    function findIndex(ids) {
        for (const index in books) {
            if (books[index].id === ids)
                return index;
        }
    }


    if (bookLists.isComplete == false) {

        const completeButon = document.createElement('i');
        completeButon.setAttribute('class', 'fa fa-check-square fa-2x');
        completeButon.addEventListener('click', function () {
            const book = findData(bookLists.id);

            book.isComplete = true;
            inputLocalStorage();
            document.dispatchEvent(new Event(RENDER_PAGES));
        });

        const editButton = document.createElement('i');
        editButton.setAttribute('class', 'fa fa-edit fa-2x');
        editButton.addEventListener('click', function () {
            const book = findData(bookLists.id);
            var title = prompt("Judul:", `${book.title}`);
            var author = prompt("Penulis:", `${book.author}`);
            var date = prompt("Tahun", `${book.release}`);
        })

        const deleteButton = document.createElement('i');
        deleteButton.setAttribute('class', 'fa  fa-trash fa-2x');
        deleteButton.addEventListener('click', function () {
            const bookIndex = findIndex(bookLists.id);

            books.splice(bookIndex, 1);
            inputLocalStorage();
            document.dispatchEvent(new Event(RENDER_PAGES));
        });

        container.append(bookTitle, authorText, releaseText, completeButon, editButton, deleteButton);

    } else {
        const undoButton = document.createElement('i');
        undoButton.setAttribute('class', 'fa fa-remove fa-2x');
        undoButton.addEventListener('click', function () {
            const book = findData(bookLists.id);

            book.isComplete = false;
            inputLocalStorage();
            document.dispatchEvent(new Event(RENDER_PAGES));
        })

        const deleteButton = document.createElement('i');
        deleteButton.setAttribute('class', 'fa  fa-trash fa-2x');
        deleteButton.addEventListener('click', function () {
            const bookIndex = findIndex(bookLists.id);

            books.splice(bookIndex, 1);
            inputLocalStorage();
            document.dispatchEvent(new Event(RENDER_PAGES));
        })

        container.append(bookTitle, authorText, releaseText, undoButton, deleteButton);
    }

    return container;
};

//Search features

const searchButton = document.getElementById('search-button');
const backButton = document.getElementById('back-button');

searchButton.addEventListener('click', function () {
    const searchValue = document.getElementById('search-value').value;
    loadLocal();
    const bukus = [];

    for (const book of books) {
        if (book.title.match(RegExp(searchValue, 'i')) !== null) {
            bukus.push(book);
        }
    }
    books = bukus;
    document.dispatchEvent(new Event(RENDER_PAGES));
    console.log(books);
});

backButton.addEventListener('click', function () {
    loadLocal();
    document.dispatchEvent(new Event(RENDER_PAGES));
});