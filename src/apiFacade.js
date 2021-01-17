import URLS, {loginURL, booksByTitleURL, searchBookURL, createBookURL, deleteBookURL} from './Settings';



function getBooksTitle() {
    const options = makeOptions("GET", true);
    return fetch(booksByTitleURL, options)
    .then(handleHttpErrors);
}

function searchBook(title, author) {
    const options = makeOptions("GET", true);
    return fetch(searchBookURL + "/" + title + "/" + author, options)
    .then(handleHttpErrors);

}

function createBook(isbn, title, author, publisher, publishYear) {
    const options = makeOptions("POST", true);
    return fetch(createBookURL + "/" + isbn + "/" + title, + "/" + author + "/" + publisher + "/" + publishYear)
    .then(handleHttpErrors);
}

function deleteBook(id) {
    const options = makeOptions("DELETE", true);
    return fetch(deleteBookURL + id, options)
    .then(handleHttpErrors);
}
const setToken = (token) => {
    localStorage.setItem('jwtToken', token)
}
const getToken = () => {
    return localStorage.getItem('jwtToken')
}
const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
}
const logout = () => {
    localStorage.removeItem("jwtToken");
}

const login = (user, password) => {
    const options = makeOptions("POST", true, { username: user, password: password });
    return fetch(loginURL, options)
        .then(handleHttpErrors)
        .then(res => { setToken(res.token) })
}



const apiFacade = {
    setToken,
    getToken,
    loggedIn,
    logout,
    login,
    getBooksTitle,
    searchBook,
    createBook,
    deleteBook
}

function makeOptions(method, addToken, body) {
    var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            'Accept': 'application/json',
        }
    }
    if (addToken && loggedIn()) {
        opts.headers["x-access-token"] = getToken();
    }
    if (body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

function handleHttpErrors(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}

export default apiFacade;