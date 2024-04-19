import React, { useEffect, useRef, useState } from 'react'
import style from './ManageAccount.module.css'
import { IoMdExit } from "react-icons/io";
import axios from 'axios';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner'
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const ManageAccount = ({ setisShowManageAccount }) => {

 const [firstname, setfirstname] = useState(null)
 const [middlename, setmiddlename] = useState(null)
 const [lastname, setlastname] = useState(null)
 const [email, setemail] = useState(null)
 const [message, setmessage] = useState("Old password doesn't match")
 const [dialogBoxMessage, setdialogBoxMessage] = useState('Saving Changes...')
 const [image, setimage] = useState(null)

 const [oldpassword, setoldpassword] = useState()
 const [newpassword, setnewpassword] = useState(null)
 const [confirmPassword, setconfirmPassword] = useState(null)

 const [showChangePass, setshowChangePass] = useState(false)
 const [showNewPassSections, setshowNewPassSections] = useState(false)
 const [showMessage, setshowMessage] = useState(false)
 const [dialogBox, setdialogBox] = useState(false)
 const auth = JSON.parse(localStorage.getItem('user'))

//new password //
const [charLength, setcharLength] = useState(false)
const [mixChar, setmixChar] = useState(false)
const [specialChar, setspecialChar] = useState(false)
const [reuseChar, setreuseChar] = useState(false)
const [matchChar, setmatchChar] = useState(false)

const navigate = useNavigate()

 useEffect(() => {
    setfirstname(auth.first_name)
    setmiddlename(auth.middle_name)
    setlastname(auth.last_name)
    setemail(auth.email)
 },[])

 const handleSubmitOldPassword = () => {
    const hashPassword = auth.password

    axios.post('http://localhost:5000/verifyPassword', {hashPassword, oldpassword})
    .then((res) => {
        const result = res.data
        if (result) {
            setshowNewPassSections(true)
        }else {
            setshowMessage(true)
            setTimeout(() => {
                setshowMessage(false)
            }, 3000);
        }
    })
    .catch((err) => console.log(err))
 }

 useEffect(()=> {

 },[])

 const hasLowerAndUpperCase = (value) => {
    return /[a-z]/.test(value) && /[A-Z]/.test(value)
 }

 const hasNumberAndSymbols = (value) => {
    return /[0-9]/.test(value) && /[!@#$%^&*()]/.test(value)
 }


 const generateUniqueId = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const length = 8
    let result = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        result += charset.charAt(randomIndex)
    }
    return result
}


 const handleCheckInputtedPassword = (e) => {
    e.preventDefault()

    const value = e.target.value
    setnewpassword(value)

        if (oldpassword !== value) {
            setreuseChar(true)
        }else {
            setreuseChar(false)
        }

        if (value.length > 12) {
           setcharLength(true)
        }else {
           setcharLength(false)
        }

        if (hasLowerAndUpperCase(value)) {
            setmixChar(true)
        }else {
            setmixChar(false)
        }

        if (hasNumberAndSymbols(value)) {
            setspecialChar(true)
        }else {
            setspecialChar(false)
        }
 }

 const checkConfirmationPassword = (e) => {
    e.preventDefault()
    const value = e.target.value
    setconfirmPassword(value)

    if (newpassword === value) {
        setmatchChar(true)
        
    }else {
        setmatchChar(false)
    }
 }

 const handleChangePassword = () => {
    const accnt_id = auth.accnt_id
    setdialogBox(true)

    axios.put('http://localhost:5000/changePassword', {newpassword, accnt_id})
    .then(res => {
        const result = res.data
        if (result) {
            localStorage.clear()
            setTimeout(() => {
                setdialogBoxMessage('Your account is logging out automatically...')
                setTimeout(() => {
                    setdialogBox(false)
                    setisShowManageAccount(false)
                    navigate('/')
                }, 2000);
                
            }, 2000);
        }
        
    })
    .catch(err => console.log(err))

 }

 const handleDrop = (e) => {
    e.preventDefault()
    const value = e.dataTransfer.files[0]
    setimage(value)
 }

 const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      return(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const preventDefault = (e) => {
    e.preventDefault();
  };

 const handleFileInputChange = (e) => {
    e.preventDefault()
    const value = e.target.files[0]
    setimage(value)
 }

 const handleSaveChangesProfile = () => {

    const formData = new FormData
        formData.append('accnt_id', auth.accnt_id)

    if (firstname) {
        formData.append('first_name', firstname)
    }else {
        formData.append('first_name', auth.first_name)
    }

    if (middlename) {
        formData.append('middle_name', middlename)
    }else {
        formData.append('middle_name', auth.middle_name)
    }

    if (lastname) {
        formData.append('last_name', lastname)
    }else {
        formData.append('last_name', auth.last_name)
    }
    
    if (email) {
        formData.append('email', email)
    }else {
        formData.append('email', auth.email)
    }

    if (image) {
        formData.append('image_id',  generateUniqueId())
        formData.append('image', image)
        
        const images = JSON.parse(localStorage.getItem('images'))
        const result = images.filter((img) => img.image_id === auth.image_id).map((img) => img.image_name)
        const data = { image_name: result[0] };
        console.log('name', data)

        axios.post('http://localhost:5000/deleteImage', data)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))

    }else {
        formData.append('image_id', 'none')
    }

    for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

    axios.post('http://localhost:5000/updateAccount', formData)
    .then((res) => {
        const data = res.data

        if (data) {
            setTimeout(() => {
                setdialogBoxMessage('Your account is logging out automatically...')
                setTimeout(() => {
                    setdialogBox(false)
                    setisShowManageAccount(false)
                    localStorage.clear()
                    navigate('/')
                }, 2000);
                
            }, 2000);
        }
    })
    .catch((err) => console.error(err))
 }

 const isTheirChanges = () => {
    const first_name = auth.first_name
    const last_name = auth.last_name
    const middle_name = auth.middle_name
    const userEmail = auth.email

    if (
            first_name !== firstname ||
            last_name !== lastname ||
            middle_name !== middlename ||
            userEmail !== email ||
            image
        ) {

        return true
    }else {
        return false
    }

 }

  return (
    <div className={style.container}>
        {
            dialogBox ? (
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <InfinitySpin
                        visible={true}
                        width="200"
                        color="#004481"
                        ariaLabel="infinity-spin-loading"
                    />
                    <p id={style.loadingText}>{dialogBoxMessage}</p>
                </div>

            ) : (
                <>
                    <IoMdExit size={20} id={style.backIcon} onClick={() => setisShowManageAccount(false)}/>
                    <div className={style.form}>
                        <div 
                            className={style.dragArea}
                            onDrop={handleDrop}
                            onDragOver={preventDefault}
                        >   
                            
                        {
                            image ? (
                                <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                            ) : (
                                <p>Drag and drop image here, <br/> or click to select image</p>
                            )
                        }
                            
                            <input type="file" accept="image/*" onChange={handleFileInputChange} style={{ display: 'none' }} />
                        </div>
                        
                        {
                            showChangePass ? (
                                <div className={style.changePassContainer}>
                                    <div className='d-flex w-100 flex-column gap-2 mt-5'>
                                        
                                        {
                                            !showNewPassSections ? (
                                                <div className={style.nameContainer}>
                                                    <p className={style.label}>Old password</p>
                                                    <input type='text' value={oldpassword} placeholder='old password' onChange={(e)=> setoldpassword(e.target.value)}/>
                                                    {showMessage && <p id={style.message}>{message}</p>}
                                                    <button onClick={handleSubmitOldPassword}>Submit</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={style.nameContainer}>
                                                        <p className={style.label}>New password</p>
                                                        <input type='text' value={newpassword} placeholder='new password' onChange={handleCheckInputtedPassword}/>
                                                        {
                                                            newpassword && (
                                                                <div className={style.passwordList}>
                                                                    <div className={style.bullet}>
                                                                        {
                                                                            charLength ? (
                                                                                <FaCheck size={10} color='green'/>
                                                                            ) : (
                                                                                <ImCross size={10} color='red'/>
                                                                            )
                                                                        }
                                                                        <p>At least 12 characters long</p>
                                                                    </div>
                                                                    <div className={style.bullet}>
                                                                        {
                                                                            mixChar ? (
                                                                                <FaCheck size={10} color='green'/>
                                                                            ) : (
                                                                                <ImCross size={10} color='red'/>
                                                                            )
                                                                        } 
                                                                        <p>Contains a mix of uppercase and lowercase letters</p>
                                                                    </div>
                                                                    <div className={style.bullet}>
                                                                        {
                                                                            specialChar ? (
                                                                                <FaCheck size={10} color='green'/>
                                                                            ) : (
                                                                                <ImCross size={10} color='red'/>
                                                                            )
                                                                        } 
                                                                        <p>Includes numbers and special characters</p>
                                                                    </div>
                                                                    <div className={style.bullet}>
                                                                        {
                                                                            reuseChar ? (
                                                                                <FaCheck size={10} color='green'/>
                                                                            ) : (
                                                                                <ImCross size={10} color='red'/>
                                                                            )
                                                                        } 
                                                                        <p>Does not reuse passwords</p>
                                                                    </div>
                                                                    
                                                                </div>
                                                            )
                                                        }
                                                        

                                                    </div>
                                                    <div className={style.nameContainer}>
                                                        <p className={style.label}>Confirm password</p>
                                                        <input type='text' value={confirmPassword} placeholder='confirm password' onChange={checkConfirmationPassword}/>
                                                    </div>
                                                        {
                                                            confirmPassword && (
                                                                <div className={style.confirmPassContainer}>
                                                                    {matchChar ? <FaCheck size={10} color='green'/> :  <ImCross size={10} color='red'/>} 
                                                                    <p>{matchChar ? 'Password match' : "Password doesn't match"}</p>
                                                                </div>
                                                            )
                                                        }
                                                    <div id={style.info}>
                                                        <p>Please create a strong password with at least 12 characters. Include a mix of uppercase and lowercase letters, numbers, and symbols for better security.</p>
                                                    </div>
                                                    <button id={style.btnSaveChanges} disabled={matchChar && reuseChar && specialChar && mixChar && charLength ? false : true} onClick={handleChangePassword}>Save change</button>
                                                </>
                                            )
                                        }

                                    
                                    </div>
                                </div>
                            ) : (
                                <>
                                <div className='d-flex gap-2 mt-5'>
                                    <div className={style.nameContainer}>
                                        <p className={style.label}>Firstname</p>
                                        <input type='text' value={firstname} onChange={(e) => setfirstname(e.target.value)}/>
                                    </div>
                                    <div className={style.nameContainer}>
                                        <p className={style.label}>Middlename</p>
                                        <input type='text' value={middlename} onChange={(e) => setmiddlename(e.target.value)}/>
                                    </div>
                                    <div className={style.nameContainer}>
                                        <p className={style.label}>Lastname</p>
                                        <input type='text' value={lastname} onChange={(e) => setlastname(e.target.value)}/>
                                    </div>
                                </div>
                                    <div className={style.body}>
                                        <div className={style.nameContainer}>
                                            <p className={style.label}>Email</p>
                                            <input type='text' value={email} onChange={(e) => setemail(e.target.value)}/>
                                        </div>
                                        <button onClick={() => setshowChangePass(true)}>Change password</button>
                                    </div>
                                <button onClick={handleSaveChangesProfile} disabled={isTheirChanges() ? false : true} id={style.btnSaveChanges}>Save Changes</button>
                                </>
                            )
                        }

                    </div>
                </>
            )
        }

    </div>
  )
}

export default ManageAccount