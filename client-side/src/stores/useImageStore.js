import { create } from 'zustand'
import axios from 'axios'

const useImageStore = create((set) => ({

  getImages: () => {
    axios.get('http://localhost:5000/getImages')
    .then(res => localStorage.setItem('images', JSON.stringify(res.data)))
    .catch(err => console.error(err))
  },

}))

export { useImageStore };