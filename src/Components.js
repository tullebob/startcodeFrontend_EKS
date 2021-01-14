import React, { useEffect, useState } from 'react';
import { Prompt, Link } from 'react-router-dom';
import apiFacade from './apiFacade';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt_decode from "jwt-decode";


export function Home() {
    return (
        <div>
            <p>Backend and frontend code was cloned, and used for this project. I did not make the huge adjustments, other than "adding" more to front end and backend, such an extra endpoint.</p>
        </div>
    );
}

export function Login({ login }) {

    const init = { username: "", password: "" };
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    }
    const onChange = (evt) => {
        setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
    }
    return (
        <div>
            <h2>Login here</h2>
            <form onChange={onChange}>
                <input placeholder="Username" id="username" />
                <input placeholder="Password" id="password" />
                <button onClick={performLogin}>Login</button>
            </form>
        </div>
    )
}

export function LoggedIn({username}) {

const  token = apiFacade.getToken();
const  decoded = jwt_decode(token); // jwt_decode is an external library
console.log(decoded);
    return (
        <div>
            <h2>You are now logged in!</h2>
            <p>Welcome {username}, your role is: {decoded.roles}</p>
        </div>
    )
}


export function DigitalOcean() {

    const [string, setString] = useState('');
    const [droplets, setDroplets] = useState([]);
    const display = droplets.map((droplet, index) => {
        const network = droplet.networks.v4[0];
        return (
            <React.Fragment>
                <tr>
                    <th>Droplet Name</th>
                    <td>{droplet.name}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{droplet.created_at}</td>
                </tr>
                <tr>
                    <th>Memory</th>
                    <td>{droplet.memory} MB</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>{droplet.status}</td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td>{droplet.region.name}</td>
                </tr>
                <tr>
                    <th>Monthly price</th>
                    <td>${droplet.size.price_monthly}</td>
                </tr>
                <tr>
                    <th>Gateway</th>
                    <td>{network.gateway}</td>
                </tr>
                <tr>
                    <th>IP Address</th>
                    <td>{network.ip_address}</td>
                </tr>
                <tr>
                    <th>Netmask</th>
                    <td>{network.netmask}</td>
                </tr>
            </React.Fragment>
        )
    })
    
    useEffect (() => {
               apiFacade.getDigitalOceanInfo()
               .then(data => setDroplets(data.droplets))
    }, [string])


    return (
        <div>
            <Table striped bordered hover>
                {display}
            </Table>
        </div>
    )
}

export function Movies() {

    const [movieSearchWord, setMovieSearchWord] = useState("");
    const [movieArray, setMovieArray] = useState([]);

    const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getMovieReviews(movieSearchWord)
        .then(data => {
            const array = data.results;
            setMovieArray(array);
        })
      };


      const allMovies = movieArray.map((movie, index)=> (
        <div>
            <ul key={index+1}>
                <li>{movie.display_title} - <a href={movie.link.url}>Details</a></li>
                <p>Review Summary: {movie.summary_short}</p>
            </ul>
            <hr></hr>
        </div>
        )
    );

    return (
        <div>
            <div>
                <input placeholder="Enter movie title" onChange={(event) => setMovieSearchWord(event.target.value)}/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <br></br>
            <div>
                {allMovies}
            </div>
        </div>
    );
}

export function SearchWord() {

    const[searchWord, setSearchWord] = useState("");
    const[wordArray, setWordArray] = useState([]);

    const displayArray = wordArray.map((word, index) => (
        <li key={index}>
            <p>Word: {word.word}</p>
            <p>Definition: {word.meanings[0].definitions[0].definition}</p>
            <p>Example: {word.meanings[0].definitions[0].example}</p>
        </li>
    ))

    const handleSubmit = event => {
        event.preventDefault();
        apiFacade.searchWord(searchWord)
        .then(array =>{
            setWordArray(array);
            console.log(array);
        })
    }

    return (
        <div>
            <input placeholder="Enter word" onChange={(event) => setSearchWord(event.target.value)} />
            <button onClick={handleSubmit}>Search</button>

            <ul>
                {displayArray}
            </ul>
        </div>
    )
}

export function Address() {
    const initialWeather = {
        Sunrise: "",
        Sunset: "",
        Datetime: "",
        Cityname: "",
        Temperature: "",
        ApparentTemperature: "",
        Description: ""
      }
      const [weather, setWeather] = useState(initialWeather);
    
      const initialValue = {
        city: "",
        postalCode: "",
        streetName: "",
        streetNumber: ""
      }
    
      const [address, setAddress] = useState(initialValue);
      const [servicePoints, setServicePoints] = useState([]);
      let [isBlocking, setIsBlocking] = useState(false);
    
      const handleChange = event => {
        const { id, value } = event.target;
        setIsBlocking(event.target.value.length > 0);
        setAddress({ ...address, [id]: value })
      };
    
      const handleSubmit = event => {
        event.preventDefault();
        apiFacade.getServicePoints(address)
        .then(data => {
          const temp = data.weather.data[0];
          setServicePoints(data.postnord.servicePointInformationResponse.servicePoints);
          setWeather({
            Sunrise: temp.sunrise,
            Sunset: temp.sunset,
            Datetime: temp.datetime,
            Cityname: temp.city_name,
            Temperature: temp.temp,
            ApparentTemperature: temp.app_temp,
            Description: temp.weather.description
          })
        })
      };

      return (
          <div>
            <AddressInfo isBlocking={isBlocking} handleChange={handleChange} handleSubmit={handleSubmit} servicePoints={servicePoints} />
            <WeatherInfo weather={weather} />
          </div>
      )
}

export function AddressInfo({isBlocking, handleChange, handleSubmit, servicePoints }) {
    

    const allServicePoints = servicePoints.map(servicePoint => (
        <ul key={servicePoint.servicePointId}>
            <li>{servicePoint.servicePointId}</li>
            <li>{servicePoint.name}</li>
        </ul>
        )
    );

    return (
        <div>
            <h2>What's the address?</h2>
            <div>
                <form onChange={handleChange}>
                    <Prompt when={isBlocking} message={() => "You have unsaved data. Press \"Cancel\" to keep your changes."} />
                    <input type="text" id="city" placeholder="City..." />
                    <br></br>
                    <input type="text" id="postalCode" placeholder="Zip..." />
                    <br></br>
                    <input type="text" id="streetName" placeholder="Street..." />
                    <br></br>
                    <input type="text" id="streetNumber" placeholder="Street number..." />
                    <br></br>
                    <input type="submit" value="Enter" onClick={handleSubmit} />
                </form>
            </div>
            {allServicePoints}
        </div>
    );
}

export function WeatherInfo({ weather }) {
    return (
        <div>
            <h2>Weather goes here</h2>
            <Log value={weather} />
        </div>
    )
}

const Log = ({ value, replacer = null, space = 2 }) => (
    <pre>
        <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
)

export function NoMatch() {
    return (
        <div>
            <h2>Sorry, we couldn't find that page...</h2>
        </div>
    );
}