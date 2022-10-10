import React,{useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";


import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Banner from './Components/Banner/Banner';
import Admin from './Components/Admin/Admin';
import Catalogue from './Components/Catalogue/Catalogue';

function App() {
  const [cart , setCart] = useState([]);
  return (
    <Router>
      <div className="main">
        <Switch>
          <Route exact path="/">
              <Header cart={cart}/>
              <Banner/>
              <Catalogue />
              <Footer/>
          </Route>
          <Route exact path="/Admin">
              <Header cart={cart}/>
              <Admin />
              <Footer/>
          </Route>
          <Route exact path="/Checkout">
              <Header cart={cart}/>
              <Footer/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
