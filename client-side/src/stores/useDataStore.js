import { create } from 'zustand'

const useDataStore = create((set) => ({

  editMode: {
    pr_Number: null,
    type: undefined,
  },

  bidding: [
    {
        pr_Number: '1500-23BAC',
        title: 'Supply of Labor and Materials for the Improvement of the BPI NSQCS CAR (Phase II) Guisad, Baguio City',
        contractor: 'DANGLI TOPING BUILDERS',
        contract_amount: 2976154.71,
        bac_resolution: 'PR_No._1500-23BAC.',
        notice_of_award: 'PR_No._1500-23BAC.',
        contact: 'PR_No._1500-23BAC.',
        notice_to_proceed: 'PR_No._1500-23BAC.',
        philgeps_award_notice: 'PR_No._1500-23BAC.',
        date_publish: 'FEB 8 2024',
    },
  ],

  alternative:  [
    {
        pr_Number: '1500-23BAC',
        title: 'Supply of Labor and Materials for the Improvement of the BPI NSQCS CAR (Phase II) Guisad, Baguio City',
        contractor: 'DANGLI TOPING BUILDERS',
        contract_amount: '2,976,154.71',
        bac_resolution: 'PR_No._1500-23BAC.',
        notice_of_award: 'PR_No._1500-23BAC.',
        philgeps_award_notice: 'PR_No._1500-23BAC.',
        date_publish: 'Jan. 2, 2024',
    },
  ],

  addBidding: (data) => {
    set((state) => ({
        ...state,
        bidding: [...state.bidding, data]
      }));
    
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

export { useDataStore };