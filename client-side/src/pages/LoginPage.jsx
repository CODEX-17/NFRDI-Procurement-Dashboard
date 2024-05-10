import React, { useEffect, useState } from 'react'
import  style from './LoginPage.module.css'
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useProjectsStore } from '../stores/useProjectsStore';
import { useImageStore } from '../stores/useImageStore';

const LoginPage = () => {

  const [isShowPassword, setIsShowPassword] = useState(true)
  const navigate = useNavigate()
  const { getProject } = useProjectsStore()
  const { getImages } = useImageStore()
  const [errCount, seterrCount] = useState(0)
  const [error, setError] = useState(false)
  const [currentEmail, setCurrentEmail] = useState()
  const [currentPassword, setCurrentPassword] = useState()
  const [isDisabled, setisDisabled] = useState(false)

  useEffect(() => {
    getProject()

    if (localStorage.getItem('user')) {
      navigate('/dashboard')
    }
  },[])

  useEffect(() => {
    console.log(errCount)

    if (errCount >= 3) {
      setisDisabled(true)

      const timeout = setTimeout(() => {
        setisDisabled(false)
        seterrCount(0)
      }, 60000)

      return () => clearTimeout(timeout)
    }
  },[errCount])

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post('http://localhost:5000/verifyAccount', {currentEmail, currentPassword})
    .then((res) => {
      const result = res.data
    
      if (result) {
        localStorage.setItem('user', JSON.stringify(result))
        navigate('/dashboard')
      }else {
        setError(true)
        const showTime = setTimeout(() => {
          seterrCount(errCount + 1)
          setError(false)
        }, 3000);

        return () => clearTimeout(showTime)
      }

    })
    .catch((err) => {console.log(err)})
    
  }



  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.horizontal}>
          <img src='/nfrdi.png' alt='logo'/>
          <h1>NFRDI</h1>
        </div>
        <p>National Fisheries Research and Development Institute</p>

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type='text' placeholder='Email' required onChange={(e) => setCurrentEmail(e.target.value)}/>
          <label>Password</label>
          <div className={style.inputPass}>
            <input style={{ marginBottom: '5%' }} required type={isShowPassword ? 'password': 'text'} placeholder='Password' onChange={(e) => setCurrentPassword(e.target.value)}/>
            {
              currentPassword && (
                isShowPassword ? 
                <IoEye id={style.eye} style={{ color: '#B4B4B8' }} onClick={() => setIsShowPassword(false)}/>
                :
                <IoMdEyeOff id={style.eye} style={{ color: '#B4B4B8' }} onClick={() => setIsShowPassword(true)}/>
              )
            }
          </div>
          
          { error && <p id={style.message}>Wrong email and password. Please try again.</p> }
          
          <div className='d-flex w-100 justify-content-between align-items-center'>
            <div className={style.rememberDev}><input type='checkbox' id={style.checkbox}></input> <p>Remember this Device</p></div>
            <p style={{ margin: '0px', color: '#004481', cursor: 'pointer'}}>Forget Password?</p>
          </div>

          <button type='submit' disabled={isDisabled}>Sign In</button>
          <div className='d-flex w-100 justify-content-center mb-10 mt-2'>
            <p style={{ color: '#004481',  cursor: 'pointer' }}>Create account</p> 
          </div>
          
        </form>
        
      </div>
      <p id={style.devCredits} onClick={() => navigate('developer')}>Develop by Cagayan State University Intern</p>
    </div>
  )
}

export default LoginPage