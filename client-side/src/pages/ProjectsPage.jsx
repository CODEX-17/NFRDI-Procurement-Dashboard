import React, { useEffect, useState } from 'react'
import axios from 'axios';
import style from './ProjectsPage.module.css'
import { FaPlus } from "react-icons/fa6";
import { VscServerProcess } from "react-icons/vsc";
import { FaRegCheckCircle } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useChooseTab } from '../stores/useChooseTab';
import { useProjectsStore } from '../stores/useProjectsStore';
import { useFileStore } from '../stores/useFileStore';
import { RiDeleteBinLine } from "react-icons/ri";
import LoadingComponents from '../components/LoadingComponents';
import ModalComponent from '../components/ModalComponent';

const ProjectsPage = () => {

    const { updateModal, updatePDF, updatePreviewPDF, updateSelectProject, choose, updateMessage, updateIsShowMessage, modal } = useChooseTab()
    const { deleteProject, projects } = useProjectsStore()

    const [yearList, setYearList] = useState()

    //Filter Variables
    const [filteredYear, setfilteredYear] = useState('all')
    const [progress, setProgress] = useState('ongoing')

    const [isShowDelete, setisShowDelete] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedFile, setSelectedFile] = useState('')
    const [projectList, setProjectList] = useState(null)
    const [projectRendered, setProjectRendered] = useState([])
    const [filteredData, setFilteredData] = useState(null)

    const itemPerPage = 5
    const [pageNumber, setPageNumber] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [reload, setReload] = useState(false)


    useEffect(() => {
        //API to fetch projects
        axios.get('http://localhost:5000/getProject')
        .then(res => {
            const result = res.data
            setProjectList(result.reverse())
            generateYearsList(result)
            generateDataProject(result)

            //If the method is bidding it will return 1 otherwise it will return 2
            const method = choose === 'bidding' ? 1 : 2

            //Filter the default type bidding and ongoing progress
            const filter = result.filter((data) => data.type === method && data.status === progress)

            //Set to variable the filtered data
            setFilteredData(filter)

            //slice the filter into 5 values
            setProjectRendered(filter.slice(0, 5))

            const total = filter.length
            const answer = Math.round(total/itemPerPage)

            //If decimal it will add 1
            if (Number.isFinite(answer) || !Number.isInteger(answer)) {
                setPageNumber(answer + 1)
            }else {
                setPageNumber(answer)
            }

            // Loading ended when the fetching finished
            setLoading(false)
        })
        .catch(err => console.error(err))

    },[projectList])


    //Filter projects to render
    //It will execute only when the the user modified the filter
    useEffect(() => {
        console.log('execute1')
        setLoading(true)
        
        const modeFilter = choose === 'bidding' ? 1 : 2
        const yearFilter = filteredYear
        const progressFilter = progress
        
        if (projectList) {
            //Filter project by method
            const filteredData = projectList.filter((data) => data.type === modeFilter && data.status === progressFilter)
   
            //If the yearFilter is not all the project will filter by the selected year
            if (yearFilter !== 'all') {

                let result = []

                //Loop to find the same year by selected year
                for (let i = 0; i < filteredData.length; i++) {
                    const date = filteredData[i].date_published.substring(0, 4);
                    
                    if (date === yearFilter) {
                        result.push(filteredData[i])
                    }
                }

                setLoading(false)
                setFilteredData(result)
                setProjectRendered(result.slice(0, 5))
            }else {
                setLoading(false)
                setFilteredData(filteredData)
                setProjectRendered(filteredData.slice(0, 5))
            }
            
        }

    },[choose, progress, filteredYear])

    //After added the project in modal it will update in parents 
    const updateProjectFromModal = (project) => {
        setProjectList([...projectList, project])
    }

    //Generate the list of years
    const generateYearsList = (projects) => {

        if (projects) {
            const years = projects.map((yrs) => yrs.date_published)
            let finalList = []
            for (let i = 0; i < years.length; i++) {
                const data = years[i].substring(0,4)
                finalList.push(data)
            }
            const newData = [...new Set(finalList)]
            setYearList(newData)
        }
    }


    const handleAdd = () => {
        updateModal(true, 'add')
    }

    const handleView = (filename) => {
        updatePDF(filename)
        updatePreviewPDF(true)
    }

    const handleEdit = (data) => {
        updateSelectProject(data)
        updateModal(true, 'edit')
    }

    const handleDelete = () => {
        const pr_no = selectedFile.pr_no
        const filter = projectList.filter((bid) => bid.pr_no !== pr_no)
        setProjectList(filter)

        axios.post('http://localhost:5000/deleteProject/'+ pr_no, {data:selectedFile})
        .then(res => {
          const data = res.data
          updateMessage(data.message)
          updateIsShowMessage(true)
          setisShowDelete(false)

          setTimeout(() => {
            updateIsShowMessage(false)
          }, 5000);

        })
        .catch(err => console.error(err))
        
    }

    const handleShowDelete = (data) => {
        setSelectedFile(data)
        setisShowDelete(true)
    }

    const convertDateFormat = (date) => {
        const options = { month: 'short', day: '2-digit', year: 'numeric' };
        const finalDate = new Date(date);
        return finalDate.toLocaleDateString('en-US', options);
    }   

    const generateDataProject = (projects) => {
        const pr_choose = choose === 'bidding' ? 1 : 2
        const filteredData = projects.filter((datas) => datas.status === progress && datas.type === pr_choose )
        
        if (filteredData) {
            let pushValue = null

            if (filteredYear === 'all') {
                pushValue = filteredData
            }else {
                let finalData = []
    
                for (let i = 0; i < filteredData.length; i++) {
                    const date = filteredData[i].date_published
                    const [year, month, day] = date.split('-').map(Number)
                    if (parseInt(filteredYear) === parseInt(year)) {
                        finalData.push(filteredData[i])
                    }
                }
                pushValue = finalData
            }
  
            setProjectRendered(pushValue)
        }


    }

    


    const handlePrevList = () => {
        const updatedPage = currentPage - 1

        const starting = (updatedPage - 1) * itemPerPage
        let ending = 0
        if (starting === 0) {
            ending = 5
        }else {
            ending = starting * 2
        }
        
        setProjectRendered(filteredData.slice(starting, ending))
        setCurrentPage(updatedPage)
    }

    const handleNextList = () => {
        const updatedPage = currentPage + 1

        const starting = (updatedPage - 1) * itemPerPage
        const ending = starting * 2

        console.log(starting, ending)

        setProjectRendered(filteredData.slice(starting, ending))
        setCurrentPage(updatedPage)

    }

    if (loading) {
        <LoadingComponents/>
    } 

  return (
    loading ? (
        <LoadingComponents/>
    ) : (
    <div className={style.container}>
            { modal.show &&  <div className={style.modal}><ModalComponent updateProjectFromModal={updateProjectFromModal}/></div>}
            {
                isShowDelete &&
                    <div className={style.deleteContainer}>
                        <div className={style.cardDelete}>
                        <RiDeleteBinLine size={50} color='#BF3131'/>
                        <p>Are you sure you want to delete this record?</p>
                        <div className='d-flex gap-2'>
                            <button className={style.yesBtn} onClick={handleDelete}>Yes</button>
                            <button className={style.noBtn} onClick={() => setisShowDelete(false)}>No</button>
                        </div>
                        </div>  
                    </div>
            }
            <div className={style.titleHead}>
                <h1>{choose === 'bidding' ? 'Bidding' : 'Alternative'} Table / <p id={style.progressText}>{progress}</p></h1>
            </div>
            <div className={style.menuHead}>
                <div className='d-flex gap-2 '>
                    <button className={progress === 'ongoing' ? style.btnMenuActived : style.btnMenu} onClick={() => {setProgress('ongoing')}}>Ongoing <VscServerProcess/></button>
                    <button className={progress === 'completed' ? style.btnMenuActived : style.btnMenu} onClick={() => {setProgress('completed')}}>Completed <FaRegCheckCircle/></button>
                    <select className={style.select} value={filteredYear} onChange={(e) => setfilteredYear(e.target.value)}>
                        <option value={'all'} selected>All</option>
                        {
                            yearList && 
                            yearList.map((yrs, index) => (
                                <option value={yrs} key={index}>{yrs}</option>
                            ))
                        }
                    </select>
                </div>
                <button className={style.btnAdd} onClick={handleAdd}>Add <FaPlus/></button>
            </div>
            <table className="table" id={style.table}>
                <thead>
                    <tr>
                        <th scope="col" id={style.thCornerFirst}>PR Code</th>
                        <th scope="col"  id={style.th} >Title/Project</th>
                        <th scope="col"  id={style.th} >Contractor</th>
                        <th scope="col"  id={style.th} >Contract Amount</th>
                        <th scope="col"  id={style.th} >Bac resolution</th>
                        <th scope="col"  id={style.th} >Notice of award</th>
                        {
                            choose === 'bidding' && (
                                <>
                                    <th scope="col"  id={style.th} >Contract</th>
                                    <th scope="col"  id={style.th} >Notice to proceed</th>
                                </>
                            )
                        }
                        <th scope="col"  id={style.th} >Philgeps Award Notice</th>
                        <th scope="col"  id={style.th} >Date Published</th>
                        <th scope="col"  id={style.thCornerLast} >ACTIONS</th>
                    </tr>
                </thead>
                <tbody> 
                    {
                        projectRendered.length > 0 ? ( 
                            projectRendered.map((prod, index) => (
                                <tr key={index}>
                                    <th scope="row" id={style.thValue} >{prod.pr_no}</th>
                                    <td id={style.thValue} >{prod.title}</td>
                                    <td id={style.thValue} >{prod.contractor}</td>
                                    <td id={style.thValue} >{prod.contract_amount}</td>
                                    <td id={style.thValue} >{prod.bac_resolution && <button id={style.btnView} onClick={() => handleView(prod.bac_resolution)}>View</button>}</td>
                                    <td id={style.thValue} >{prod.notice_of_award && <button id={style.btnView} onClick={() => handleView(prod.notice_of_award)}>View</button>}</td>
                                    {
                                        choose === 'bidding' && (
                                            <>
                                                <td id={style.thValue} >{prod.contract && <button id={style.btnView} onClick={() => handleView(prod.contract)}>View</button>}</td>
                                                <td id={style.thValue} >{prod.notice_to_proceed && <button id={style.btnView} onClick={() => handleView(prod.notice_to_proceed)}>View</button>}</td>
                                            </>

                                        )
                                    }
                                    
                                    <td id={style.thValue} >{prod.philgeps_award_notice && <button id={style.btnView} onClick={() => handleView(prod.philgeps_award_notice)}>View</button>}</td>
                                    <td id={style.thValue} >{convertDateFormat(prod.date_published)}</td>
                                    <td id={style.thValue} ><button id={style.btnEdit} onClick={() => handleEdit(prod)}>Edit</button> <button id={style.btnDelete} onClick={() => handleShowDelete(prod)}>Delete</button></td>
                                </tr>
                            ))
                        ) : (
                            <td colSpan={9}>no files.</td>
                        )
                    }

                </tbody>
            </table>
            <div className={style.menuBot}>
                <p>Total: {filteredData ? filteredData.length : 0}</p>
                <div className='d-flex gap-2'>
                    <button className={style.btnNext} disabled={currentPage === 1} onClick={handlePrevList} ><GrPrevious/> Prev </button>
                    <button className={style.btnNext} disabled={currentPage === pageNumber || projectRendered && projectRendered.length < 5} onClick={filteredData && projectRendered.length >= 5 ? handleNextList : null}> Next <GrNext/></button>
                </div>
                
                
                
            </div>
        </div>
    )
 
  )
}

export default ProjectsPage