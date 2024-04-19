import { create } from 'zustand'
import axios from 'axios';

const useFileStore = create((set) => ({

    getFiles: () => {
        axios.get('http://localhost:5000/getFiles')
        .then(res => localStorage.setItem('files', JSON.stringify(res.data)))
        .catch(err => console.error(err))
    },

    addAlternative: (data) => {
        set((state) => ({
            ...state,
            alternative: [...state.alternative, data]
        }));
    },

    updateEditMode: (pr_Number, type) => {
        set({ 
        editMode: {
            pr_Number,
            type,
        } 
        })
    }

}))

export { useFileStore };