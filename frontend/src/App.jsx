import './App.css'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/start'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Contest from './pages/Contest'
import LeetcodePage from './pages/LeetcodePage'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Start/>} />
      <Route path='/home' element={<Home/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contest" element={<Contest />} />
      <Route path='/leetcode' element={<LeetcodePage/>}/>
    </Routes>
    </>
  )
}

export default App
