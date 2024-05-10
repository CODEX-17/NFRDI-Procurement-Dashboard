import { create } from 'zustand'

const useChooseTab = create((set) => ({

  choose: 'dashboard',
  
  deleteFile: 'no',

  modal: {
    show: false,
    type: 'add',
  },

  selectProject: null,

  previewPDF: false,

  pdf: null,

  loading: false,

  updateChoose: (choose) => {
    set({ choose: choose })
  },

  updateDelete: (choose) => {
    set({ deleteFile: choose })
  },

  updateModal: (action, type) => {
    set({ modal: 
      {
        show: action,
        type,
      } 
    })
  },

  updateLoading: (state) => {
    set({ loading: state })
  },

  updatePDF: (file) => {
    set({ pdf: file })
  },

  updatePreviewPDF: (state) => {
    set({ previewPDF: state })
  },

  updateSelectProject: (data) => {
    set({ selectProject: data })
  },

}))

export { useChooseTab };