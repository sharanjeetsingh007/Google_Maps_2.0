import React from 'react'
import { Triangle } from 'react-loader-spinner'
import "./LoadingSpinner.css"

function LoadingSpinner({ backgroundColor }) {
    return (
        <div className='LoadingSpinner' style={{ backgroundColor: backgroundColor }}>
            <Triangle color='#003F7F' />
        </div>
    )
}

export default LoadingSpinner