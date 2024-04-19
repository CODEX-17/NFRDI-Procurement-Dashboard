import React from 'react'
import style from './Sidebar.module.css'
import { IoMdHome } from "react-icons/io";
import { useChooseTab } from '../stores/useChooseTab' 

const Sidebar = () => {

    const { updateChoose, choose } = useChooseTab()

  return (
    <div className={style.container}>
       <div className={style.header}>
            <img src='/logoWhite.png'/>
            <h2>NRFDI</h2>
       </div>
       <div className={style.home} onClick={() => updateChoose('dashboard')}>
            <IoMdHome color='#004481' size={25}/>   
            <p>Dashboard</p>
       </div>   
       <div className={style.tabList}>
            <h2 className={style.titleTab}>Procurement Mode</h2>
            <div className={choose === 'bidding' ? style.cardTabActived : style.cardTab} onClick={() => updateChoose('bidding')} > Bidding</div>
            <div className={choose === 'alternative' ? style.cardTabActived : style.cardTab} size={20} onClick={() => updateChoose('alternative')}> Alternative</div>
       </div>
       
    </div>
  )
}

export default Sidebar