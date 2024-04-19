import React, { useState } from 'react'
import axios from 'axios'

const Test = () => {

 const [pr_no, setpr_no] = useState()
 const [title, settitle] = useState()
 const [contractor, setcontractor] = useState()
 const [contract_amount, setcontract_amount] = useState()
 const [bac_resolution, setbac_resolution] = useState()
 const [notice_of_award, setnotice_of_award] = useState()
 const [contract, setcontract] = useState()
 const [notice_to_proceed, setnotice_to_proceed] = useState()
 const [philgeps_award_notice, setphilgeps_award_notice] = useState()
 const [date_publish, setdate_publish] = useState()
 const [status, setstatus] = useState()

 const handleSubmit = (e) => {
    e.preventDefault()
    
    const obj = {
        pr_no,
        title,
        contractor,
        contract_amount,
        type,
        bac_resolution,
        notice_of_award,
        contract,
        notice_to_proceed,
        philgeps_award_notice,
        date_publish,
        status
    }
    
 }

  return (
    <div>
        <form onSubmit={handleSubmit} className='w-50'>
            <label>pr_no</label>
            <input className='form-control' type='text' name='pr_no' placeholder='sample' onChange={(e) => setpr_no(e.target.value)}/>
            <label>title</label>
            <input className='form-control' type='text' name='title' placeholder='sample' onChange={(e) => settitle(e.target.value)}/>
            <label>contractor</label>
            <input className='form-control' type='text' name='contractor' placeholder='sample' onChange={(e) => setcontractor(e.target.value)}/>
            <label>contract amount</label>
            <input className='form-control' type='text' name='contract_amount' placeholder='sample' onChange={(e) => setcontract_amount(e.target.value)}/>
            <label>bac_resolution</label>
            <input className='form-control' type='file' name='bac_resolution' placeholder='sample' onChange={(e) => setbac_resolution(e.target.files[0])}/>
            <label>notice_of_award</label>
            <input className='form-control' type='file' name='notice_of_award'  placeholder='sample' onChange={(e) => setnotice_of_award(e.target.files[0])}/>
            <label>contract</label>
            <input className='form-control' type='file' name='contract' placeholder='sample' onChange={(e) => setcontract(e.target.files[0])}/>
            <label>notice_to_proceed</label>
            <input className='form-control' type='file' name='notice_to_proceed' placeholder='sample' onChange={(e) => setnotice_to_proceed(e.target.files[0])}/>
            <label>philgeps_award_notice</label>
            <input className='form-control' type='file' name='philgeps_award_notice' placeholder='sample' onChange={(e) => setphilgeps_award_notice(e.target.files[0])}/>
            <label>date publish</label>
            <input className='form-control' type='date' name='date' placeholder='sample' onChange={(e) => setdate_publish(e.target.files[0])}/>
            <label>status</label>
            <input className='form-control' type='text' name='pr_no' placeholder='sample' onChange={(e) => setstatus(e.target.value)}/>
            <br/>
            <button type='submit'>Submit</button>
        </form>
    </div>
  )
}

export default Test