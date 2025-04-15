import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes,Link } from 'react-router-dom'
import Start from './pages/start'
import Navbar from './components/Navbar'
import Home from './pages/Home'

function App() {

  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Start/>} />
      <Route path='/home' element={<Home/>} />

    </Routes>
    
    </>
  )
}

export default App
