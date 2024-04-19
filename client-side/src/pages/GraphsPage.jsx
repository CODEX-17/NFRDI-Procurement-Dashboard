import React, { useEffect, useState } from 'react'
import PieChart from '../components/PieChart'
import style from './GraphsPage.module.css'
import axios from 'axios'


const GraphsPage = () => {

    const [projectList, setProjectList] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:5000/getProject')
        .then(res => {
            setProjectList(res.data)
        })
        .catch(err => console.error(err))

    },[])

    const filterProject = (type) => {
        if (projectList) {
            const result = projectList.filter((data) => data.type === type)
            return result
        }
        return 0
    }   

  return (
    <div className={style.container}>
        <div className={style.horizontal}>
            <div className={style.leftCon}>
                <div className='d-flex gap-5 h-50'>
                    <div className={style.card}>
                        <h2>BIDDING Procurements</h2>
                        <p>Procurement</p>
                        <div className={style.center}>
                            <h1>{filterProject(1).length}</h1>
                            <p>total</p>
                        </div>
                        
                    </div>
                    <div className={style.card}>
                        <h2>ALTERNATIVE method</h2>
                        <p>Procurement</p>
                        <div className={style.center}>
                            <h1>{filterProject(2).length}</h1>
                            <p>total</p>
                        </div>
                    </div>
                </div>
                <div className='d-flex w-100 mt-4 h-50'>
                    <div className={style.cardTotal}>
                        <div className='d-flex flex-column align-items-start p-5'>
                            <h2>Total</h2>
                            <p>Procurement</p>
                        </div>
                        <div className='d-flex align-items-center p-5'>
                            <h1>{projectList && projectList.length}</h1>
                            <p>total</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.cardPieGraph}>
                <h2><b>Completed</b> and <b>Ongoing</b> Procurement</h2>
                <div id={style.pie}>
                    <PieChart />
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default GraphsPage