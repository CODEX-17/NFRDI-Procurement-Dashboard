import React, { useEffect, useState } from 'react'
import style from './DashboardPage.module.css'
import { MdFormatListBulleted } from "react-icons/md";
import Sidebar from '../components/Sidebar';
import { IoNotifications } from "react-icons/io5";
import { IoPersonOutline } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";
import { LiaPowerOffSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom';
import { useChooseTab } from '../stores/useChooseTab'
import ProjectsPage from './ProjectsPage';
import ModalComponent from '../components/ModalComponent';
import PreviewPDF from '../components/PreviewPDF';
import ManageAccount from '../components/ManageAccount';
import axios from 'axios';
import LoadingComponents from '../components/LoadingComponents';
import PreviewSearchResult from '../components/PreviewSearchResult';
import GraphsPage from './GraphsPage';
import ActivityLog from '../components/ActivityLog';


const DashboardPage = () => {

  //Show variables
  const [isShowSideBar, setisShowSideBar] = useState(true)
  const [isShowloading, setisShowloading] = useState(true)
  const [isShowViewSearch, setisShowViewSearch] = useState(false)
  const [isShowManageAccount, setisShowManageAccount] = useState(false)
  const [showProfileCard, setshowProfileCard] = useState(false)
  const [showSearchResults, setshowSearchResults] = useState(false)
  const [isShowActivityLog, setIsShowActivityLog] = useState(false)

  const [searchList, setsearchList] = useState(null)
  const [projectList, setProjectList] = useState(null)
  const [itemView, setitemView] = useState(null)
  const auth = JSON.parse(localStorage.getItem('user'))

  const navigate = useNavigate()

  const { modal, previewPDF, choose } = useChooseTab()

  useEffect(() => {

    axios.get('http://localhost:5000/getProject')
    .then(res => {
        setProjectList(res.data)
    })
    .catch(err => console.error(err))

    if (!auth) {
      navigate('/')
    }

    setTimeout(() => {
      setisShowloading(false)
    }, 4000);
  },[])


  const handleSignOut = () => {
    localStorage.clear()
    navigate('/')
  }

  
  const convertDateFormat = (date) => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const finalDate = new Date(date);
    return finalDate.toLocaleDateString('en-US', options);
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const search = e.target.value

    if (search === null || search === undefined || search === '' || search.length <= 0) {
      setshowSearchResults(false)
    }else {
      setshowSearchResults(true)
    }

    let allDatas = []

    for (let i = 0; i < projectList.length; i++) {
      let data = projectList[i];
      data.date_published = convertDateFormat(data.date_published)
      allDatas.push(data)
    }

    const results = allDatas.filter(item => {
      return Object.values(item).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
      )
    })

    setsearchList(results)

  }

  const generateImage = (image_id) => {
    if (localStorage.getItem('images')) {
      const images = JSON.parse(localStorage.getItem('images'))
      const url = 'http://localhost:5000/'
      const filter = images.filter((images) => images.image_id === image_id).map((images) => images.image_name)
      return url+filter[0]
    }else {
      return '/logo.jpg'
    }
  }

  const handleViewSearch = (data) => {
    setisShowViewSearch(true)
    setitemView(data)
  }

  const generateTitle = (title) => {
      if (title.length > 15) {
          return title.substring(0, 10)+'...'
      }
      return title
  }

  return (
    <div className={style.container}>

         {
          previewPDF &&
          <div className={style.previewPDF}>
              <PreviewPDF/>
          </div>
         }

         {
          isShowViewSearch &&
          <div className={style.previewSearch}>
              <PreviewSearchResult itemView={itemView} setisShowViewSearch={setisShowViewSearch}/>
          </div>
         }

         {
          isShowManageAccount &&
          <div className={style.previewPDF}>
              <ManageAccount setisShowManageAccount={setisShowManageAccount}/>
          </div>
         }

        {
          isShowActivityLog &&
          <div className={style.previewPDF}>
              <ActivityLog setIsShowActivityLog={setIsShowActivityLog}/>
          </div>
         }

        {
          isShowSideBar && (
            <div className={style.left}>
              <Sidebar/>
            </div>
          )
        }
        <div className={style.right}>
            {
              modal.show &&  <div className={style.modal}><ModalComponent /></div>
            }
           
            <div className={style.header}>
                <MdFormatListBulleted color='#004481' size={25} cursor={'pointer'} onClick={() => setisShowSideBar(!isShowSideBar)}/>
                <input placeholder='Search...' onChange={handleSearch}></input>
                <div className={style.horizontal}>
                  <IoNotifications color='#004481' size={20} cursor={'pointer'}/>
                  {
                    auth.image_id === 'none' ? (
                      <div id={style.profileDefault} onMouseEnter={() => setshowProfileCard(!showProfileCard)}>{auth.first_name.charAt(0)}</div>
                    ) : (
                      <img src={generateImage(auth.image_id)} onMouseEnter={() => setshowProfileCard(!showProfileCard)} />
                    ) 
                  }
                  
                </div>
            </div>
            <div className={style.content}>
              {
                showProfileCard && (
                  <div className={style.cardShow} onMouseLeave={() =>setshowProfileCard(false)}>
                    <div className={style.card}>
                      <h2>{auth.first_name+' '+auth.last_name}</h2>
                      <p>Administrator</p>
                      <hr/>
                      <div id={style.icons}>
                        <IoPersonOutline/>
                        <p onClick={() => setisShowManageAccount(true)}>Edit Profile</p>
                      </div>
                      <div id={style.icons} onClick={() => setIsShowActivityLog(true)}>
                        <FiActivity/>
                        <p>Activity Log</p>
                      </div>
                      <div id={style.icons} onClick={handleSignOut}>
                        <LiaPowerOffSolid/>
                        <p>Sign Out</p>
                      </div>
                    </div>
                  </div>
                )
              }

              {
                showSearchResults &&
                <div className={style.searchDiv}>
                  <div className={style.searchCard}>
                  {
                    searchList && 
                      searchList.map((data) => (
                        <div className={style.searchContent}>
                            <div className={style.vertical}>
                              <p>{data.pr_code}</p>
                              <h2 title={data.title}>{generateTitle(data.title)}</h2>
                            </div>
                            {data.date_published}
                            <button onClick={() => handleViewSearch(data)}>View</button>
                        </div>
                      ))
                  }
                  </div>
                </div>
              }
              
              {
                  isShowloading ? (
                    <div className={style.loading}>
                      <LoadingComponents/>
                    </div>
                  ) : (
                    choose === 'bidding' || choose === 'alternative' ? <ProjectsPage/> : <GraphsPage/>
                  )
              }

               
            </div>
            

          </div>
    </div>
  )
}

export default DashboardPage