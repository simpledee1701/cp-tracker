import React from 'react'
import axios from 'axios'
import { useEffect,useState } from 'react'
const apiurl = import.meta.env.VITE_API_URL;



const Home = () => {
    const [data,setData] = useState('');


    const res = axios.post(`${apiurl}/stats/update/:username`);
    

  return (
    <div>Home</div>
  )
}

export default Home