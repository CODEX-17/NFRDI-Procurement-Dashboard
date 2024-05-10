import React, { useEffect, useRef, useState } from 'react'
import style from './ModalComponent.module.css'
import { IoMdClose } from "react-icons/io";
import { useChooseTab } from '../stores/useChooseTab';
import { useFileStore } from '../stores/useFileStore';
import { useProjectsStore } from '../stores/useProjectsStore';
import axios from 'axios';
import { Document, Page } from 'react-pdf';

const ModalComponent = () => {

  const { updateModal, choose, modal, updateLoading, selectProject } = useChooseTab()
  const { addProject, getProject } = useProjectsStore()
  const user = JSON.parse(localStorage.getItem('user'))

  const [current_pr_Number, setcurrent_pr_Number] = useState()
  const [current_title, setcurrent_title] = useState()
  const [current_contractor, setcurrent_contractor] = useState()
  const [current_contract_amount, setcurrent_contract_amount] = useState()
  const [current_bac_resolution, setcurrent_bac_resolution] = useState(null)
  const [current_notice_of_award, setcurrent_notice_of_award] = useState(null)
  const [current_contract, setcurrent_contract] = useState(null)
  const [current_notice_to_proceed, setcurrent_notice_to_proceed] = useState(null)
  const [current_philgeps_award_notice, setcurrent_philgeps_award_notice] = useState(null)
  const [current_date_published, setcurrent_date_published] = useState()
  const [current_status, setcurrent_status] = useState('ongoing')

  const [errMess, seterrMess] = useState(null)
  const inputRef = useRef(null)

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

  useEffect(() => {

    if (modal.type === 'edit' && selectProject) {
      console.log(selectProject)
      setcurrent_pr_Number(selectProject.pr_no)
      setcurrent_title(selectProject.title)
      setcurrent_contract_amount(parseFloat(selectProject.contract_amount))
      setcurrent_contract(selectProject.contract)
      setcurrent_contractor(selectProject.contractor)
      setcurrent_bac_resolution(selectProject.bac_resolution)
      setcurrent_notice_of_award(selectProject.notice_of_award)
      setcurrent_notice_to_proceed(selectProject.notice_to_proceed)
      setcurrent_philgeps_award_notice(selectProject.philgeps_award_notice)
      setcurrent_date_published(selectProject.date_published)
    }
    
  },[])

  const handleCloseModal = () => {
    updateModal(false, 'add')
  }

  const handleAddBidding = (e) => {
    e.preventDefault()
    updateLoading(true)

    if (current_pr_Number) {

      console.log(user)
        const dataInputed = {
          pr_no: current_pr_Number,
          title: current_title,
          accnt_id: user[0].accnt_id,
          contractor: current_contractor,
          type: 1, // 1 = bidding, 2 = alternative
          contract_amount: current_contract_amount,
          bac_resolution: current_bac_resolution,
          notice_of_award: current_notice_of_award,
          contract: current_contract,
          notice_to_proceed: current_notice_to_proceed,
          philgeps_award_notice: current_philgeps_award_notice,
          date_published: current_date_published,
          status: current_status,
      }
        
        addProject(dataInputed)

        setTimeout(() => {
          updateLoading(false)
          updateModal(false, 'add')
        }, 3000);

    }else {
      alert('please insert pr')
    }

  }

  const handleAddAlternative = (e) => {
    e.preventDefault()
    updateLoading(true)

    const dataInputed = {
        pr_no: current_pr_Number,
        title: current_title,
        accnt_id: user[0].accnt_id,
        contractor: current_contractor,
        type: 2, // 1 = bidding, 2 = alternative
        contract_amount: current_contract_amount,
        bac_resolution: current_bac_resolution,
        notice_of_award: current_notice_of_award,
        contract: null,
        notice_to_proceed: null,
        philgeps_award_notice: current_philgeps_award_notice,
        date_published: current_date_published,
        status: current_status,
    }

    addProject(dataInputed)
    setTimeout(() => {
      updateLoading(false)
      updateModal(false, 'add')
    }, 3000);
  }

  const generateFile = (file_name) => {
    if (file_name) {
      return 'http://localhost:5000/' + file_name
    }
  }

  const handleUpload = (data, type) => {
    console.log(data)

    if (data) {
      const fileName = data.name;
      const lastDotIndex = fileName.lastIndexOf('.')
      const fileExtension = fileName.substring(lastDotIndex + 1)

      if (fileExtension.toUpperCase() === 'PDF') {
        seterrMess(null)

        if (type === 'bac') {
          setcurrent_bac_resolution(data)
        }else if (type === 'award') {
          setcurrent_notice_of_award(data)
        }else if (type === 'contract') {
          setcurrent_contract(data)
        }else if (type === 'proceed') {
          setcurrent_notice_to_proceed(data)
        }else if (type === 'philgeps') {
          setcurrent_philgeps_award_notice(data)
        }
        
      }else {
        seterrMess('file is not a PDF file.')
      }
    }

    

  }


const handleIfDuplicatePr = (e) => {
  e.preventDefault()
  const value = e.target.value
  const data = JSON.parse(localStorage.getItem('projects'))
  const filter = data.filter((prj) => prj.pr_no.toUpperCase() === value.toUpperCase())

  if (filter.length > 0) {
    seterrMess('(Pr_number is already used)')
    inputRef.current.style.outlineColor = 'red'
    inputRef.current.style.color = 'red'
    setcurrent_pr_Number(null)
  }else {
    seterrMess(null)
    inputRef.current.style.outlineColor = 'black'
    inputRef.current.style.color = 'black'
    setcurrent_pr_Number(value)
  }
  

}

const handleSubmitEdit = (e) => {
  e.preventDefault()  

  if (
    current_pr_Number,
    current_title,
    current_contractor,
    current_contract_amount,
    current_bac_resolution,
    current_notice_of_award,
    current_contract,
    current_notice_to_proceed,
    current_philgeps_award_notice,
    current_date_published,
    current_status
  ) {

    const data = {
      pr_no: current_pr_Number,
      accnt_id: selectProject.accnt_id,
      title: current_title,
      contractor: current_contractor,
      contract_amount: current_contract_amount,
      date_published: current_date_published,
      status: current_status,
      file_id: selectProject.file_id,
    }

    console.log(data)

    axios.post('http://localhost:5000/updateProjectDetails', {obj:data})
    .then((res) => {
      const message =  res.data
      console.log(message)

      const formData = new FormData
      formData.append('pr_no', current_pr_Number)
      formData.append('file_id', selectProject.file_id)

      console.log('bac', current_bac_resolution)

      if (Array.isArray(current_bac_resolution)) {
        console.log(1)
        formData.append('bac_resolution', current_bac_resolution)
      }

      if (Array.isArray(current_notice_of_award)) {
        console.log(2)
        formData.append('notice_of_award', current_notice_of_award)
      }

      if (Array.isArray(current_contract)) {
        console.log(3)
        formData.append('contract', current_contract)
      }

      if (Array.isArray(current_notice_to_proceed)) {
        console.log(4)
        formData.append('notice_to_proceed', current_notice_to_proceed)
      }

      if (Array.isArray(current_philgeps_award_notice)) {
        console.log(5)
        formData.append('philgeps_award_notice', current_philgeps_award_notice)
      }

      axios.post('http://localhost:5000/uploadFiles', formData)
      .then((res) => {
        const message =  res.data
        console.log(message)
        updateModal(false, 'edit')
      })
      .catch(err => console.error(err))

    })
    .catch(err => console.error(err))


  }

}

const handleUploadFiles = (e, type) => {
  e.preventDefault()
  const file = e.target.files[0]
  
  if (type === 'bac-resolution') {
    setcurrent_bac_resolution(file)
  }else if (type === 'notice-of-award') {
    setcurrent_notice_of_award(file)
  }else if (type === 'contract') {
    setcurrent_contract(file)
  }else if (type === 'notice-to-proceed') {
    setcurrent_notice_to_proceed(file)
  }else if (type === 'philgeps-award-notice') {
    setcurrent_notice_to_proceed(file)
  }
  
}

const handleViewFiles = (data) => {
  console.log(data)
  if (data) {
    if (Array.isArray(data)) {
      return URL.createObjectURL(data)
    }else {
      return 'http://localhost:5000/' + data
    }
  }
  
  return ''
}

  return (
    <div className={style.container}>
      <div className={style.headMenu}>
        <div className='d-flex gap-2 align-items-center'>
          <h2>{modal.type === 'add' ? 'Add' : 'Edit'}{choose === 'bidding' ? ' Bidding' : ' Alternative'}</h2>
          {errMess && <p id={style.notifError}>{errMess}</p>}
        </div>
          
          <IoMdClose id={style.icons} onClick={handleCloseModal}/>
      </div>
      <div className={style.content}>
      {
            modal.type === 'add' && (
              choose === 'bidding' ? (
                <form onSubmit={handleAddBidding}>
                  <div className='d-flex w-100 justify-content-between gap-2'>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      <label>PR Number<p className={style.requiredMes}>*required</p></label>
                      <input type='text' ref={inputRef} placeholder='PR Number' required style={{ height: '40px', paddingLeft: '10px' }} onChange={handleIfDuplicatePr}/>
                    </div>

                    <div className='d-flex flex-column align-items-lg-start w-75'>
                      <label>Title / Project <p className={style.requiredMes}>*required</p></label>
                      <input type='text' placeholder='Title / Project' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_title(e.target.value)}/>
                    </div>
                  </div>

                  <div className='d-flex w-100 justify-content-between gap-2'>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      <label>Contract Amount <p className={style.requiredMes}>*required</p></label>
                      <input type='number' placeholder='Contract Amount' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_contract_amount(e.target.value)}/>
                    </div>

                    <div className='d-flex flex-column align-items-lg-start w-75'>
                      <label>Contractor <p className={style.requiredMes}>*required</p></label>
                      <input type='text p-2' placeholder='Contract' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_contractor(e.target.value)}/>
                    </div>
                  </div>

                  <div className='d-flex w-100 justify-content-between align-items-center gap-2'>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_bac_resolution &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_bac_resolution)}/>
                        </div>
                      }
                      <label>Bac Resolution</label>
                      <input type='file' accept='.pdf' onChange={(e) => handleUpload(e.target.files[0], 'bac')}/>
                    </div>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_notice_of_award &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_notice_of_award)}/>
                        </div>
                      }
                      <label>Notice of award</label>
                      <input type='file' accept='.pdf' onChange={(e) => handleUpload(e.target.files[0], 'award')}/>
                    </div>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_contract &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_contract)}/>
                        </div>
                      }
                      <label>Contract</label>
                      <input type='file' accept='.pdf' onChange={(e) => handleUpload(e.target.files[0], 'contract')}/>
                    </div>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_notice_to_proceed &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_notice_to_proceed)}/>
                        </div>
                      }
                      <label>Notice to proceed</label>
                      <input type='file' accept='.pdf' onChange={(e) => handleUpload(e.target.files[0], 'proceed')}/>
                    </div>
                  </div>

                  <div className='d-flex w-100 justify-content-between align-items-center gap-2'>
                    
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_philgeps_award_notice &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_philgeps_award_notice)}/>
                        </div>
                      }
                      <label>Philgeps Award notice</label>  
                      <input type='file' accept='.pdf' onChange={(e) => handleUpload(e.target.files[0], 'philgeps')}/>
                    </div>  


                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      <label>Status <p className={style.requiredMes}>*required</p></label>  
                      <select required onChange={(e) => setcurrent_status(e.target.value)}>
                        <option value='ongoing'>ongoing</option>
                        <option value='completed'>completed</option>
                      </select>
                    </div>

                    <div className='d-flex flex-column align-items-lg-start w-50'>
                      <label>Date publish <p className={style.requiredMes}>*required</p></label>
                      <input type='date' placeholder='Contract' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_date_published(e.target.value)}/>
                    </div>
                  </div>
                  <button type='submit'>Submit</button>
                </form>
              ) : (
                <form onSubmit={handleAddAlternative}>
                  <div className='d-flex w-100 justify-content-between gap-2'>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      <label>PR Number<p className={style.requiredMes}>*required</p></label>
                      <input type='text' placeholder='PR Number' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_pr_Number(e.target.value)}/>
                    </div>

                    <div className='d-flex flex-column align-items-lg-start w-75'>
                      <label>Title / Project <p className={style.requiredMes}>*required</p></label>
                      <input type='text' placeholder='Title / Project' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_title(e.target.value)}/>
                    </div>
                  </div>

                  <div className='d-flex w-100 justify-content-between gap-2'>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      <label>Contract Amount <p className={style.requiredMes}>*required</p></label>
                      <input type='number' placeholder='Contract Amount' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_contract_amount(e.target.value)}/>
                    </div>

                    <div className='d-flex flex-column align-items-lg-start w-75'>
                      <label>Contractor <p className={style.requiredMes}>*required</p></label>
                      <input type='text p-2' placeholder='Contract' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_contractor(e.target.value)}/>
                    </div>
                  </div>

                  <div className='d-flex w-100 justify-content-between align-items-center gap-2'>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_bac_resolution &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_bac_resolution)}/>
                        </div>
                      }
                      <label>Bac Resolution</label>
                      <input type='file' onChange={(e) => handleUpload(e.target.files[0], 'bac')}/>
                    </div>
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_notice_of_award &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_notice_of_award)}/>
                        </div>
                      }
                      <label>Notice of award</label>
                      <input type='file' onChange={(e) => handleUpload(e.target.files[0], 'award')}/>
                    </div>
                  </div>

                  <div className='d-flex w-100 justify-content-between align-items-center gap-2'>
                    
                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      {
                        current_philgeps_award_notice &&
                        <div className={style.previewFile}>
                          <iframe src={URL.createObjectURL(current_philgeps_award_notice)}/>
                        </div>
                      }
                      <label>Philgeps Award notice</label>  
                      <input type='file' placeholder='Contract Amount' onChange={(e) => handleUpload(e.target.files[0], 'philgeps')}/>
                    </div>  


                    <div className='d-flex flex-column align-items-lg-start w-25'>
                      <label>Status <p className={style.requiredMes}>*required</p></label>  
                      <select required onChange={(e) => setcurrent_status(e.target.value)}>
                        <option value='ongoing'>ongoing</option>
                        <option value='complete'>complete</option>
                      </select>
                    </div>

                    <div className='d-flex flex-column align-items-lg-start w-50'>
                      <label>Date publish <p className={style.requiredMes}>*required</p></label>
                      <input type='date' placeholder='Contract' required style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => setcurrent_date_published(e.target.value)}/>
                    </div>
                  </div>
                  <button type='submit'>Submit</button>
                </form>
              )
            ) ||

            modal.type === 'edit' && (
              choose === 'bidding' ? (
                  <form onSubmit={handleSubmitEdit}>
                      <div className='d-flex w-100 justify-content-between gap-2'>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          <label>PR Code</label>
                          <input type='text' placeholder='PR Number' value={current_pr_Number} onChange={(e) => setcurrent_pr_Number(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>

                        <div className='d-flex flex-column align-items-lg-start w-75'>
                          <label>Title / Project</label>
                          <input type='text' placeholder='Title / Project' value={current_title} onChange={(e) => setcurrent_title(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>
                      </div>

                      <div className='d-flex w-100 justify-content-between gap-2'>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          <label>Contract Amount</label>
                          <input type='number' placeholder='Contract Amount' value={current_contract_amount} onChange={(e) => setcurrent_contract_amount(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>

                        <div className='d-flex flex-column align-items-lg-start w-75'>
                          <label>Contractor</label>
                          <input type='text p-2' placeholder='Contract' value={current_contractor} onChange={(e) => setcurrent_contractor(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>
                      </div>

                      <div className='d-flex w-100 justify-content-between gap-2'>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_bac_resolution &&
                            <div className={style.previewFile}>
                              <iframe src={handleViewFiles(current_bac_resolution)}/>
                            </div>
                          }
                          <label>Bac Resolution11</label>
                          <input type='file' placeholder='Contract Amount' onChange={(e) => handleUploadFiles(e, 'bac-resolution')}/>
                        </div>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_notice_of_award &&
                            <div className={style.previewFile}>
                              <iframe src={Array.isArray(current_notice_of_award) ? URL.createObjectURL(current_notice_of_award) : generateFile(current_notice_of_award)}/>
                            </div>
                          }
                          <label>Notice of award</label>
                          <input type='file' placeholder='Contract Amount'/>
                        </div>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_contract &&
                            <div className={style.previewFile}>
                              <iframe src={Array.isArray(current_contract) ? URL.createObjectURL(current_contract) : generateFile(current_contract) }/>
                            </div>
                          }
                          <label>Contract</label>
                          <input type='file' placeholder='Contract Amount'/>
                        </div>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_notice_to_proceed &&
                            <div className={style.previewFile}>
                              <iframe src={Array.isArray(current_notice_to_proceed) ? URL.createObjectURL(current_notice_to_proceed) : generateFile(current_notice_to_proceed)}/>
                            </div>
                          }
                          <label>Notice to proceed</label>
                          <input type='file' placeholder='Contract Amount'/>
                        </div>
                      </div>

                      <div className='d-flex w-100 justify-content-between gap-2'>
                        
                        <div className='d-flex flex-column align-items-lg-start w-50'>
                          {
                            current_philgeps_award_notice &&
                            <div className={style.previewFile}>
                              <iframe src={Array.isArray(current_notice_to_proceed) ? URL.createObjectURL(current_philgeps_award_notice) : generateFile(current_philgeps_award_notice)}/>
                            </div>
                          }
                          <label>Philgeps Award notice</label>  
                          <input type='file' />
                        </div>

                        <div className='d-flex flex-column align-items-lg-start w-50'>
                          <label>Date publish</label>
                          <input type='date' value={current_date_published?.substring(0,10)} placeholder='Contract' style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => translateDate(e.target.value)}/>
                        </div>
                      </div> 
                      <button type='submit'>Submit</button>
                    </form>
                ):(
                  <form onSubmit={handleSubmitEdit}>
                      <div className='d-flex w-100 justify-content-between gap-2'>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          <label>PR Code</label>
                          <input type='text' placeholder='PR Number' value={current_pr_Number} onChange={(e) => setcurrent_pr_Number(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>

                        <div className='d-flex flex-column align-items-lg-start w-75'>
                          <label>Title / Project</label>
                          <input type='text' placeholder='Title / Project' value={current_title} onChange={(e) => setcurrent_title(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>
                      </div>

                      <div className='d-flex w-100 justify-content-between gap-2'>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          <label>Contract Amount</label>
                          <input type='number' placeholder='Contract Amount' value={current_contract_amount} onChange={(e) => setcurrent_contract_amount(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>

                        <div className='d-flex flex-column align-items-lg-start w-75'>
                          <label>Contractor</label>
                          <input type='text p-2' placeholder='Contract' value={current_contractor} onChange={(e) => setcurrent_contractor(e.target.value)} style={{ height: '40px', paddingLeft: '10px' }}/>
                        </div>
                      </div>

                      <div className='d-flex w-100 justify-content-between gap-2'>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_bac_resolution &&
                            <div className={style.previewFile}>
                              <iframe src={generateFile(current_bac_resolution)}/>
                            </div>
                          }
                          <label>Bac Resolution1</label>
                          <input type='file' placeholder='Bac Resolution' onChange={(e) => handleUploadFiles(e, 'bac-resolution')}/>
                        </div>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_notice_of_award &&
                            <div className={style.previewFile}>
                              <iframe src={generateFile(current_notice_of_award)}/>
                            </div>
                          }
                          <label>Notice of award</label>
                          <input type='file' placeholder='Contract Amount'/>
                        </div>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_contract &&
                            <div className={style.previewFile}>
                              <iframe src={generateFile(current_contract)}/>
                            </div>
                          }
                          <label>Contract</label>
                          <input type='file' placeholder='Contract Amount'/>
                        </div>
                        <div className='d-flex flex-column align-items-lg-start w-25'>
                          {
                            current_notice_to_proceed &&
                            <div className={style.previewFile}>
                              <iframe src={generateFile(current_notice_to_proceed)}/>
                            </div>
                          }
                          <label>Notice of proceed</label>
                          <input type='file' placeholder='Contract Amount'/>
                        </div>
                      </div>

                      <div className='d-flex w-100 justify-content-between gap-2'>
                        
                        <div className='d-flex flex-column align-items-lg-start w-50'>
                          {
                            current_philgeps_award_notice &&
                            <div className={style.previewFile}>
                              <iframe src={generateFile(current_philgeps_award_notice)}/>
                            </div>
                          }
                          <label>Philgeps Award notice</label>  
                          <input type='file' />
                        </div>

                        <div className='d-flex flex-column align-items-lg-start w-50'>
                          <label>Date publish</label>
                          <input type='date' value={current_date_published} placeholder='Contract' style={{ height: '40px', paddingLeft: '10px' }} onChange={(e) => translateDate(e.target.value)}/>
                        </div>
                      </div> 
                      <button type='submit'>Submit</button>
                    </form>
              )
            )
        
      }
      

      </div>
     
    </div>
  )
}

export default ModalComponent