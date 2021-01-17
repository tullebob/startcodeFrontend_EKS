import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useParams,
  useRouteMatch,
  Prompt,
} from "react-router-dom";
import React, { useState } from 'react';
import {
  Home,
  NoMatch,
  Login,
  LoggedIn,
  Address,
  Movies,
  DigitalOcean,
  SearchWord,
  BooksTitle,
  SearchBook,
  DeleteBook,
  CreateBook
} from './Components';
import apiFacade from './apiFacade';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [username, setUserName] = useState("");

  const logout = () => {
    apiFacade.logout()
    setLoggedIn(false)
  }

  const login = (user, pass) => {
    setUserName(user);
    apiFacade.login(user, pass)
      .then(res => {
        setLoggedIn(true)
        setError('');
      })
      .catch(err => {
        setError("Couldn't log you in, see error in console for further information");
        console.log(err);
      })
  }


  return (
    <Router>
      <div>
        <Header
          loginMsg={loggedIn ? "Logout" : "Login"}
          isLoggedIn={loggedIn}
        />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
         
          <Route path="/admin-deleteBook">
            <DeleteBook />
          </Route>
          <Route path="/admin-createBook">
            <CreateBook />
          </Route>
          <Route path="/books-title">
            <BooksTitle />
          </Route>
          <Route path="/book-search">
            <SearchBook />
          </Route>
          <Route path="/login-out">
          <div>
            {!loggedIn ? (<Login login={login} />) :
            (<div>
              <LoggedIn username={username}/>
              <button onClick={logout}>Logout</button>
            </div>)}
            
            {error}
          </div>
          </Route>
          <Route component={NoMatch}></Route>
        </Switch>
      </div>
    </Router>
  );
}

function Header({ isLoggedIn, loginMsg }) {
  return (
    <ul className="header">
      <li><NavLink exact activeClassName="active" to="/">Home</NavLink></li>
      <li><NavLink activeClassName="active" to="/books-title">Books Title</NavLink></li>
      <li><NavLink activeClassName="active" to="/book-search">Book Search</NavLink></li>

      {
        isLoggedIn &&
        (
          <React.Fragment>
            <li><NavLink activeClassName="active" to="/admin-deleteBook">Delete Book</NavLink></li>
            <li><NavLink activeClassName="active" to="/admin-createBook">Create Book</NavLink></li>
          </React.Fragment>
        )
      }
      <li><NavLink activeClassName="active" to="/login-out">{loginMsg}</NavLink></li>
    </ul>
  );
}

export default App;
