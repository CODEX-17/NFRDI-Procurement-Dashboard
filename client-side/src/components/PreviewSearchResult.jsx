import React from 'react'
import style from './PreviewSearchResult.module.css'
import { IoMdExit } from "react-icons/io";
import { useChooseTab } from '../stores/useChooseTab';

const PreviewSearchResult = ({ itemView, setisShowViewSearch }) => {

  const { updatePreviewPDF, updatePDF } = useChooseTab()

  const viewFile = (fileName) => {
    console.log(fileName)
    if (fileName) {
        updatePDF(fileName)
        updatePreviewPDF(true)
    }
    
  }

  return (
    <div className={style.container}>
        <div className={style.exitCon}>
            <IoMdExit size={25} id={style.exit} title='closed' onClick={() => setisShowViewSearch(false)}/>
        </div>
        <div className={style.top}>
            <div id={style.badge}>{itemView.type === 1 ? 'Bidding' : 'Alternative'}</div>
            <p>pr code</p>
            <h2>{itemView.pr_no}</h2>
            <p>title</p>
            <h2>{itemView.title}</h2>
            <p>contrator</p>
            <h2>{itemView.contractor}</h2>
            <p>date publish</p> 
            <h2>{itemView.date_published}</h2>
        </div>

        <div className={style.bot}>
            <div className='d-flex gap-5 justify-content-between align-items-end'>
                <div className={style.vertical}>
                    <p>BAC RESOLUTION</p>
                    <button className={itemView.bac_resolution ? style.btnActived : style.btnDisabled}  onClick={() => viewFile(itemView.bac_resolution)}>View</button>
                </div>
                <div className={style.vertical}>
                    <p>NOTICE OF AWARD</p>
                    <button className={itemView.notice_of_award ? style.btnActived : style.btnDisabled} onClick={() => viewFile(itemView.notice_of_award)}>View</button>
                </div>
                <div className={style.vertical}>
                    <p>CONTRACT</p>
                    <button className={itemView.contract ? style.btnActived : style.btnDisabled} onClick={() => viewFile(itemView.contract)}>View</button>
                </div>
                <div className={style.vertical}>
                    <p>NOTICE TO PROCEED</p>
                    <button className={itemView.notice_to_proceed ? style.btnActived : style.btnDisabled} onClick={() => viewFile(itemView.notice_to_proceed)}>View</button>
                </div>
                <div className={style.vertical}>
                    <p>PHILGEPS AWARD NOTICE</p>
                    <button className={itemView.philgeps_award_notice ? style.btnActived : style.btnDisabled} onClick={() => viewFile(itemView.philgeps_award_notice)}>View</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PreviewSearchResult