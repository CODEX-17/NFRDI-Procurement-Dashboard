import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DeveloperPage from './pages/DeveloperPage'
import Test from './pages/Test'

function App() {

  return (
    <>
     <BrowserRouter>
      <Routes>
        <Route path="*"  element={<LoginPage />}/>
        <Route path="/"  element={<LoginPage />}/>
        <Route path="/test"  element={<Test />}/>
        <Route path="/home"  element={<HomePage />}/>
        <Route path="/developer"  element={<DeveloperPage />}/>
        <Route path="/dashboard"  element={<DashboardPage />}/>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
