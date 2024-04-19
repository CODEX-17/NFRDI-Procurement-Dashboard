import React from 'react'
import style from './PreviewPDF.module.css'
import { IoMdExit } from "react-icons/io";
import { useChooseTab } from '../stores/useChooseTab';

const PreviewPDF = () => {

 const { pdf, updatePreviewPDF } = useChooseTab()
 const fileList = JSON.parse(localStorage.getItem('files'))

 const generatePDF = () => {
    const link = 'http://localhost:5000/'
    return link+pdf
 }  

  return (
    <div className={style.container}>
        <div className={style.header}>
            <p>{pdf}</p>
            <IoMdExit id={style.icons} title='close' size={25} color='#004481' cursor={'pointer'} onClick={() => updatePreviewPDF(false)}/>
        </div>
        <div className={style.body}>
            <iframe className={style.iframe} src={generatePDF()} />
        </div>
    </div>
  )
}

export default PreviewPDF