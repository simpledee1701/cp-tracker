import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes,Link, Router } from 'react-router-dom'
import Start from './pages/start'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Contest from './pages/Contest'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Start/>} />
      <Route path='/home' element={<Home/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contest" element={<Contest />} />

    </Routes>
    
    
    </>
  )
}

export default App
