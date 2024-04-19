import React from 'react'
import style from './LoadingComponents.module.css'

const LoadingComponents = () => {
  return (
    <div className={style.container}>
        <div className={style.cardLoading}>
            <img src='/loading.gif'/>
        </div>
    </div>
  )
}

export default LoadingComponents