import React, { useState } from 'react'
import style from './DeveloperPage.module.css'
import { useNavigate } from 'react-router-dom'

const DeveloperPage = () => {

 const [rumarHover, setrumarHover] = useState(false)
 const [ninoHover, setninoHover] = useState(false)
 const navigate = useNavigate()

  return (
    <div className={style.container}>
        <div className={style.content}>
          <div>
            <button onClick={() => navigate('/')}>Back</button>
          </div>
          <div className={style.header}>
            <p>{ rumarHover || ninoHover ? 'hi, Im' : 'about' }</p>
            <h2>{ rumarHover && 'RUMAR PAMPARO' || ninoHover && 'NINO DUQUE' || !rumarHover && !ninoHover && 'DEVELOPER'}</h2>
            <div className='d-flex w-100 justify-content-end'>
                <p id={style.subTitle}>CSU INTERNS</p>
            </div>            
          </div>
          <div className={style.profile}>
            {
                rumarHover ? (<div id={style.img} onMouseLeave={() => setrumarHover(false)}>Rumar pamparo</div>) : (<img src='../../public/rumar.jpg' id={style.img} onMouseEnter={() => setrumarHover(true)} ></img>)
            }

            {
                ninoHover ? (<div id={style.img} onMouseLeave={() => setninoHover(false)}>Nino Duque</div>) : (<img src='../../public/nino.jpg' id={style.img} onMouseEnter={() => setninoHover(true)} ></img>)
            }
             
          </div>
        </div>
    </div>
  )
}

export default DeveloperPage