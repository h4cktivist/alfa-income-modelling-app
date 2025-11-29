//import {useEffect, useState} from 'react'
import './App.css'
import Header from "./components/Header/Header.tsx";
//import {getPosts} from "../api/requests.ts";
import Menu from "./components/Menu/Menu.tsx";
import Home from "./components/Home/Home.tsx";
import Footer from "./components/Footer/Footer.tsx";

function App() {

  return (
          <div>
              <Header/>
              <Menu/>
              <Home/>
              <Footer/>
          </div>
  )
}

export default App
