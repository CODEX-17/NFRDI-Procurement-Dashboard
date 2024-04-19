import { create } from 'zustand'
import axios from 'axios'

const useAccountStore = create((set) => ({

  getAccount: () => {
    axios.get('http://localhost:5000/getAccount')
    .then(res => localStorage.setItem('accounts', JSON.stringify(res.data)))
    .catch(err => console.error(err))
  },



}))

export { useAccountStore };