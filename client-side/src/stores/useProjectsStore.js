import { create } from 'zustand'
import axios from 'axios'

const useProjectsStore = create((set) => ({
  
  projects: null,

  getProject: () => {
    axios.get('http://localhost:5000/getProject')
    .then(res => localStorage.setItem('projects', JSON.stringify(res.data)))
    .catch(err => console.error(err))
  },

  generateUniqueId: () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  },


  addProject: (obj) => {

    const formData = new FormData

    console.log('obj',obj)

    if (obj.bac_resolution !== null) {
      formData.append('bac_resolution', obj.bac_resolution)
    }
    
    if (obj.notice_of_award !== null) {
      formData.append('notice_of_award', obj.notice_of_award)
    }
    
    if (obj.contract !== null) {
      formData.append('contract', obj.contract)
    }
    
    if (obj.otice_to_proceed !== null) {
      formData.append('notice_to_proceed', obj.notice_to_proceed)
    }
    
    if (obj.philgeps_award_notice !== null) {
      formData.append('philgeps_award_notice', obj.philgeps_award_notice)
    }

    axios.post(`http://localhost:5000/uploadFiles/${obj.pr_no}`, formData, {
        headers: {
          'Content-Type':'multipart/form-data',
        },
    })
    .then((res) => {
      console.log(res.data)
      // const data = {
      //   pr_no
      //   accnt_id
      //   type
      //   title
      //   contractor
      //   contract_amount
      //   date_published
      //   status
      // }
    })
    .catch((err) => console.log(err))

    axios.post('http://localhost:5000/addProject', {obj})
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err))

  },

  deleteProject: (pr_no) => {
    axios.put('http://localhost:5000/deleteProject', {pr_no})
    .then(res => console.log(res.data))
    .catch(err => console.error(err))
  },

}))

export { useProjectsStore };