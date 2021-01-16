import URLS, {servicepointsURL, movieReviewURL, digitaloceanURL, loginURL, booksByTitleURL, searchBookURL} from './Settings';

function getServicePoints(address) {
    const options = makeOptions("POST", true, address);
    return fetch(servicepointsURL, options)
        .then(handleHttpErrors);
}

function getMovieReviews(query) {
    const options = makeOptions("POST", true, {query});
    console.log(options);
    return fetch(movieReviewURL, options)
        .then(handleHttpErrors);
}

function getDigitalOceanInfo() {
    const options = makeOptions("GET", true);
    return fetch (digitaloceanURL, options)
    .then(handleHttpErrors);
}

function searchWord(word) {
    const URL = "https://tullebob.com/CA3_backend/api/dictionary/search";
    //const URL = "https://api.chucknorris.io/jokes/random";
    const options = makeOptions("POST", true, {word});
    return fetch(URL, options)
    .then(handleHttpErrors);
}

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
    getServicePoints,
    getMovieReviews,
    getDigitalOceanInfo,
    searchWord,
    setToken,
    getToken,
    loggedIn,
    logout,
    login,
    getBooksTitle,
    searchBook
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