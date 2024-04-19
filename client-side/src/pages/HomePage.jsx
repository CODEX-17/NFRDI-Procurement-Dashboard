import React from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.module.css'

const HomePage = () => {

const navigate = useNavigate()

const handleLogin = () => {
    navigate('/login')
}

  return (
    <div>
        <button className='btn btn-primary' onClick={handleLogin}>dsds</button>
    </div>
  )
}

export default HomePage